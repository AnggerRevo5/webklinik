package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterArtikelRoutes(r *gin.Engine, db *gorm.DB) {
	// Artikel publik
	r.GET("/api/artikel", handlers.GetArtikelPublicHandler(db))
	r.GET("/api/artikel/:slug", handlers.GetArtikelBySlugHandler(db))

	// Artikel admin (static routes sebelum :id)
	r.GET("/api/admin/artikel", handlers.AdminGetArtikelHandler(db))
	r.POST("/api/admin/artikel", handlers.AdminCreateArtikelHandler(db))
	r.GET("/api/admin/artikel/:id", handlers.AdminGetArtikelDetailHandler(db))
	r.PUT("/api/admin/artikel/:id", handlers.AdminUpdateArtikelHandler(db))
	r.PATCH("/api/admin/artikel/:id/publish", handlers.AdminPublishArtikelHandler(db))
	r.PATCH("/api/admin/artikel/:id/draft", handlers.AdminDraftArtikelHandler(db))
	r.DELETE("/api/admin/artikel/:id", handlers.AdminDeleteArtikelHandler(db))
}
