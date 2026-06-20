package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterStatsRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/admin/stats/visitor", handlers.AdminVisitorStatsHandler(db))
	r.GET("/api/admin/stats/social-clicks", handlers.AdminSocialClickStatsHandler(db))
	r.GET("/api/admin/visitor-sessions", handlers.AdminVisitorSessionsListHandler(db))
}
