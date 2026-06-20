package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterReviewRoutes(r *gin.Engine, db *gorm.DB) {
	// Review publik
	r.GET("/api/review", handlers.GetReviewPublicHandler(db))

	// Review admin (static routes sebelum :id)
	r.GET("/api/admin/review/summary", handlers.AdminGetReviewSummaryHandler(db))
	r.PUT("/api/admin/review/summary", handlers.AdminUpdateReviewSummaryHandler(db))
	r.GET("/api/admin/review", handlers.AdminGetReviewHandler(db))
	r.POST("/api/admin/review", handlers.AdminCreateReviewHandler(db))
	r.PUT("/api/admin/review/:id", handlers.AdminUpdateReviewHandler(db))
	r.PATCH("/api/admin/review/:id/toggle-tampil", handlers.AdminToggleTampilHandler(db))
	r.PATCH("/api/admin/review/:id/toggle-featured", handlers.AdminToggleFeaturedHandler(db))
	r.DELETE("/api/admin/review/:id", handlers.AdminDeleteReviewHandler(db))
}
