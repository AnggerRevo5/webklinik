package handlers

import (
	"net/http"
	"strconv"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /api/google-business — baca cache, tidak hit RapidAPI.
func GetGoogleBusinessHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var cache models.GoogleBusinessCache
		if err := db.Order("id ASC").First(&cache).Error; err != nil {
			c.JSON(http.StatusOK, gin.H{"success": true, "data": nil})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": cache})
	}
}

// GET /api/google-reviews — publik, hanya tampil=true, paginated.
func GetGoogleReviewsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "6"))
		if page < 1 {
			page = 1
		}
		if perPage < 1 || perPage > 50 {
			perPage = 6
		}
		offset := (page - 1) * perPage

		query := db.Model(&models.GoogleReviewCache{}).Where("tampil = ?", true)

		var total int64
		query.Count(&total)

		reviews := []models.GoogleReviewCache{}
		query.Order("id ASC").Limit(perPage).Offset(offset).Find(&reviews)

		totalPages := int((total + int64(perPage) - 1) / int64(perPage))

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    reviews,
			"pagination": gin.H{
				"page":        page,
				"per_page":    perPage,
				"total":       total,
				"total_pages": totalPages,
			},
		})
	}
}

// GET /api/admin/google-reviews — semua ulasan (tampil & tersembunyi), filter
// opsional ?rating=1..5, paginated. Untuk kurasi admin.
func AdminGetGoogleReviewsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))
		if page < 1 {
			page = 1
		}
		if perPage < 1 || perPage > 50 {
			perPage = 10
		}
		offset := (page - 1) * perPage

		query := db.Model(&models.GoogleReviewCache{})
		if ratingStr := c.Query("rating"); ratingStr != "" {
			if rating, err := strconv.Atoi(ratingStr); err == nil && rating >= 1 && rating <= 5 {
				query = query.Where("rating = ?", rating)
			}
		}

		var total int64
		query.Count(&total)

		reviews := []models.GoogleReviewCache{}
		query.Order("id ASC").Limit(perPage).Offset(offset).Find(&reviews)

		totalPages := int((total + int64(perPage) - 1) / int64(perPage))

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    reviews,
			"pagination": gin.H{
				"page":        page,
				"per_page":    perPage,
				"total":       total,
				"total_pages": totalPages,
			},
		})
	}
}

// PATCH /api/admin/google-reviews/:id/toggle-tampil
func AdminToggleTampilGoogleReviewHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var review models.GoogleReviewCache
		if err := db.First(&review, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Ulasan tidak ditemukan"})
			return
		}
		newTampil := !review.Tampil
		db.Model(&review).Update("tampil", newTampil)
		c.JSON(http.StatusOK, gin.H{"success": true, "tampil": newTampil})
	}
}

// POST /api/admin/google-business/refresh — trigger manual FetchAndCache.
func AdminRefreshGoogleBusinessHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if err := services.FetchAndCache(db); err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"success": false, "error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Data Google Business berhasil diperbarui"})
	}
}

// POST /api/admin/google-business/search-id — cari business_id sekali,
// admin menyalin hasilnya ke GOOGLE_BUSINESS_ID di .env secara manual.
func AdminSearchBusinessIDHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		businessID, err := services.SearchBusinessID(db)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"success": false, "error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "business_id": businessID})
	}
}

// GET /api/admin/google-business/hit-stats — pemakaian kuota RapidAPI, supaya
// admin bisa memantau batas paket bulanannya.
func AdminGetGoogleHitStatsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		stats, err := services.GetHitStats(db)
		if err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": stats})
	}
}
