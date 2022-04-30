package controllers

import (
	"APIGOLANGMAP/model"
	"APIGOLANGMAP/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func LoginHandler(c *gin.Context) {
	var creds model.User
	var usr model.User

	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Bad request!"})
		return
	}
	services.Db.Find(&usr, "username = ?", creds.Username)
	if usr.Username == "" || !CheckPasswordHash(creds.Password, usr.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Invalid User!"})
		return
	}

	token := services.GenerateTokenJWT(usr)

	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Access denied!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Success!", "username": creds.Username, "token": token, "access": usr.AccessMode, "uid": usr.ID})
}

func RegisterHandler(c *gin.Context) {
	var creds model.User

	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Bad request!"})
		return
	}
	hash, _ := HashPassword(creds.Password)

	creds.Password = hash
	result := services.Db.Save(&creds)
	if result.RowsAffected != 0 {
		c.JSON(http.StatusCreated, gin.H{"status": http.StatusOK, "message": "Success!", "User ID": creds.ID})
		return
	}
	c.JSON(http.StatusNotAcceptable, gin.H{"status": http.StatusNotAcceptable, "message": "Cannot be created!"})
}

func RefreshHandler(c *gin.Context) {
	var usr model.User

	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusNotAcceptable, gin.H{"status": http.StatusNotAcceptable, "message": "Cannot find this user!"})
		return
	}

	services.Db.Find(&usr, "username = ?", username)

	if usr.Username == "" || !InvalidateToken(c) {
		c.JSON(http.StatusNotAcceptable, gin.H{"status": http.StatusNotAcceptable, "message": "Cannot be created!"})
		return
	}

	token := services.GenerateTokenJWT(usr)
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Acesso não autorizado"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": http.StatusNoContent, "message": "Token atualizado com sucesso!", "token": token})
}

func LogoutHandler(c *gin.Context) {
	var usr model.User

	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusNotAcceptable, gin.H{"status": http.StatusNotAcceptable, "message": "Cannot be created!"})
		return
	}

	services.Db.Find(&usr, "username = ?", username)
	if InvalidateToken(c) {
		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Success!"})
		return
	}
}

func InvalidateToken(c *gin.Context) bool {
	token := services.InvalidateTokenJWT(c)
	if token == "" {
		return true
	}
	revoked := model.RevokedToken{
		Token: token,
	}
	result := services.Db.Save(&revoked)
	return result.RowsAffected != 0
}
