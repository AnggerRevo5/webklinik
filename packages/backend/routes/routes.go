package routes

import (
	"backend/middleware"
	"backend/services"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, dbKhanza *gorm.DB, cldSvc *services.CloudinaryService) *gin.Engine {
	r := gin.Default()
	r.MaxMultipartMemory = 10 << 20

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

	// Rate limiter global: 120 request per menit per IP
	globalLimiter := middleware.NewRateLimiter(120, time.Minute)
	r.Use(globalLimiter.Middleware())

	// Admin auth: semua POST/PUT/PATCH/DELETE perlu X-Admin-Key kecuali path public
	r.Use(middleware.AdminAuth())

	registerRoutes(r, db, dbKhanza, cldSvc)
	return r
}

func registerRoutes(r *gin.Engine, db *gorm.DB, dbKhanza *gorm.DB, cldSvc *services.CloudinaryService) {
	// Rate limiter ketat untuk pendaftaran: 10 request per menit per IP
	pendaftaranLimiter := middleware.NewRateLimiter(10, time.Minute)

	RegisterHomeRoutes(r, db)
	RegisterBannerRoutes(r, db)
	RegisterLayananRoutes(r, db)
	RegisterPromoRoutes(r, db)
	RegisterGaleriRoutes(r, db)
	RegisterEventRoutes(r, db)
	RegisterArtikelRoutes(r, db)
	RegisterReviewRoutes(r, db)
	RegisterMediaRoutes(r, db, cldSvc)
	RegisterDokterFotoRoutes(r, db)
	RegisterDokterPublikRoutes(r, db, dbKhanza)
	RegisterDokterKhanzaRoutes(r, dbKhanza)
	RegisterJadwalDokterRoutes(r, dbKhanza)
	RegisterPendaftaranRoutes(r, dbKhanza, pendaftaranLimiter)
	RegisterTrackingRoutes(r, db)
	RegisterSosmedRoutes(r, db)
	RegisterStatsRoutes(r, db)
}
