package routes

import (
	"APIGOLANGMAP/controllers"
	"APIGOLANGMAP/services"
	"github.com/gin-gonic/gin"
)

// @Summary Obter Users dado um username
// @Description Exibe a lista, sem todos os campos, de Users dado um username
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Success 200 {array} model.User
// @Router /user/search [get]
// @Failure 400 "Token Malformed"
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
// @Router /user/ [get]
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
// @Router /user/last-positions [get]
// @Failure 404 "Not found"
func GetUsersLastLocation(c *gin.Context) {
	controllers.GetUsersLastLocation(c)
}

// @Summary Alterar estado do SOS
// @Description Alterar para on/off o estado do SOS do utilizador
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Success 200 {bool} sos state
// @Router /user/sos [post]
// @Failure 400 "Bad request"
func ChangeSOSState(c *gin.Context) {
	controllers.ChangeSOSState(c)
}

// @Summary Obter a informação do utilizador
// @Description Obter a informação do utilizador
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Success 200 {object} model.User
// @Router /user/info [get]
// @Failure 400 "Bad request"
func GetUserInfo(c *gin.Context) {
	controllers.GetUserInfo(c)
}

// @Summary Obter o tempo para alertas definido pelo utilizador
// @Description Obter o tempo para alertas definido pelo utilizador
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Success 200 {int} AlertTime
// @Router /user/alert-time [get]
// @Failure 400 "Bad request"
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
