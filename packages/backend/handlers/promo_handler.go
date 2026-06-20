package handlers

import (
	"net/http"
	"time"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetPromoHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		promo, err := services.Promo(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, promo)
	}
}

func CreatePromoHandler(db *gorm.DB) gin.HandlerFunc {
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

func UpdatePromoHandler(db *gorm.DB) gin.HandlerFunc {
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

func DeletePromoHandler(db *gorm.DB) gin.HandlerFunc {
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
