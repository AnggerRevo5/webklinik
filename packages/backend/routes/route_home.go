package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterHomeRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/home", handlers.GetHomeHandler(db))
}
