package services

import (
	"APIGOLANGMAP/model"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func AuthorizationRequired() gin.HandlerFunc {

	return func(c *gin.Context) {
		if !ValidateTokenJWT(c) {
			c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Not authorized"})
			c.Abort()
		} else {
			var tokenInput, _, _ = getAuthorizationToken(c)
			token, err := jwt.ParseWithClaims(tokenInput, &model.Claims{}, func(token *jwt.Token) (interface{}, error) {
				return JwtKey, nil
			})

			if err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Not authorized"})
				c.Abort()
				return
			}

			if claims, ok := token.Claims.(*model.Claims); ok && token.Valid {
				c.Set("userid", claims.UserID)
				c.Set("username", claims.Username)
				c.Set("AccessMode", claims.AccessMode)
			}
			c.Next()
		}
	}
}

func AdminAuthorizationRequired() gin.HandlerFunc {

	return func(c *gin.Context) {
		if !ValidateTokenJWT(c) {
			c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Not authorized"})
			c.Abort()
		} else {
			var tokenInput, _, _ = getAuthorizationToken(c)
			token, err := jwt.ParseWithClaims(tokenInput, &model.Claims{}, func(token *jwt.Token) (interface{}, error) {
				return JwtKey, nil
			})

			if err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Not authorized"})
				c.Abort()
				return
			}

			if claims, ok := token.Claims.(*model.Claims); ok && token.Valid {
				c.Set("userid", claims.UserID)
				c.Set("username", claims.Username)
				if !claims.IsAdmin() {
					c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Not authorized"})
					c.Abort()
				}

			}
			c.Next()
		}
	}
}
