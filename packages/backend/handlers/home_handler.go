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
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, home)
	}
}
