package handlers

import (
	"net/http"

	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetVisitorSessionsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		sessions, err := services.GetAllVisitorSessions(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, sessions)
	}
}
