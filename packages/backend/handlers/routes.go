package handlers

import (
	"net/http"

	"backend/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/api/banner", bannerHandler(db))
	r.GET("/api/layanan", layananHandler(db))
	r.GET("/api/dokter", dokterHandler(db))
	r.GET("/api/promo", promoHandler(db))
	r.GET("/api/galeri", galeriHandler(db))
	r.GET("/api/event", eventHandler(db))
	r.GET("/api/visitor-sessions", visitorSessionHandler(db))

	return r
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
