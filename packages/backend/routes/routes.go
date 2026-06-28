package routes

import (
	"backend/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, dbKhanza *gorm.DB, cldSvc *services.CloudinaryService) *gin.Engine {
	r := gin.Default()
	r.MaxMultipartMemory = 10 << 20
	r.Use(cors.Default())
	registerRoutes(r, db, dbKhanza, cldSvc)
	return r
}

func registerRoutes(r *gin.Engine, db *gorm.DB, dbKhanza *gorm.DB, cldSvc *services.CloudinaryService) {
	RegisterHomeRoutes(r, db)
	RegisterBannerRoutes(r, db)
	RegisterLayananRoutes(r, db)
	RegisterPromoRoutes(r, db)
	RegisterGaleriRoutes(r, db)
	RegisterEventRoutes(r, db)
	RegisterArtikelRoutes(r, db)
	RegisterReviewRoutes(r, db)
	RegisterSiteSettingsRoutes(r, db)
	RegisterMediaRoutes(r, db, cldSvc)
	RegisterDokterFotoRoutes(r, db)
	RegisterDokterPublikRoutes(r, db, dbKhanza)
	RegisterDokterKhanzaRoutes(r, dbKhanza)
	RegisterJadwalDokterRoutes(r, dbKhanza)
	RegisterPendaftaranRoutes(r, dbKhanza)
	RegisterTrackingRoutes(r, db)
	RegisterSosmedRoutes(r, db)
	RegisterStatsRoutes(r, db)
}
