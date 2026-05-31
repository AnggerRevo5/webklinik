package handlers

import (
	"net/http"

	"backend/models"
	"backend/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default())

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

	return r
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
		var promo models.Promo
		if err := c.ShouldBindJSON(&promo); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
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
		var promo models.Promo
		if err := c.ShouldBindJSON(&promo); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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

func socialMediaEngagmentHandler(_ *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Implementasi untuk menangani data social media engagement
		c.JSON(http.StatusOK, gin.H{"message": "Social media engagement endpoint"})
	}
}

func socialMediaStatsHandler(_ *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Implementasi untuk menangani data social media stats
		c.JSON(http.StatusOK, gin.H{"message": "Social media stats endpoint"})
	}
}

func GBPInteractionHandler(_ *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Implementasi untuk menangani data interaksi GBP
		c.JSON(http.StatusOK, gin.H{"message": "GBP interaction endpoint"})
	}
}

func GoogleReviewHandler(_ *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Implementasi untuk menangani data Google review
		c.JSON(http.StatusOK, gin.H{"message": "Google review endpoint"})
	}
}
