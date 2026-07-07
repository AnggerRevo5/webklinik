package handlers

import (
	"net/http"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /api/instagram-stats — baca cache, tidak hit RapidAPI. is_cached selalu
// true kalau ada baris (menandakan ini snapshot, bukan data live-realtime).
func GetInstagramStatsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var cache models.InstagramCache
		if err := db.Order("id ASC").First(&cache).Error; err != nil {
			c.JSON(http.StatusOK, gin.H{"success": true, "data": nil})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"success": true,
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

// POST /api/admin/instagram/refresh — trigger manual FetchAndCacheInstagram.
func AdminRefreshInstagramHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if err := services.FetchAndCacheInstagram(db); err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"success": false, "error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Data Instagram berhasil diperbarui"})
	}
}

// GET /api/admin/instagram/hit-stats — pemakaian kuota RapidAPI Instagram.
func AdminGetInstagramHitStatsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		stats, err := services.GetInstagramHitStats(db)
		if err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": stats})
	}
}
