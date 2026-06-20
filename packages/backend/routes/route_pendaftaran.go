package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterPendaftaranRoutes(r *gin.Engine, dbKhanza *gorm.DB) {
	pendaftaran := r.Group("/api/pendaftaran")
	{
		pendaftaran.GET("/cek-pasien", handlers.CekPasienByNIKHandler(dbKhanza))
		pendaftaran.GET("/poli", handlers.GetPoliAktifHandler(dbKhanza))
		pendaftaran.GET("/dokter", handlers.GetDokterByPoliHariHandler(dbKhanza))
		pendaftaran.GET("/kuota", handlers.CekKuotaHandler(dbKhanza))
		pendaftaran.GET("/penjamin", handlers.GetPenjaminHandler(dbKhanza))
		pendaftaran.POST("", handlers.SubmitPendaftaranHandler(dbKhanza))
	}
}
