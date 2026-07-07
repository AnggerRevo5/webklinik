package handlers

import (
	"backend/models"
	"backend/services"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// loginActions = event yang perlu diperkaya kota/negara dari IP. Sengaja
// dibatasi ke login saja (bukan setiap mutasi admin) supaya tidak memboroskan
// jatah rate limit ip-api.com (45 request/menit di tier gratis) — login admin
// jarang terjadi, beda dengan mutasi CRUD yang bisa puluhan kali per menit.
func isLoginAction(action string) bool {
	return action == "login_success" || action == "login_failed"
}

// POST /api/admin/audit-log — dipanggil dari Next.js (bukan browser langsung),
// karena identitas & kredensial admin (username) hanya diketahui di layer
// Next.js (route /api/auth), bukan di backend Go ini yang cuma tahu satu
// X-Admin-Key bersama. Dipakai untuk mencatat login/logout admin.
func RecordAuditLogHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			Actor  string `json:"actor" binding:"max=100"`
			Action string `json:"action" binding:"max=100"`
			Detail string `json:"detail" binding:"max=500"`
		}
		if err := c.ShouldBindJSON(&body); err != nil || body.Action == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "action diperlukan"})
			return
		}

		ip := c.GetHeader("X-Forwarded-For")
		if ip == "" {
			ip = c.ClientIP()
		}

		entry := models.AuditLog{
			Actor:     body.Actor,
			Action:    body.Action,
			Method:    "POST",
			Path:      "/api/auth",
			IPAddress: ip,
			UserAgent: c.GetHeader("User-Agent"),
			Detail:    body.Detail,
			CreatedAt: time.Now(),
		}

		if isLoginAction(body.Action) {
			if geo := services.EnrichIP(ip); geo != nil {
				entry.Kota = geo.Kota
				entry.Negara = geo.Negara
			}
		}

		// Deteksi lokasi tak biasa: hanya untuk login BERHASIL, bandingkan
		// dengan kota login berhasil terakhir milik actor yang sama.
		if body.Action == "login_success" && entry.Kota != "" {
			var prev models.AuditLog
			err := db.Where("action = ? AND actor = ? AND kota != ''", "login_success", body.Actor).
				Order("created_at DESC").
				First(&prev).Error
			if err == nil && prev.Kota != "" && prev.Kota != entry.Kota {
				entry.Detail = "PERINGATAN: lokasi berbeda dari login sebelumnya (" + prev.Kota + ") — " + entry.Detail
			}
		}

		db.Create(&entry)
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

// GET /api/admin/audit-log — daftar aktivitas terbaru untuk keperluan
// penelusuran. Superadmin only — role "admin" tidak boleh melihat audit log.
func GetAuditLogsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !requireSuperadmin(c) {
			return
		}
		var logs []models.AuditLog
		if err := db.Order("created_at DESC").Limit(200).Find(&logs).Error; err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": logs})
	}
}
