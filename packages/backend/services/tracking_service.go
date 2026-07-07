package services

import (
	"backend/models"
	"fmt"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// GetRealIP membaca IP asli pengunjung.
// Prioritas: CF-Connecting-IP (Cloudflare Tunnel) → X-Forwarded-For → ClientIP bawaan Gin.
func GetRealIP(c *gin.Context) string {
	if ip := c.GetHeader("CF-Connecting-IP"); ip != "" {
		return strings.TrimSpace(ip)
	}
	if ip := c.GetHeader("X-Forwarded-For"); ip != "" {
		// Bisa berisi daftar IP terpisah koma, ambil yang pertama
		if idx := strings.Index(ip, ","); idx != -1 {
			return strings.TrimSpace(ip[:idx])
		}
		return strings.TrimSpace(ip)
	}
	return c.ClientIP()
}

// ParseUserAgent mengekstrak jenis perangkat dan nama browser dari User-Agent string.
func ParseUserAgent(ua string) (device, browser string) {
	lower := strings.ToLower(ua)

	if strings.Contains(lower, "mobile") || strings.Contains(lower, "android") ||
		strings.Contains(lower, "iphone") || strings.Contains(lower, "ipad") {
		device = "Mobile"
	} else {
		device = "Desktop"
	}

	// Urutan penting: Edge dan Opera menyertakan "chrome" di UA-nya
	switch {
	case strings.Contains(lower, "edg/") || strings.Contains(lower, "edge/"):
		browser = "Edge"
	case strings.Contains(lower, "opr/") || strings.Contains(lower, "opera"):
		browser = "Opera"
	case strings.Contains(lower, "chrome/"):
		browser = "Chrome"
	case strings.Contains(lower, "firefox/"):
		browser = "Firefox"
	case strings.Contains(lower, "safari/"):
		browser = "Safari"
	default:
		browser = "Other"
	}
	return
}

// StartSessionParams membawa data consent + device yang dikirim frontend saat
// membuka sesi baru. Consent WAJIB sudah diperoleh sebelum fungsi ini dipanggil
// (frontend tidak memanggil endpoint ini sama sekali bila consent_analytics ditolak).
type StartSessionParams struct {
	IP               string
	UA               string
	Source           string
	VisitorID        string
	Resolusi         string
	Bahasa           string
	ConsentAnalytics bool
}

// StartSession membuat baris baru di visitor_sessions dan mengembalikan session_id.
// Bila ConsentAnalytics false, TIDAK ada baris yang dibuat sama sekali (privacy by
// design di sisi server — bukan hanya mengandalkan frontend untuk tidak memanggil).
func StartSession(db *gorm.DB, p StartSessionParams) (string, error) {
	if !p.ConsentAnalytics {
		return "", nil
	}

	device, browser := ParseUserAgent(p.UA)
	sessionID := uuid.New().String()
	now := time.Now()

	session := models.VisitorSession{
		SessionID:        sessionID,
		VisitorID:        p.VisitorID,
		IPAddress:        p.IP,
		Device:           device,
		Browser:          browser,
		PagesVisited:     1,
		Source:           p.Source,
		ConsentAnalytics: p.ConsentAnalytics,
		ConsentAt:        &now,
		StartedAt:        now,
	}

	// Enrichment lokasi kasar (kota/provinsi/ISP) — hanya karena consent_analytics
	// sudah dipastikan true di atas. Gagal/timeout diabaikan (bukan fatal).
	if geo := EnrichIP(p.IP); geo != nil {
		session.Kota = geo.Kota
		session.Provinsi = geo.Provinsi
		if geo.Negara != "" {
			session.Negara = geo.Negara
		}
		session.ISP = geo.ISP
	}

	if err := db.Create(&session).Error; err != nil {
		return "", err
	}
	return sessionID, nil
}

// IncrementPageview menambah pages_visited sebesar 1 tanpa membaca baris terlebih dahulu,
// dan mencatat baris page_views terpisah untuk analitik per-halaman.
func IncrementPageview(db *gorm.DB, sessionID, visitorID, halaman string) error {
	result := db.Model(&models.VisitorSession{}).
		Where("session_id = ?", sessionID).
		UpdateColumn("pages_visited", gorm.Expr("pages_visited + 1"))
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	if halaman != "" {
		db.Create(&models.PageView{
			SessionID: sessionID,
			VisitorID: visitorID,
			Halaman:   halaman,
			ViewedAt:  time.Now(),
		})
	}
	return nil
}

// EndSession mengisi ended_at dan menghitung duration_second di sisi server.
// Durasi TIDAK diambil dari frontend supaya tidak bisa dimanipulasi.
func EndSession(db *gorm.DB, sessionID string) error {
	var session models.VisitorSession
	if err := db.Where("session_id = ?", sessionID).First(&session).Error; err != nil {
		return err
	}
	now := time.Now()
	duration := int(now.Sub(session.StartedAt).Seconds())
	return db.Model(&session).Updates(map[string]interface{}{
		"ended_at":        now,
		"duration_second": duration,
	}).Error
}

// RecordSocialClick menyimpan klik ikon sosial media ke tabel social_icon_clicks.
func RecordSocialClick(db *gorm.DB, platform, sessionID, ip string) error {
	click := models.SocialIconClick{
		Platform:  platform,
		SessionID: sessionID,
		IPAddress: ip,
		ClickedAt: time.Now(),
	}
	return db.Create(&click).Error
}

// GetAllVisitorSessions mengembalikan semua visitor sessions.
func GetAllVisitorSessions(db *gorm.DB) ([]models.VisitorSession, error) {
	var sessions []models.VisitorSession
	if err := db.Find(&sessions).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data visitor session: %w", err)
	}
	return sessions, nil
}
