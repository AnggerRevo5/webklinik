package routes

import (
	"net/http"
	"time"

	"backend/handlers"
	"backend/models"
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
	// Pendaftaran online (Khanza SIK)
	pendaftaran := r.Group("/api/pendaftaran")
	{
		pendaftaran.GET("/cek-pasien", handlers.CekPasienByNIKHandler(dbKhanza))
		pendaftaran.GET("/poli", handlers.GetPoliAktifHandler(dbKhanza))
		pendaftaran.GET("/dokter", handlers.GetDokterByPoliHariHandler(dbKhanza))
		pendaftaran.GET("/kuota", handlers.CekKuotaHandler(dbKhanza))
		pendaftaran.GET("/penjamin", handlers.GetPenjaminHandler(dbKhanza))
		pendaftaran.POST("", handlers.SubmitPendaftaranHandler(dbKhanza))
	}

	r.GET("/api/dokter-publik", handlers.GetDokterPublikHandler(db, dbKhanza))
	r.PUT("/api/dokter-foto/:kd_dokter", handlers.UpdateDokterFotoHandler(db))

	// Admin dokter (dari Khanza + toggle tampil di db_klinik)
	r.GET("/api/admin/dokter", handlers.AdminGetDokterHandler(db, dbKhanza))
	r.PATCH("/api/admin/dokter/:kd_dokter/toggle-tampil", handlers.AdminToggleTampilDokterHandler(db))

	// Admin CRUD dokter langsung ke sik.dokter
	r.GET("/api/admin/spesialis", handlers.AdminGetSpesialisHandler(dbKhanza))
	r.POST("/api/admin/khanza/dokter", handlers.AdminCreateKhanzaDokterHandler(dbKhanza))
	r.PUT("/api/admin/khanza/dokter/:kd_dokter", handlers.AdminUpdateKhanzaDokterHandler(dbKhanza))
	r.DELETE("/api/admin/khanza/dokter/:kd_dokter", handlers.AdminDeleteKhanzaDokterHandler(dbKhanza))

	// Jadwal dokter (Khanza SIK)
	r.GET("/api/jadwal-dokter", handlers.GetJadwalDokterHandler(dbKhanza))
	r.POST("/api/jadwal-dokter", handlers.CreateJadwalDokterHandler(dbKhanza))
	r.PUT("/api/jadwal-dokter", handlers.UpdateJadwalDokterHandler(dbKhanza))
	r.DELETE("/api/jadwal-dokter", handlers.DeleteJadwalDokterHandler(dbKhanza))

	// Artikel publik
	r.GET("/api/artikel", handlers.GetArtikelPublicHandler(db))
	r.GET("/api/artikel/:slug", handlers.GetArtikelBySlugHandler(db))

	// Artikel admin (static routes sebelum :id)
	r.GET("/api/admin/artikel", handlers.AdminGetArtikelHandler(db))
	r.POST("/api/admin/artikel", handlers.AdminCreateArtikelHandler(db))
	r.GET("/api/admin/artikel/:id", handlers.AdminGetArtikelDetailHandler(db))
	r.PUT("/api/admin/artikel/:id", handlers.AdminUpdateArtikelHandler(db))
	r.PATCH("/api/admin/artikel/:id/publish", handlers.AdminPublishArtikelHandler(db))
	r.PATCH("/api/admin/artikel/:id/draft", handlers.AdminDraftArtikelHandler(db))
	r.DELETE("/api/admin/artikel/:id", handlers.AdminDeleteArtikelHandler(db))

	// Review publik
	r.GET("/api/review", handlers.GetReviewPublicHandler(db))

	// Review admin (static routes sebelum :id)
	r.GET("/api/admin/review/summary", handlers.AdminGetReviewSummaryHandler(db))
	r.PUT("/api/admin/review/summary", handlers.AdminUpdateReviewSummaryHandler(db))
	r.GET("/api/admin/review", handlers.AdminGetReviewHandler(db))
	r.POST("/api/admin/review", handlers.AdminCreateReviewHandler(db))
	r.PUT("/api/admin/review/:id", handlers.AdminUpdateReviewHandler(db))
	r.PATCH("/api/admin/review/:id/toggle-tampil", handlers.AdminToggleTampilHandler(db))
	r.PATCH("/api/admin/review/:id/toggle-featured", handlers.AdminToggleFeaturedHandler(db))
	r.DELETE("/api/admin/review/:id", handlers.AdminDeleteReviewHandler(db))

	// Media Library (Cloudinary)
	r.GET("/api/media", handlers.GetMediaHandler(db))
	r.POST("/api/media/upload", handlers.UploadMediaHandler(db, cldSvc))
	r.DELETE("/api/media/:id", handlers.DeleteMediaHandler(db, cldSvc))

	r.GET("/api/home", homeHandler(db))
	r.GET("/api/banner", bannerHandler(db))
	r.POST("/api/banner", createBannerHandler(db))
	r.PUT("/api/banner/:id", updateBannerHandler(db))
	r.DELETE("/api/banner/:id", deleteBannerHandler(db))
	r.GET("/api/layanan", layananHandler(db))
	r.POST("/api/layanan", createLayananHandler(db))
	r.PUT("/api/layanan/:id", updateLayananHandler(db))
	r.DELETE("/api/layanan/:id", deleteLayananHandler(db))
	r.GET("/api/dokter", dokterHandler(db))
	r.POST("/api/dokter", createDokterHandler(db))
	r.PUT("/api/dokter/:id", updateDokterHandler(db))
	r.DELETE("/api/dokter/:id", deleteDokterHandler(db))
	r.GET("/api/promo", promoHandler(db))
	r.POST("/api/promo", createPromoHandler(db))
	r.PUT("/api/promo/:id", updatePromoHandler(db))
	r.DELETE("/api/promo/:id", deletePromoHandler(db))
	r.GET("/api/galeri", galeriHandler(db))
	r.POST("/api/galeri", createGaleriHandler(db))
	r.PUT("/api/galeri/:id", updateGaleriHandler(db))
	r.DELETE("/api/galeri/:id", deleteGaleriHandler(db))
	r.GET("/api/event", eventHandler(db))
	r.GET("/api/visitor-sessions", visitorSessionHandler(db))
}

func homeHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		home, err := services.Home(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, home)
	}
}

func bannerHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		banner, err := services.Banner(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, banner)
	}
}

func createBannerHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var banner models.Banner
		if err := c.ShouldBindJSON(&banner); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.CreateBanner(db, &banner); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, banner)
	}
}

func updateBannerHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var banner models.Banner
		if err := c.ShouldBindJSON(&banner); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.UpdateBanner(db, &banner); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, banner)
	}
}

func deleteBannerHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var banner models.Banner
		if err := c.ShouldBindJSON(&banner); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.DeleteBanner(db, banner.ID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "banner dihapus"})
	}
}

func layananHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		layanan, err := services.Layanan(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, layanan)
	}
}

func createLayananHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var layanan models.Layanan
		if err := c.ShouldBindJSON(&layanan); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.CreateLayanan(db, &layanan); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, layanan)
	}
}

func updateLayananHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var layanan models.Layanan
		if err := c.ShouldBindJSON(&layanan); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.UpdateLayanan(db, &layanan); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, layanan)
	}
}

func deleteLayananHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var layanan models.Layanan
		if err := c.ShouldBindJSON(&layanan); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.DeleteLayanan(db, layanan.ID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "layanan dihapus"})
	}
}

func dokterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		dokter, err := services.Dokter(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, dokter)
	}
}

func createDokterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var dokter models.Dokter
		if err := c.ShouldBindJSON(&dokter); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.CreateDokter(db, &dokter); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, dokter)
	}
}

func updateDokterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var dokter models.Dokter
		if err := c.ShouldBindJSON(&dokter); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.UpdateDokter(db, &dokter); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, dokter)
	}
}

func deleteDokterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var dokter models.Dokter
		if err := c.ShouldBindJSON(&dokter); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.DeleteDokter(db, dokter.ID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "dokter dihapus"})
	}
}

func promoHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		promo, err := services.Promo(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, promo)
	}
}

func createPromoHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var promo models.Promo
		if err := c.ShouldBindJSON(&promo); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.CreatePromo(db, &promo); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, promo)
	}
}

func updatePromoHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var body struct {
			URL            string  `json:"url"`
			Tampil         bool    `json:"tampil"`
			TanggalMulai   *string `json:"tanggal_mulai"`
			TanggalSelesai *string `json:"tanggal_selesai"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var promo models.Promo
		if err := db.First(&promo, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "promo tidak ditemukan"})
			return
		}

		promo.URL = body.URL
		promo.Tampil = body.Tampil

		if body.TanggalMulai != nil && *body.TanggalMulai != "" {
			t, err := time.Parse("2006-01-02", *body.TanggalMulai)
			if err == nil {
				promo.TanggalMulai = &t
			}
		} else {
			promo.TanggalMulai = nil
		}

		if body.TanggalSelesai != nil && *body.TanggalSelesai != "" {
			t, err := time.Parse("2006-01-02", *body.TanggalSelesai)
			if err == nil {
				promo.TanggalSelesai = &t
			}
		} else {
			promo.TanggalSelesai = nil
		}

		if err := services.UpdatePromo(db, &promo); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, promo)
	}
}

func deletePromoHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "id tidak ditemukan"})
			return
		}

		var promo models.Promo
		if err := db.First(&promo, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "promo tidak ditemukan"})
			return
		}

		if err := services.DeletePromo(db, promo.ID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "promo dihapus"})
	}
}

func galeriHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		galeri, err := services.Galeri(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, galeri)
	}
}

func createGaleriHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var galeri models.Galeri
		if err := c.ShouldBindJSON(&galeri); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.CreateGaleri(db, &galeri); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, galeri)
	}
}

func updateGaleriHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var galeri models.Galeri
		if err := c.ShouldBindJSON(&galeri); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.UpdateGaleri(db, &galeri); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, galeri)
	}
}

func deleteGaleriHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var galeri models.Galeri
		if err := c.ShouldBindJSON(&galeri); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.DeleteGaleri(db, galeri.ID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "galeri dihapus"})
	}
}

func eventHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		event, err := services.Event(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, event)
	}
}

func visitorSessionHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		sessions, err := services.VisitorSession(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, sessions)
	}
}
