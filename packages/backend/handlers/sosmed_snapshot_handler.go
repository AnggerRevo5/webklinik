package handlers

import (
	"net/http"
	"strconv"
	"time"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// parseRecordedAt mencoba parse string tanggal dengan format "2006-01-02" atau RFC3339.
// Jika gagal atau string kosong, mengembalikan zero time (service akan default ke now).
func parseRecordedAt(s string) time.Time {
	if s == "" {
		return time.Time{}
	}
	for _, layout := range []string{"2006-01-02", time.RFC3339} {
		if t, err := time.Parse(layout, s); err == nil {
			return t
		}
	}
	return time.Time{}
}

// ─── SocialMediaStats ─────────────────────────────────────────────────────────

// GET /api/admin/social-media-stats
func AdminGetSocialMediaStatsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		items, err := services.GetAllSocialMediaStats(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal mengambil data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": items})
	}
}

// POST /api/admin/social-media-stats
func AdminCreateSocialMediaStatsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			Platform       string  `json:"platform"`
			FollowerCount  uint64  `json:"follower_count"`
			EngagementRate float64 `json:"engagement_rate"`
			RecordedAt     string  `json:"recorded_at"`
		}
		if err := c.ShouldBindJSON(&body); err != nil || body.Platform == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "platform diperlukan"})
			return
		}
		m := models.SocialMediaStats{
			Platform:       body.Platform,
			FollowerCount:  body.FollowerCount,
			EngagementRate: body.EngagementRate,
			RecordedAt:     parseRecordedAt(body.RecordedAt),
		}
		if err := services.CreateSocialMediaStats(db, &m); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal menyimpan data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": m})
	}
}

// PUT /api/admin/social-media-stats/:id
func AdminUpdateSocialMediaStatsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "ID tidak valid"})
			return
		}
		var body struct {
			Platform       string  `json:"platform"`
			FollowerCount  uint64  `json:"follower_count"`
			EngagementRate float64 `json:"engagement_rate"`
			RecordedAt     string  `json:"recorded_at"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Data tidak valid"})
			return
		}
		m := models.SocialMediaStats{
			Platform:       body.Platform,
			FollowerCount:  body.FollowerCount,
			EngagementRate: body.EngagementRate,
			RecordedAt:     parseRecordedAt(body.RecordedAt),
		}
		if err := services.UpdateSocialMediaStats(db, id, &m); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal update data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": m})
	}
}

// DELETE /api/admin/social-media-stats/:id
func AdminDeleteSocialMediaStatsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "ID tidak valid"})
			return
		}
		if err := services.DeleteSocialMediaStats(db, id); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal hapus data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Data dihapus"})
	}
}

// ─── SocialMediaEngagement ────────────────────────────────────────────────────

// GET /api/admin/social-media-engagement
func AdminGetSocialMediaEngagementHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		items, err := services.GetAllSocialMediaEngagement(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal mengambil data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": items})
	}
}

// POST /api/admin/social-media-engagement
func AdminCreateSocialMediaEngagementHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			Platform      string `json:"platform"`
			LikesCount    uint64 `json:"likes_count"`
			CommentsCount uint64 `json:"comments_count"`
			SharesCount   uint64 `json:"shares_count"`
			SavesCount    uint64 `json:"saves_count"`
			RecordedAt    string `json:"recorded_at"`
		}
		if err := c.ShouldBindJSON(&body); err != nil || body.Platform == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "platform diperlukan"})
			return
		}
		m := models.SocialMediaEngagement{
			Platform:      body.Platform,
			LikesCount:    body.LikesCount,
			CommentsCount: body.CommentsCount,
			SharesCount:   body.SharesCount,
			SavesCount:    body.SavesCount,
			RecordedAt:    parseRecordedAt(body.RecordedAt),
		}
		if err := services.CreateSocialMediaEngagement(db, &m); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal menyimpan data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": m})
	}
}

// PUT /api/admin/social-media-engagement/:id
func AdminUpdateSocialMediaEngagementHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "ID tidak valid"})
			return
		}
		var body struct {
			Platform      string `json:"platform"`
			LikesCount    uint64 `json:"likes_count"`
			CommentsCount uint64 `json:"comments_count"`
			SharesCount   uint64 `json:"shares_count"`
			SavesCount    uint64 `json:"saves_count"`
			RecordedAt    string `json:"recorded_at"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Data tidak valid"})
			return
		}
		m := models.SocialMediaEngagement{
			Platform:      body.Platform,
			LikesCount:    body.LikesCount,
			CommentsCount: body.CommentsCount,
			SharesCount:   body.SharesCount,
			SavesCount:    body.SavesCount,
			RecordedAt:    parseRecordedAt(body.RecordedAt),
		}
		if err := services.UpdateSocialMediaEngagement(db, id, &m); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal update data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": m})
	}
}

// DELETE /api/admin/social-media-engagement/:id
func AdminDeleteSocialMediaEngagementHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "ID tidak valid"})
			return
		}
		if err := services.DeleteSocialMediaEngagement(db, id); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal hapus data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Data dihapus"})
	}
}

// ─── GBPInteraction ───────────────────────────────────────────────────────────

// GET /api/admin/gbp-interaction
func AdminGetGBPInteractionHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		items, err := services.GetAllGBPInteraction(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal mengambil data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": items})
	}
}

// POST /api/admin/gbp-interaction
func AdminCreateGBPInteractionHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			InteractionType string `json:"interaction_type"`
			Count           uint64 `json:"count"`
			RecordedAt      string `json:"recorded_at"`
		}
		if err := c.ShouldBindJSON(&body); err != nil || body.InteractionType == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "interaction_type diperlukan"})
			return
		}
		m := models.GBPInteraction{
			InteractionType: body.InteractionType,
			Count:           body.Count,
			RecordedAt:      parseRecordedAt(body.RecordedAt),
		}
		if err := services.CreateGBPInteraction(db, &m); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal menyimpan data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": m})
	}
}

// PUT /api/admin/gbp-interaction/:id
func AdminUpdateGBPInteractionHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "ID tidak valid"})
			return
		}
		var body struct {
			InteractionType string `json:"interaction_type"`
			Count           uint64 `json:"count"`
			RecordedAt      string `json:"recorded_at"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Data tidak valid"})
			return
		}
		m := models.GBPInteraction{
			InteractionType: body.InteractionType,
			Count:           body.Count,
			RecordedAt:      parseRecordedAt(body.RecordedAt),
		}
		if err := services.UpdateGBPInteraction(db, id, &m); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal update data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": m})
	}
}

// DELETE /api/admin/gbp-interaction/:id
func AdminDeleteGBPInteractionHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "ID tidak valid"})
			return
		}
		if err := services.DeleteGBPInteraction(db, id); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal hapus data"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Data dihapus"})
	}
}
