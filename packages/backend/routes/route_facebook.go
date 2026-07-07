package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterFacebookRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/facebook-stats", handlers.GetFacebookStatsHandler(db))
	r.POST("/api/admin/facebook/refresh", handlers.AdminRefreshFacebookHandler(db))
	r.GET("/api/admin/facebook/hit-stats", handlers.AdminGetFacebookHitStatsHandler(db))
}
