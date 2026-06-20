package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterGaleriRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/galeri", handlers.GetGaleriHandler(db))
	r.POST("/api/galeri", handlers.CreateGaleriHandler(db))
	r.PUT("/api/galeri/:id", handlers.UpdateGaleriHandler(db))
	r.DELETE("/api/galeri/:id", handlers.DeleteGaleriHandler(db))
}
