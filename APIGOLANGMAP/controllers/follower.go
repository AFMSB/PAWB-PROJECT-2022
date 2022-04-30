package controllers

import (
	"APIGOLANGMAP/model"
	"APIGOLANGMAP/services"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type res struct {
	Name  string
	Email string
	ID    int
}
type UserFollower struct {
	Id         uint   `json:"id"`
	Username   string `json:"username" gorm:"unique"`
	Created_at string `json:"created_at"`
	Updated_at string `json:"updated_at"`
}

func FetchAllFollowers(userID uint) []UserFollower {
	var users []UserFollower
	services.Db.Table("users").Select("users.id, users.username, followers.created_at, followers.updated_at").Joins("JOIN followers on followers.follower_user_id = users.id").Where("followers.user_id = ?  and users.access_mode != -1 and followers.deleted_at is null", userID).Find(&users)

	return users
}

func FetchFollowingUsers(userID uint) []UserFollower {
	var followingUsers []UserFollower
	services.Db.Table("users").Select("users.id, users.username, followers.created_at, followers.updated_at").Joins("JOIN followers on followers.user_id = users.id").Where("followers.follower_user_id = ? and users.access_mode != -1 and followers.deleted_at is null", userID).Find(&followingUsers)
	return followingUsers
}

func GetAllFollowingUsers(c *gin.Context) {
	userID, errAuth := c.Get("userid")

	if errAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Auth Token Malformed!"})
		return
	}
	followingUsers := FetchFollowingUsers(userID.(uint))

	if len(followingUsers) <= 0 {
		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Empty list!", "data": followingUsers})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": followingUsers})
}

func GetAllFollowers(c *gin.Context) {
	userID, errAuth := c.Get("userid")

	if errAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Auth Token Malformed!"})
		return
	}
	followers := FetchAllFollowers(userID.(uint))

	if len(followers) <= 0 {
		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Empty list!", "data": followers})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": followers})
}

func AssociateFollower(c *gin.Context) {
	userID, errAuth := c.Get("userid")

	if errAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Auth Token Malformed!"})
		return
	}

	var follower model.Follower

	if err := c.ShouldBindJSON(&follower); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Check syntax!"})
		return
	}

	follower.UserID = userID.(uint)
	// Verify userID in body exists
	var user model.User
	if err := services.Db.Where("id = ?", follower.FollowerUserID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Follower User ID Not Found"})
		return
	}
	// Verify if row already exists
	var tmpFollower model.Follower
	services.Db.Where(&model.Follower{UserID: follower.UserID, FollowerUserID: follower.FollowerUserID}).First(&tmpFollower)
	if tmpFollower.ID > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Follower User ID Already Associated"})
		return
	}

	services.Db.Save(&follower)
	followers := FetchAllFollowers(userID.(uint))

	c.JSON(http.StatusCreated, gin.H{"status": http.StatusCreated, "message": "Association Successful!", "followers": followers})

}

func DeassociateFollower(c *gin.Context) {
	userID, errAuth := c.Get("userid")

	if errAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Auth Token Malformed!"})
		return
	}

	var follower model.Follower
	if err := c.ShouldBindJSON(&follower); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Check Syntax!"})
		return
	}

	follower.UserID = userID.(uint)
	services.Db.Where(&model.Follower{UserID: follower.UserID, FollowerUserID: follower.FollowerUserID}).First(&follower)

	if follower.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "None found!"})
		return
	}

	//services.Db.Delete(&follower)
	services.Db.Exec("delete from followers where user_id = ? and follower_user_id = ?", follower.UserID, follower.FollowerUserID)
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Deassociation Successful!"})

}

func verifyUserIsFollowing(userID uint, followerUserID uint) bool {
	followingUsers := FetchFollowingUsers(userID)
	for i := 0; i < len(followingUsers); i++ {
		if followerUserID == followingUsers[i].Id {
			return true
		}
	}
	return false
}

func GetFollowerLocationsHistory(c *gin.Context) {
	type FollowerLocation struct {
		Start      string `json:"start" binding:"required"`
		End        string `json:"end" binding:"required"`
		FollowerID int    `json:"followerID" binding:"required"`
	}

	userID, errAuth := c.Get("userid")
	if errAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Auth Token Malformed!"})
		return
	}

	var followerLocation FollowerLocation
	if err := c.ShouldBindJSON(&followerLocation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Check Syntax!"})
		return
	}

	var followerUser model.User
	if err := services.Db.Where("id = ?", followerLocation.FollowerID).First(&followerUser).Error; err != nil {

		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "Follower User ID Not Found"})
		return
	}

	if !verifyUserIsFollowing(userID.(uint), followerUser.ID) {
		c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "User not authorized to check given User locations."})
		return
	}

	var startDate, errStart = ValidateDate(followerLocation.Start)
	var endDate, errEnd = ValidateDate(followerLocation.End)

	var positions []model.Position
	// Datas invalidas retorna todas as posições do utilizador
	if errStart != nil || errEnd != nil {
		if err := services.Db.Where("user_id = ?", followerUser.ID).Order("created_at DESC").Find(&positions).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "User ID Not Found"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "extra": "Invalid date, showing all locations", "message": "My Locations History", "locations": positions})
		return
	}

	// Retorna as localizações entre datas caso as datas do body estejam formatadas corretamente
	if startDate.Before(endDate) != true && !startDate.Equal(endDate) {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "End Date Must Occur After Start Date"})
		return
	}

	if startDate.Equal(endDate) {
		startDate = time.Date(startDate.Year(), startDate.Month(), startDate.Day(), 00, 00, 01, 00, time.UTC)
	}
	endDate = time.Date(endDate.Year(), endDate.Month(), endDate.Day(), 23, 59, 59, 00, time.UTC)

	if err := services.Db.Where("user_id = ? AND created_at >= ? AND created_at <= ?", followerUser.ID, startDate, endDate).Order("created_at DESC").Find(&positions).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "User ID Not Found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "My Locations History Filtered", "locations": positions})
	return
}
