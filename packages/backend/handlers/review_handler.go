package handlers

import (
	"net/http"

	"backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /api/review — public, hanya tampil=true
func GetReviewPublicHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var reviews []models.Review
		db.Where("tampil = ?", true).
			Order("featured DESC, urutan ASC, created_at DESC").
			Find(&reviews)

		var info models.KlinikInfo
		db.First(&info)

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data": gin.H{
				"reviews": reviews,
				"summary": gin.H{
					"rating_google": info.RatingGoogle,
					"total_ulasan":  info.TotalUlasan,
					"link_gmaps":    info.LinkGmaps,
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

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"reviews": reviews,
			"summary": gin.H{
				"rating_google": info.RatingGoogle,
				"total_ulasan":  info.TotalUlasan,
				"link_gmaps":    info.LinkGmaps,
			},
		})
	}
}

// GET /api/admin/review/summary
func AdminGetReviewSummaryHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var info models.KlinikInfo
		db.First(&info)
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data": gin.H{
				"rating_google": info.RatingGoogle,
				"total_ulasan":  info.TotalUlasan,
				"link_gmaps":    info.LinkGmaps,
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
			Nama     string `json:"nama"     binding:"required"`
			Rating   int    `json:"rating"   binding:"required,min=1,max=5"`
			Komentar string `json:"komentar" binding:"required"`
			Tanggal  string `json:"tanggal"  binding:"required"`
			Tag      string `json:"tag"`
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
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
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
			Nama     string `json:"nama"`
			Rating   int    `json:"rating"`
			Komentar string `json:"komentar"`
			Tanggal  string `json:"tanggal"`
			Tag      string `json:"tag"`
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
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
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
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}
