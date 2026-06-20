package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterBannerRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/banner", handlers.GetBannerHandler(db))
	r.POST("/api/banner", handlers.CreateBannerHandler(db))
	r.PUT("/api/banner/:id", handlers.UpdateBannerHandler(db))
	r.DELETE("/api/banner/:id", handlers.DeleteBannerHandler(db))
}
