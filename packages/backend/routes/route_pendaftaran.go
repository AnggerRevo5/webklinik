package routes

import (
	"backend/handlers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterPendaftaranRoutes(r *gin.Engine, dbKhanza *gorm.DB, submitLimiter *middleware.RateLimiter) {
	pendaftaran := r.Group("/api/pendaftaran")
	{
		pendaftaran.GET("/cek-pasien", handlers.CekPasienByNIKHandler(dbKhanza))
		pendaftaran.GET("/poli", handlers.GetPoliAktifHandler(dbKhanza))
		pendaftaran.GET("/dokter", handlers.GetDokterByPoliHariHandler(dbKhanza))
		pendaftaran.GET("/kuota", handlers.CekKuotaHandler(dbKhanza))
		pendaftaran.GET("/penjamin", handlers.GetPenjaminHandler(dbKhanza))
		// Rate limit ketat hanya di submit pendaftaran
		pendaftaran.POST("", submitLimiter.Middleware(), handlers.SubmitPendaftaranHandler(dbKhanza))
	}
}
