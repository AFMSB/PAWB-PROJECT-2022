package controllers

import (
	"APIGOLANGMAP/model"
	"APIGOLANGMAP/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func SearchUsersByUsername(c *gin.Context) {
	username := c.Request.URL.Query().Get("username") //<---- here!

	var users []model.User
	services.Db.Select("id, username").Where("username LIKE ?", "%"+username+"%").Where("access_mode != -1").Find(&users)

	if len(users) <= 0 {
		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Empty list!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "users": users})
}
