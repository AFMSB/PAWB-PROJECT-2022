package routes

import (
	"APIGOLANGMAP/controllers"
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
