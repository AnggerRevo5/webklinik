package handlers

import (
	"errors"
	"net/http"

	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// POST /api/track/session/start
func TrackSessionStartHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			Source string `json:"source"`
		}
		_ = c.ShouldBindJSON(&body) // source opsional, abaikan error binding

		ip := services.GetRealIP(c)
		ua := c.GetHeader("User-Agent")

		sessionID, err := services.StartSession(db, ip, ua, body.Source)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal membuat sesi"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"session_id": sessionID})
	}
}

// POST /api/track/session/pageview
func TrackPageviewHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			SessionID string `json:"session_id"`
		}
		if err := c.ShouldBindJSON(&body); err != nil || body.SessionID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "session_id diperlukan"})
			return
		}

		if err := services.IncrementPageview(db, body.SessionID); err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Sesi tidak ditemukan"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal update pageview"})
			}
			return
		}

		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

// POST /api/track/session/end
func TrackSessionEndHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			SessionID string `json:"session_id"`
		}
		if err := c.ShouldBindJSON(&body); err != nil || body.SessionID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "session_id diperlukan"})
			return
		}

		if err := services.EndSession(db, body.SessionID); err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Sesi tidak ditemukan"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal mengakhiri sesi"})
			}
			return
		}

		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

// POST /api/track/social-click
func TrackSocialClickHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			Platform  string `json:"platform"`
			SessionID string `json:"session_id"`
		}
		if err := c.ShouldBindJSON(&body); err != nil || body.Platform == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "platform diperlukan"})
			return
		}

		ip := services.GetRealIP(c)
		if err := services.RecordSocialClick(db, body.Platform, body.SessionID, ip); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal menyimpan klik"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}
