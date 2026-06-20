package routes

import (
	"backend/handlers"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterMediaRoutes(r *gin.Engine, db *gorm.DB, cldSvc *services.CloudinaryService) {
	r.GET("/api/media", handlers.GetMediaHandler(db))
	r.POST("/api/media/upload", handlers.UploadMediaHandler(db, cldSvc))
	r.DELETE("/api/media/:id", handlers.DeleteMediaHandler(db, cldSvc))
	r.POST("/api/admin/media/sync-cloudinary", handlers.SyncCloudinaryMediaHandler(db, cldSvc))
}
