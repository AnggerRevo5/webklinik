package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterTiktokRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/tiktok-stats", handlers.GetTiktokStatsHandler(db))
	r.POST("/api/admin/tiktok/refresh", handlers.AdminRefreshTiktokHandler(db))
	r.GET("/api/admin/tiktok/hit-stats", handlers.AdminGetTiktokHitStatsHandler(db))
}
