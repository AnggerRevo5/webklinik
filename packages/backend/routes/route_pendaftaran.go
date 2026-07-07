package routes

import (
	"backend/handlers"
	"backend/middleware"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterPendaftaranRoutes(r *gin.Engine, dbKhanza *gorm.DB, submitLimiter *middleware.RateLimiter) {
	// Rate limiter ketat khusus cek-pasien (endpoint verifikasi PII). Default 5/menit/IP.
	cekPasienLimiter := middleware.NewRateLimiter(envInt("RATE_LIMIT_CEK_PASIEN", 5), time.Minute)
	// Limit kedua per-NIK (bukan per-IP): default 3 percobaan/10 menit untuk NIK yang sama,
	// supaya brute-force 4 digit terakhir NIK tidak bisa dilewati dengan gonta-ganti IP.
	cekPasienNikLimiter := middleware.NewRateLimiter(envInt("RATE_LIMIT_CEK_PASIEN_NIK", 3), 10*time.Minute)

	pendaftaran := r.Group("/api/pendaftaran")
	{
		// POST (bukan GET) supaya nik & tgl_lahir ada di body, bukan query string —
		// mencegah keduanya tercatat di access log server.
		pendaftaran.POST("/cek-pasien", cekPasienLimiter.Middleware(), handlers.CekPasienByNIKHandler(dbKhanza, cekPasienNikLimiter))
		pendaftaran.GET("/poli", handlers.GetPoliAktifHandler(dbKhanza))
		pendaftaran.GET("/dokter", handlers.GetDokterByPoliHariHandler(dbKhanza))
		pendaftaran.GET("/kuota", handlers.CekKuotaHandler(dbKhanza))
		pendaftaran.GET("/penjamin", handlers.GetPenjaminHandler(dbKhanza))
		// Rate limit ketat hanya di submit pendaftaran
		pendaftaran.POST("", submitLimiter.Middleware(), handlers.SubmitPendaftaranHandler(dbKhanza))
	}
}
