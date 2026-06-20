package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterLayananRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/layanan", handlers.GetLayananHandler(db))
	r.POST("/api/layanan", handlers.CreateLayananHandler(db))
	r.PUT("/api/layanan/:id", handlers.UpdateLayananHandler(db))
	r.DELETE("/api/layanan/:id", handlers.DeleteLayananHandler(db))
}
