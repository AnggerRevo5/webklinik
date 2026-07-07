package handlers

import (
	"net/http"

	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetEventHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		event, err := services.Event(db)
		if err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, event)
	}
}
