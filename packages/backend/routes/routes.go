package routes

import (
	"backend/handlers"
	"backend/middleware"
	"backend/services"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, dbKhanza *gorm.DB, cldSvc *services.CloudinaryService) *gin.Engine {
	r := gin.Default()
	r.MaxMultipartMemory = 10 << 20

	// Trusted proxies: daftar IP/subnet proxy sah (mis. subnet container website
	// atau IP Cloudflare), dipisah koma via env TRUSTED_PROXIES. Dengan ini
	// c.ClientIP() mengurai X-Forwarded-For hanya dari proxy tepercaya, sehingga
	// rate limiter menghitung per pengunjung — bukan per proxy — dan tidak bisa
	// dipalsukan lewat header. Bila kosong, dipakai perilaku default Gin.
	if tp := os.Getenv("TRUSTED_PROXIES"); tp != "" {
		if err := r.SetTrustedProxies(strings.Split(tp, ",")); err != nil {
			log.Printf("[Router] TRUSTED_PROXIES tidak valid: %v", err)
		}
	}

	// CORS: hanya izinkan domain yang terdaftar di env ALLOWED_ORIGINS (pisahkan koma)
	// Contoh: ALLOWED_ORIGINS=http://localhost:3000,https://klinikkamu.com
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:3000"
	}
	r.Use(cors.New(cors.Config{
		AllowOrigins:  strings.Split(allowedOrigins, ","),
		AllowMethods:  []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:  []string{"Origin", "Content-Type", "Accept", "X-Admin-Key"},
		ExposeHeaders: []string{"Content-Length"},
		MaxAge:        12 * time.Hour,
	}))

	// Rate limiter global per IP per menit. Bisa disetel via RATE_LIMIT_GLOBAL.
	globalLimiter := middleware.NewRateLimiter(envInt("RATE_LIMIT_GLOBAL", 120), time.Minute)
	r.Use(globalLimiter.Middleware())

	// Admin auth: semua POST/PUT/PATCH/DELETE perlu X-Admin-Key kecuali path public
	r.Use(middleware.AdminAuth())
	// Audit log: catat semua mutasi admin yang lolos AdminAuth (harus setelah AdminAuth).
	r.Use(middleware.AuditLog(db))

	registerRoutes(r, db, dbKhanza, cldSvc)
	return r
}

func registerRoutes(r *gin.Engine, db *gorm.DB, dbKhanza *gorm.DB, cldSvc *services.CloudinaryService) {
	// Rate limiter ketat untuk pendaftaran. Bisa disetel via RATE_LIMIT_PENDAFTARAN.
	pendaftaranLimiter := middleware.NewRateLimiter(envInt("RATE_LIMIT_PENDAFTARAN", 10), time.Minute)

	RegisterHomeRoutes(r, db)
	RegisterBannerRoutes(r, db)
	RegisterLayananRoutes(r, db)
	RegisterPromoRoutes(r, db)
	RegisterGaleriRoutes(r, db)
	RegisterEventRoutes(r, db)
	RegisterArtikelRoutes(r, db)
	RegisterReviewRoutes(r, db)
	RegisterSiteSettingsRoutes(r, db)
	RegisterStaffRoutes(r, db)
	RegisterOperationalHourRoutes(r, db)
	RegisterMediaRoutes(r, db, cldSvc)
	RegisterDokterFotoRoutes(r, db)
	RegisterDokterPublikRoutes(r, db, dbKhanza)
	RegisterDokterKhanzaRoutes(r, dbKhanza)
	RegisterJadwalDokterRoutes(r, dbKhanza)
	RegisterPendaftaranRoutes(r, dbKhanza, pendaftaranLimiter)
	RegisterTrackingRoutes(r, db)
	RegisterSosmedRoutes(r, db)
	RegisterStatsRoutes(r, db)
	RegisterGoogleBusinessRoutes(r, db)
	RegisterInstagramRoutes(r, db)
	RegisterTiktokRoutes(r, db)
	RegisterFacebookRoutes(r, db)
	RegisterAdminAuthRoutes(r, db)

	// Audit log admin (butuh X-Admin-Key — path "/api/admin/" sudah wajib key
	// lewat middleware.AdminAuth untuk semua method termasuk GET).
	r.POST("/api/admin/audit-log", handlers.RecordAuditLogHandler(db))
	r.GET("/api/admin/audit-log", handlers.GetAuditLogsHandler(db))
}

// envInt membaca variabel lingkungan sebagai integer positif; mengembalikan
// nilai default bila kosong atau tidak valid.
func envInt(key string, def int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			return n
		}
	}
	return def
}
