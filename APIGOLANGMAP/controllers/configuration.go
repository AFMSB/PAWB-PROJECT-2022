package controllers

import (
	"APIGOLANGMAP/model"
	"APIGOLANGMAP/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UpdateAlertTime(c *gin.Context) {
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

	type Alert struct {
		AlertTime int
	}
	var AlertTime Alert
	if err := c.ShouldBindJSON(&AlertTime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Check request!"})
		return
	}

	user.AlertTime = AlertTime.AlertTime

	if user.InvalidAlertTime() {
		c.JSON(http.StatusNotAcceptable, gin.H{"status": http.StatusNotAcceptable, "message": "Alert time is not acceptable!"})
		return
	}

	result := services.Db.Save(user)

	if result.RowsAffected != 0 {
		c.JSON(http.StatusCreated, gin.H{"status": http.StatusCreated, "message": "Success!", "User ID": user.ID, "AlertTime": user.AlertTime})
		return
	}

	c.JSON(http.StatusNotAcceptable, gin.H{"status": http.StatusNotAcceptable, "message": "Cannot be Updated!"})
}
