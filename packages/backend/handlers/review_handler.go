package handlers

import (
	"net/http"
	"strconv"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ratingFromCacheOrKlinikInfo mengembalikan rating & jumlah ulasan dari cache
// Google Business bila sudah pernah di-refresh, kalau tidak jatuh ke nilai
// manual di KlinikInfo. link_gmaps selalu dari KlinikInfo karena RapidAPI
// Local Business Data yang dipakai di sini tidak mengembalikan link Maps.
// Logika intinya ada di services.RatingSummary (dipakai juga oleh
// services/home_service.go untuk hero halaman utama) supaya kedua halaman
// selalu konsisten menampilkan rating yang sama.
func ratingFromCacheOrKlinikInfo(db *gorm.DB, info models.KlinikInfo) (float64, int) {
	return services.RatingSummary(db, info.RatingGoogle, info.TotalUlasan)
}

// ratingBreakdownFromCacheOrReviews mengembalikan distribusi jumlah ulasan per
// bintang (5..1). Sumber utama: google_business_cache.rating_5..rating_1 (dari
// reviews_per_rating RapidAPI, mencakup SEMUA ulasan Google — bukan cuma yang
// di-cache lokal). Fallback: hitung dari testimoni manual (tabel review) bila
// cache belum pernah di-refresh.
func ratingBreakdownFromCacheOrReviews(db *gorm.DB, reviews []models.Review) map[string]int {
	var cache models.GoogleBusinessCache
	if db.Order("id ASC").First(&cache).Error == nil && cache.Rating > 0 {
		return map[string]int{
			"5": cache.Rating5,
			"4": cache.Rating4,
			"3": cache.Rating3,
			"2": cache.Rating2,
			"1": cache.Rating1,
		}
	}
	breakdown := map[string]int{"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}
	for _, r := range reviews {
		key := strconv.Itoa(r.Rating)
		if _, ok := breakdown[key]; ok {
			breakdown[key]++
		}
	}
	return breakdown
}

// GET /api/review — public, hanya tampil=true
func GetReviewPublicHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var reviews []models.Review
		db.Where("tampil = ?", true).
			Order("featured DESC, urutan ASC, created_at DESC").
			Find(&reviews)

		var info models.KlinikInfo
		db.First(&info)
		ratingGoogle, totalUlasan := ratingFromCacheOrKlinikInfo(db, info)

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data": gin.H{
				"reviews": reviews,
				"summary": gin.H{
					"rating_google":     ratingGoogle,
					"total_ulasan":      totalUlasan,
					"link_gmaps":        info.LinkGmaps,
					"rating_breakdown":  ratingBreakdownFromCacheOrReviews(db, reviews),
				},
			},
		})
	}
}

// GET /api/admin/review — semua review termasuk yang disembunyikan
func AdminGetReviewHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var reviews []models.Review
		db.Order("featured DESC, urutan ASC, created_at DESC").Find(&reviews)

		var info models.KlinikInfo
		db.First(&info)
		ratingGoogle, totalUlasan := ratingFromCacheOrKlinikInfo(db, info)

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"reviews": reviews,
			"summary": gin.H{
				"rating_google":    ratingGoogle,
				"total_ulasan":     totalUlasan,
				"link_gmaps":       info.LinkGmaps,
				"rating_breakdown": ratingBreakdownFromCacheOrReviews(db, reviews),
			},
		})
	}
}

// GET /api/admin/review/summary
func AdminGetReviewSummaryHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var info models.KlinikInfo
		db.First(&info)
		ratingGoogle, totalUlasan := ratingFromCacheOrKlinikInfo(db, info)
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data": gin.H{
				"rating_google":    ratingGoogle,
				"total_ulasan":     totalUlasan,
				"link_gmaps":       info.LinkGmaps,
				"rating_breakdown": ratingBreakdownFromCacheOrReviews(db, nil),
			},
		})
	}
}

// PUT /api/admin/review/summary — update rating & total ulasan (manual)
func AdminUpdateReviewSummaryHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			RatingGoogle float64 `json:"rating_google"`
			TotalUlasan  int     `json:"total_ulasan"`
			LinkGmaps    string  `json:"link_gmaps"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
			return
		}
		var info models.KlinikInfo
		if db.First(&info).Error != nil {
			info = models.KlinikInfo{RatingGoogle: body.RatingGoogle, TotalUlasan: body.TotalUlasan, LinkGmaps: body.LinkGmaps}
			db.Create(&info)
		} else {
			db.Model(&info).Updates(map[string]interface{}{
				"rating_google": body.RatingGoogle,
				"total_ulasan":  body.TotalUlasan,
				"link_gmaps":    body.LinkGmaps,
			})
		}
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

// POST /api/admin/review — tambah review baru
func AdminCreateReviewHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			Nama     string `json:"nama"     binding:"required,max=100"`
			Rating   int    `json:"rating"   binding:"required,min=1,max=5"`
			Komentar string `json:"komentar" binding:"required,max=2000"`
			Tanggal  string `json:"tanggal"  binding:"required"`
			Tag      string `json:"tag"      binding:"max=50"`
			Featured bool   `json:"featured"`
			Tampil   *bool  `json:"tampil"`
			Urutan   int    `json:"urutan"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
			return
		}
		tampil := true
		if body.Tampil != nil {
			tampil = *body.Tampil
		}
		review := models.Review{
			Nama:     body.Nama,
			Rating:   body.Rating,
			Komentar: body.Komentar,
			Tanggal:  body.Tanggal,
			Tag:      body.Tag,
			Featured: body.Featured,
			Tampil:   tampil,
			Urutan:   body.Urutan,
		}
		if err := db.Create(&review).Error; err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusCreated, gin.H{"success": true, "data": review})
	}
}

// PUT /api/admin/review/:id — edit review
func AdminUpdateReviewHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var body struct {
			Nama     string `json:"nama"     binding:"max=100"`
			Rating   int    `json:"rating"`
			Komentar string `json:"komentar" binding:"max=2000"`
			Tanggal  string `json:"tanggal"`
			Tag      string `json:"tag"      binding:"max=50"`
			Featured bool   `json:"featured"`
			Tampil   bool   `json:"tampil"`
			Urutan   int    `json:"urutan"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
			return
		}
		if err := db.Model(&models.Review{}).Where("id = ?", id).Updates(map[string]interface{}{
			"nama":     body.Nama,
			"rating":   body.Rating,
			"komentar": body.Komentar,
			"tanggal":  body.Tanggal,
			"tag":      body.Tag,
			"featured": body.Featured,
			"tampil":   body.Tampil,
			"urutan":   body.Urutan,
		}).Error; err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

// PATCH /api/admin/review/:id/toggle-tampil
func AdminToggleTampilHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var review models.Review
		if err := db.First(&review, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Review tidak ditemukan"})
			return
		}
		newTampil := !review.Tampil
		db.Model(&review).Update("tampil", newTampil)
		c.JSON(http.StatusOK, gin.H{"success": true, "tampil": newTampil})
	}
}

// PATCH /api/admin/review/:id/toggle-featured
func AdminToggleFeaturedHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var review models.Review
		if err := db.First(&review, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Review tidak ditemukan"})
			return
		}
		newFeatured := !review.Featured
		db.Model(&review).Update("featured", newFeatured)
		c.JSON(http.StatusOK, gin.H{"success": true, "featured": newFeatured})
	}
}

// DELETE /api/admin/review/:id
func AdminDeleteReviewHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if err := db.Delete(&models.Review{}, id).Error; err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}
