package controllers

import (
	"APIGOLANGMAP/model"
	"APIGOLANGMAP/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

type UserFollower struct {
	Id         uint   `json:"id"`
	Username   string `json:"username" gorm:"unique"`
	Created_at string `json:"created_at"`
	Updated_at string `json:"updated_at"`
}

func FetchAllFollowers(userID uint) []UserFollower {
	var users []UserFollower
	services.Db.Table("users").Select("users.id, users.username, followers.created_at, followers.updated_at").Joins("JOIN followers on followers.follower_user_id = users.id").Where("followers.user_id = ? and followers.deleted_at is null", userID).Find(&users)

	return users
}

func FetchFollowingUsers(userID uint) []UserFollower {
	var followingUsers []UserFollower
	services.Db.Table("users").Select("users.id, users.username, followers.created_at, followers.updated_at").Joins("JOIN followers on followers.follower_user_id = users.id").Where("followers.follower_user_id = ? and users.access_mode != -1 and followers.deleted_at is null", userID).Find(&followingUsers)
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
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Bad request!"})
		return
	}

	follower.UserID = userID.(uint)
	services.Db.Where(&model.Follower{UserID: follower.UserID, FollowerUserID: follower.FollowerUserID}).First(&follower)

	if follower.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "None found!"})
		return
	}

	services.Db.Delete(&follower)
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Deassociation Successful!"})

}
