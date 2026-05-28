package handlers

import (
	"net/http"

	_ "backend/models"
	"backend/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/api/pasien", func(c *gin.Context) {
		pasien, err := services.Pasien(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, pasien)
	})
	return r
}

func pasienHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		pasien, err := services.Pasien(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, pasien)
	}
}

func adminHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		admin, err := services.Admin(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, admin)
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

func kamarHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		kamar, err := services.Kamar(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, kamar)
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

func artikelKategoriHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		artikelKategori, err := services.ArtikelKategori(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, artikelKategori)
	}
}

func artikelHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		artikel, err := services.Artikel(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, artikel)
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

func jadwalDokterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		jadwalDokter, err := services.JadwalDokter(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, jadwalDokter)
	}
}

func pesanKontakHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		pesanKontak, err := services.PesanKontak(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, pesanKontak)
	}
}

func siteConfigHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		siteConfig, err := services.SiteConfig(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, siteConfig)
	}
}

func socialLinkHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		socialLink, err := services.SocialLink(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, socialLink)
	}
}

func jamOperasionalHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		jamOperasional, err := services.JamOperasional(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, jamOperasional)
	}
}

func KlikWhatappHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		klikWhatsapp, err := services.KlikWhatsapp(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, klikWhatsapp)
	}
}

