package controllers

import (
	"APIGOLANGMAP/model"
	"APIGOLANGMAP/services"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func SearchUsersByUsername(c *gin.Context) {
	userID, errAuth := c.Get("userid")

	if errAuth == false {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "User Auth Token Malformed!"})
		return
	}

	username := c.Request.URL.Query().Get("username") //<---- here!

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
	services.Db.Find(&users)

	if len(users) <= 0 {
		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "No Users - Empty list!", "userLocs": userLocs})
		return
	}

	for i, user := range users {
		var position model.Position
		var loc LastLocation
		fmt.Print(i, user.ID, user.Username)
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
	if err := services.Db.First(&user, userID.(uint)).Error; err != nil {
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

func GetAllUsersUnderXKms(user model.User) ([]model.User, error) {
	var users []model.User

	userLastLoc, err := FetchUserLastLocation(user.ID)
	if err == nil {
		services.Db.Raw("SELECT * from (SELECT users.id, username, alert_time, sos FROM users INNER JOIN followers f on users.id = f.follower_user_id where user_id = ?) as uf where uf.id in (SELECT user_id FROM (Select distinct on (user_id) * from positions order by user_id, created_at desc) as p WHERE ST_DWithin(geolocation, ST_MakePoint(?, ?)::geography, ?));", user.ID, userLastLoc.Latitude, userLastLoc.Longitude, 10000000).Scan(&users)
	} else {
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
	var followers, _ = GetAllUsersUnderXKms(user)
	var usersStr string
	for i, user := range followers {
		if i != 0 {
			usersStr += ","
		}
		usersStr += user.Username
	}

	//fmt.Println("users str ---->", usersStr)

	services.InitConnection()
	services.SendMessage(usersStr, "An SOS alert nearby was given by "+user.Username)
}
