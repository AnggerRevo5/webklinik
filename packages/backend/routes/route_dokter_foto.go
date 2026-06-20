package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterDokterFotoRoutes(r *gin.Engine, db *gorm.DB) {
	r.PUT("/api/dokter-foto/:kd_dokter", handlers.UpdateDokterFotoHandler(db))
}
