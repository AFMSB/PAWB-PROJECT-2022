package routes

import (
	"APIGOLANGMAP/controllers"
	"APIGOLANGMAP/services"
	"github.com/gin-gonic/gin"
)

// @Summary Obtem os Followers
// @Description Exibe a lista, sem todos os campos, de todos os followers
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Success 200 {array} model.User
// @Router /follower [get]
// @Failure 404 "Not found"
func SearchUsersByUsername(c *gin.Context) {
	controllers.SearchUsersByUsername(c)
}

// @Summary Obtem todos os  Users
// @Description Exibe a lista, sem todos os campos, de todos os Users
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Success 200 {array} model.User
// @Router / [get]
// @Failure 404 "Not found"
func GetAllUsers(c *gin.Context) {
	controllers.GetAllUsers(c)
}

// @Summary Obtem última posição/localização de cada User
// @Description Exibe a lista, sem todos os campos, da última posição/localização de cada User
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Success 200 {array} model.User
// @Router /last-positions [get]
// @Failure 404 "Not found"
func GetUsersLastLocation(c *gin.Context) {
	controllers.GetUsersLastLocation(c)
}

// TODO swagger
func ChangeSOSState(c *gin.Context) {
	controllers.ChangeSOSState(c)
}

// TODO swagger
func GetUserInfo(c *gin.Context) {
	controllers.GetUserInfo(c)
}

// TODO swagger
func GetAlertTime(c *gin.Context) {
	controllers.GetAlertTime(c)
}

// @Summary Exibe uma lista de users que se encontram num raio igual a inferior a x kms
// @Description Exibe uma lista de users que se encontram num raio igual a inferior a x kms
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Success 200 {array} model.User
// @Router /users-under-xkms [post]
// @Failure 404 "Not found"
// @Failure 401 "Unauthorized"
// @Failure 500 "Internal Server Error"
func GetUsersUnderXkms(c *gin.Context) {
	controllers.GetAllUsersUnderXKms(c)
}

// @Success 200 "Connection confirm"
// @Router /socket [get]
// @Failure 404 "Connection failed"
// @Failure 400 "User Token Malformed"
func WebSocket(c *gin.Context) {
	services.InitConnectionSocket(c)
}
