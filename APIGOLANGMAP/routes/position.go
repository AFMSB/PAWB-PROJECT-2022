package routes

import (
	"APIGOLANGMAP/controllers"

	"github.com/gin-gonic/gin"
)

// @Summary Adicionar uma localizaçao
// @Description Cria uma localizacao de um utilizador em especifico
// @Tags Position
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Param evaluation body swaggermodel.PositionAddSwagger true "Add Location"
// @Router /position [post]
// @Success 201 {object} model.Position
// @Failure 400 "Bad request"
// @Failure 404 "Not found"
func RegisterLocation(c *gin.Context) {
	controllers.RegisterLocation(c)
}

// @Summary Obter a última localização do utilizador
// @Description Exibe a lista da última localização do utilizador
// @Tags Position
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Success 200 {object} model.Position
// @Router /position/ [get]
// @Failure 404 "User Not found"
// @Failure 400 "User Token Malformed"
func GetMyLocation(c *gin.Context) {
	controllers.GetLastLocation(c)
}

// @Summary Obtem todas as localizações do utilizador
// @Description Exibe a lista de todas as localizações do utilizador
// @Tags Position
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Param localization body swaggermodel.UserLocationHistory true "get locations history"
// @Success 200 {array} model.Position
// @Router /position/history [post]
// @Failure 404 "User Not found"
// @Failure 400 "User Token Malformed"
func GetLocationHistory(c *gin.Context) {
	controllers.GetLocationHistory(c)
}

// @Summary Exclui uma localização
// @Description Exclui uma localização selecionada
// @Tags Position
// @ID get-string-by-int
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Param id path int true "Position ID"
// @Router /position/{id} [delete]
// @Success 200 "Delete succeeded!"
// @Failure 404 "None found!"
func DeleteLocation(c *gin.Context) {
	controllers.DeleteLocation(c)
}

// @Summary Obtem todas as localizações dos utilizadores com filtros
// @Description Exibe a lista de localizações dos utilizadores
// @Tags Position
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Param localization body swaggermodel.UserLocationWithFilters true "Add Location"
// @Success 200 {array} model.Position
// @Router /position/filter [post]
// @Failure 404 "Location Not found"
// @Failure 400 "User Token Malformed"
func GetUsersLocationWithFilters(c *gin.Context) {
	controllers.GetUsersLocationWithFilters(c)
}

// @Summary Obtem todas as localizações do utilizador
// @Description Obtem todas as localizações do utilizador
// @Tags Position
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @param Authorization header string true "Token"
// @Param localization body swaggermodel.UserLocationHistoryUser true "Add Location"
// @Success 200 {array} model.Position
// @Router /position/history/user [post]
// @Failure 404 "UserID Not found"
// @Failure 400 "Check Syntax, Dates Malformed"
func GetUserLocationsHistory(c *gin.Context) {
	controllers.GetUserLocationsHistory(c)
}
