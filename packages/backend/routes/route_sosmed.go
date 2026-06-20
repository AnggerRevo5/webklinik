package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterSosmedRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/admin/social-media-stats", handlers.AdminGetSocialMediaStatsHandler(db))
	r.POST("/api/admin/social-media-stats", handlers.AdminCreateSocialMediaStatsHandler(db))
	r.PUT("/api/admin/social-media-stats/:id", handlers.AdminUpdateSocialMediaStatsHandler(db))
	r.DELETE("/api/admin/social-media-stats/:id", handlers.AdminDeleteSocialMediaStatsHandler(db))

	r.GET("/api/admin/social-media-engagement", handlers.AdminGetSocialMediaEngagementHandler(db))
	r.POST("/api/admin/social-media-engagement", handlers.AdminCreateSocialMediaEngagementHandler(db))
	r.PUT("/api/admin/social-media-engagement/:id", handlers.AdminUpdateSocialMediaEngagementHandler(db))
	r.DELETE("/api/admin/social-media-engagement/:id", handlers.AdminDeleteSocialMediaEngagementHandler(db))

	r.GET("/api/admin/gbp-interaction", handlers.AdminGetGBPInteractionHandler(db))
	r.POST("/api/admin/gbp-interaction", handlers.AdminCreateGBPInteractionHandler(db))
	r.PUT("/api/admin/gbp-interaction/:id", handlers.AdminUpdateGBPInteractionHandler(db))
	r.DELETE("/api/admin/gbp-interaction/:id", handlers.AdminDeleteGBPInteractionHandler(db))
}
