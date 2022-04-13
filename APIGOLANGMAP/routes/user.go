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
