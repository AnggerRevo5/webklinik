package handlers

import (
	"net/http"
	"os"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /api/tiktok-stats — baca cache, tidak hit RapidAPI. Kalau
// TIKTOK_PROFILE_URL belum diisi sama sekali di env, balikin available:false
// (bukan error) — sesuai spesifikasi, membedakan "belum dikonfigurasi" dari
// "sudah dikonfigurasi tapi belum pernah di-fetch".
func GetTiktokStatsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if os.Getenv("TIKTOK_PROFILE_URL") == "" {
			c.JSON(http.StatusOK, gin.H{"success": true, "available": false, "data": nil})
			return
		}

		var cache models.TiktokCache
		if err := db.Order("id ASC").First(&cache).Error; err != nil {
			c.JSON(http.StatusOK, gin.H{"success": true, "available": true, "data": nil})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"success":   true,
			"available": true,
			"data": gin.H{
				"id":              cache.ID,
				"followers":       cache.Followers,
				"following":       cache.Following,
				"posts_count":     cache.PostsCount,
				"engagement_rate": cache.EngagementRate,
				"avg_likes":       cache.AvgLikes,
				"avg_comments":    cache.AvgComments,
				"username":        cache.Username,
				"full_name":       cache.FullName,
				"updated_at":      cache.UpdatedAt,
				"is_cached":       true,
			},
		})
	}
}

// POST /api/admin/tiktok/refresh — trigger manual FetchAndCacheTiktok.
func AdminRefreshTiktokHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if os.Getenv("TIKTOK_PROFILE_URL") == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "available": false, "error": "TIKTOK_PROFILE_URL belum diatur di env"})
			return
		}
		if err := services.FetchAndCacheTiktok(db); err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"success": false, "error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Data TikTok berhasil diperbarui"})
	}
}

// GET /api/admin/tiktok/hit-stats — pemakaian kuota RapidAPI TikTok.
func AdminGetTiktokHitStatsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		stats, err := services.GetTiktokHitStats(db)
		if err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": stats})
	}
}
