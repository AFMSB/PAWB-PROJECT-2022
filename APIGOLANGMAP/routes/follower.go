package routes

import (
	"APIGOLANGMAP/controllers"

	"github.com/gin-gonic/gin"
)

// @Summary Obtem os Followers
// @Description Exibe a lista, sem todos os campos, de todos os followers
// @Tags Follower
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Success 200 {array} model.Follower
// @Router /follower/ [get]
// @Failure 404 "Not found"
func GetAllFollowers(c *gin.Context) {
	controllers.GetAllFollowers(c)
}

// @Summary Obtem os users que estamos a seguir
// @Description Exibe a lista, sem todos os campos, de todos os users que estamos a seguir
// @Tags Follower
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Success 200 {array} model.Follower
// @Router /follower/following [get]
// @Failure 404 "Not found"
func GetAllFollowingUsers(c *gin.Context) {
	controllers.GetAllFollowingUsers(c)
}

// @Summary Associa um Follower(User) a um User
// @Description Associa um Follower a um User
// @Tags Follower
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Param follower body swaggermodel.FollowingSwagger	 true "Associate User as Follower"
// @Router /follower/ [post]
// @Success 200 {array} model.Follower
// @Failure 400 "Token Malformed, Check Syntax, Follower User ID Already Associated"
// @Failure 404 "User Not found"
func AssociateFollower(c *gin.Context) {
	controllers.AssociateFollower(c)
}

// @Summary Desassocia um Follower(User) de um User
// @Description Desassocia um Follower de um User
// @Tags Follower
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Param follower body swaggermodel.FollowingSwagger true "Deassociate Follower from User"
// @Router /follower/ [delete]
// @Success 200 "Deassociation Success"
// @Failure 400 "Token Malformed, Check Syntax"
// @Failure 404 "User Not found"
func DeassociateFollower(c *gin.Context) {
	controllers.DeassociateFollower(c)
}

// @Summary Obtem as localiza????es de um Follower
// @Description Obtem as localiza????es de um determinado Follower
// @Tags Follower
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Param follower body swaggermodel.FollowingHistorySwagger true "get follower locations history"
// @Router /follower/history [post]
// @Success 200 {array} model.Position
// @Failure 400 "Token Malformed, Check Syntax, Dates Malformed"
// @Failure 404 "User ID Not Found, "
// @Failure 401 "User not authorized to check given User locations."
func GetFollowerLocationsHistory(c *gin.Context) {
	controllers.GetFollowerLocationsHistory(c)
}
