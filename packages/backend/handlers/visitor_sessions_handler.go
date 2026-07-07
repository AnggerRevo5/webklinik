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
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, sessions)
	}
}
