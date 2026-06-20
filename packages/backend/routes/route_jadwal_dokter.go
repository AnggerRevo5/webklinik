package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterJadwalDokterRoutes(r *gin.Engine, dbKhanza *gorm.DB) {
	r.GET("/api/jadwal-dokter", handlers.GetJadwalDokterHandler(dbKhanza))
	r.POST("/api/jadwal-dokter", handlers.CreateJadwalDokterHandler(dbKhanza))
	r.PUT("/api/jadwal-dokter", handlers.UpdateJadwalDokterHandler(dbKhanza))
	r.DELETE("/api/jadwal-dokter", handlers.DeleteJadwalDokterHandler(dbKhanza))
}
