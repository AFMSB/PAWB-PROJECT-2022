package controllers

import (
	"APIGOLANGMAP/model"
	"APIGOLANGMAP/services"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func SearchUsersByUsername(c *gin.Context) {
	userID, errAuth := c.Get("userid")

	if errAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Auth Token Malformed!"})
		return
	}
	username := c.Param("username")
	//username := c.Request.URL.Query().Get("username") //<---- here!

	var users []model.User
	//services.Db.Select("id, username").Where("username ILIKE ?", "%"+username+"%").Where("id != ?", userID).Where("access_mode != -1").Find(&users)
	services.Db.Raw("SELECT * FROM users WHERE username ILIKE '%"+username+"%' and id not in (SELECT distinct follower_user_id FROM followers where user_id = ?) and id != ? and access_mode != -1", userID, userID).Scan(&users)

	if len(users) <= 0 {
		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Empty list!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "users": users})
}

func GetAllUsers(c *gin.Context) {

	var users []model.User
	services.Db.Find(&users)

	if len(users) <= 0 {
		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Empty list!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "users": users})
}

func GetUsersLastLocation(c *gin.Context) {
	type LastLocation struct {
		LocID     uint
		UserID    uint
		CreatedAt time.Time
		Lat       float32
		Long      float32
	}
	var userLocs []LastLocation

	var users []model.User
	var myUser model.User

	services.Db.Find(&users)

	if len(users) <= 0 {
		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "No Users - Empty list!", "userLocs": userLocs})
		return
	}

	userID, errAuth := c.Get("userid")

	if errAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Auth Token Malformed!"})
		return
	}
	services.Db.First(&myUser, userID)
	

	for _, user := range users {
		var position model.Position
		var loc LastLocation
		if err := services.Db.Where("user_id = ?", user.ID).Order("created_at DESC").First(&position).Error; err != nil {
			//c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "User ID Not Found"})
		} else {
			loc.LocID = position.ID
			loc.UserID = user.ID
			loc.CreatedAt = position.CreatedAt
			loc.Lat = position.Latitude
			loc.Long = position.Longitude
			userLocs = append(userLocs, loc)
		}
	}
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Users Last Locations", "userLocs": userLocs})
	return

}

func GetUserInfo(c *gin.Context) {
	userID, errAuth := c.Get("userid")

	if errAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Auth Token Malformed!"})
		return
	}

	var user model.User
	if err := services.Db.Preload("UserFriends").Preload("UserPositions").First(&user, userID.(uint)).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Not Found."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "User Information", "user": user})
	return
}

func ChangeSOSState(c *gin.Context) {
	userID, errAuth := c.Get("userid")

	if errAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Auth Token Malformed!"})
		return
	}

	var user model.User
	if err := services.Db.First(&user, userID.(uint)).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Not Found."})
		return
	}

	user.SOS = !user.SOS
	if user.SOS == true {
		SendDangerZoneAlert2Followers(userID.(uint))
	}
	services.Db.Save(&user)
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "SOS State Changed!", "sos": user.SOS})
	return
}

func GetAlertTime(c *gin.Context) {
	userID, errAuth := c.Get("userid")

	if errAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Auth Token Malformed!"})
		return
	}

	var user model.User
	if err := services.Db.First(&user, userID.(uint)).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Not Found."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "User AlertTime!", "AlertTime": user.AlertTime})
	return
}

func GetAllUsersUnderXKms(c *gin.Context) {
	userID, errAuth := c.Get("userid")

	var bodyData struct {
		Radius int `json:"Radius"`
	}

	if errAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Auth Token Malformed!"})
		return
	}

	var user model.User
	if err := services.Db.First(&user, userID.(uint)).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "User Not Found."})
		return
	}

	if err := c.BindJSON(&bodyData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Need to send a radius - Bad request!"})
		return
	}

	if bodyData.Radius > 10000 {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Radius field represents the distance in kilometers and must be an integer equal to or less than 10 thousand (10 000)"})
		return
	}

	users, err := FetchAllUsersUnderXKms(user, bodyData.Radius*1000)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": http.StatusInternalServerError, "message": "Error", "Error": err})
		return
	}

	if users == nil {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "message": "the user has no locations"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Success", "Users": users})
	return
}

func FetchAllUsersUnderXKms(user model.User, radius int) ([]model.User, error) {
	var users []model.User

	userLastLoc, err := FetchUserLastLocation(user.ID)
	if err == nil {
		services.Db.Raw("SELECT * from (SELECT users.id, username, alert_time, sos FROM users INNER JOIN followers f on users.id = f.follower_user_id where user_id = ?) as uf where uf.id in (SELECT user_id FROM (Select distinct on (user_id) * from positions order by user_id, created_at desc) as p WHERE ST_DWithin(geolocation, ST_MakePoint(?, ?)::geography, ?));", user.ID, userLastLoc.Longitude, userLastLoc.Latitude, radius).Scan(&users)
	} else {
		if users == nil {
			return nil, nil
		}
		return users, err
	}
	return users, err
}

func FetchUserLastLocation(userID uint) (model.Position, error) {
	var position model.Position
	err := services.Db.Where("user_id = ?", userID).Order("created_at DESC").First(&position).Error
	return position, err
}

func SendDangerZoneAlert2Followers(userID uint) {
	var user model.User
	services.Db.Find(&user, userID)
	var followers, _ = FetchAllUsersUnderXKms(user, 30*1000)

	for _, follower := range followers {
		services.Sender(follower.ID, fmt.Sprintf("%s has activated SOS mode near you, you are receiving this message because you are following him and your last location is within a 30 km radius of where SOS mode was activated.", user.Username))
	}
}
