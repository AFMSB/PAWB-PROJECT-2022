package services

import (
	"APIGOLANGMAP/docs"
)

func FormatSwagger() {
	//http://localhost:8081/swagger/index.html
	docs.SwaggerInfo.Title = "API de Localizações SOS"
	docs.SwaggerInfo.Description = "Essa api permite manter o historico de localizações dos seus utilizadores, e alertar quando alguma pessoa se encontra desaparecida."
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "api.secureme.pt"
	// docs.SwaggerInfo.Host = "127.0.0.1:8080"
	docs.SwaggerInfo.BasePath = "/api/v1"
	docs.SwaggerInfo.Schemes = []string{"https"}
}
