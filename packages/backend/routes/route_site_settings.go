package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterSiteSettingsRoutes(r *gin.Engine, db *gorm.DB) {
	// Publik
	r.GET("/api/site-settings", handlers.GetSiteSettingsHandler(db))

	// Admin
	r.GET("/api/admin/site-settings", handlers.AdminGetSiteSettingsHandler(db))
	r.PUT("/api/admin/site-settings", handlers.AdminUpdateSiteSettingsHandler(db))
}
