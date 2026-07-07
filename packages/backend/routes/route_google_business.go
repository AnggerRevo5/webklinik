package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterGoogleBusinessRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/google-business", handlers.GetGoogleBusinessHandler(db))
	r.GET("/api/google-reviews", handlers.GetGoogleReviewsHandler(db))
	r.GET("/api/admin/google-reviews", handlers.AdminGetGoogleReviewsHandler(db))
	r.PATCH("/api/admin/google-reviews/:id/toggle-tampil", handlers.AdminToggleTampilGoogleReviewHandler(db))
	r.POST("/api/admin/google-business/refresh", handlers.AdminRefreshGoogleBusinessHandler(db))
	r.POST("/api/admin/google-business/search-id", handlers.AdminSearchBusinessIDHandler(db))
	r.GET("/api/admin/google-business/hit-stats", handlers.AdminGetGoogleHitStatsHandler(db))
}
