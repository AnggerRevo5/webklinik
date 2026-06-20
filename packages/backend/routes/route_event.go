package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterEventRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/event", handlers.GetEventHandler(db))
}
