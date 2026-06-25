package handlers

import (
	"net/http"

	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetHomeHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		home, err := services.HomePublik(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, home)
	}
}
