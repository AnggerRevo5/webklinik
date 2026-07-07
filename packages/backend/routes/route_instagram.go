package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterInstagramRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/instagram-stats", handlers.GetInstagramStatsHandler(db))
	r.POST("/api/admin/instagram/refresh", handlers.AdminRefreshInstagramHandler(db))
	r.GET("/api/admin/instagram/hit-stats", handlers.AdminGetInstagramHitStatsHandler(db))
}
