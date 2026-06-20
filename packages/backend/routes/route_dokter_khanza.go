package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterDokterKhanzaRoutes(r *gin.Engine, dbKhanza *gorm.DB) {
	r.GET("/api/admin/spesialis", handlers.AdminGetSpesialisHandler(dbKhanza))
	r.POST("/api/admin/khanza/dokter", handlers.AdminCreateKhanzaDokterHandler(dbKhanza))
	r.PUT("/api/admin/khanza/dokter/:kd_dokter", handlers.AdminUpdateKhanzaDokterHandler(dbKhanza))
	r.DELETE("/api/admin/khanza/dokter/:kd_dokter", handlers.AdminDeleteKhanzaDokterHandler(dbKhanza))
}
