package services

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"backend/models"

	"gorm.io/gorm"
)

var instagramHTTPClient = &http.Client{Timeout: 15 * time.Second}

// instagramAPIRequest melakukan GET ke endpoint RapidAPI Instagram Statistics
// API dengan header x-rapidapi-key/x-rapidapi-host dari env (RAPIDAPI_INSTAGRAM_KEY/
// RAPIDAPI_INSTAGRAM_HOST — env terpisah dari RAPIDAPI_KEY milik Google Business,
// supaya kedua integrasi tidak saling bergantung). Setiap request yang benar-benar
// terkirim dicatat ke instagram_api_hit_log (terlepas dari sukses/gagal).
func instagramAPIRequest(db *gorm.DB, path string, query url.Values, target interface{}) error {
	apiKey := os.Getenv("RAPIDAPI_INSTAGRAM_KEY")
	apiHost := os.Getenv("RAPIDAPI_INSTAGRAM_HOST")
	if apiKey == "" || apiHost == "" {
		return fmt.Errorf("RAPIDAPI_INSTAGRAM_KEY/RAPIDAPI_INSTAGRAM_HOST belum diatur di env")
	}

	reqURL := fmt.Sprintf("https://%s%s?%s", apiHost, path, query.Encode())
	req, err := http.NewRequest(http.MethodGet, reqURL, nil)
	if err != nil {
		return fmt.Errorf("gagal membuat request: %w", err)
	}
	req.Header.Set("x-rapidapi-key", apiKey)
	req.Header.Set("x-rapidapi-host", apiHost)

	resp, err := instagramHTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("gagal menghubungi RapidAPI: %w", err)
	}
	defer resp.Body.Close()

	if err := db.Create(&models.InstagramAPIHitLog{Endpoint: path}).Error; err != nil {
		log.Printf("[Instagram] gagal mencatat hit log untuk %s: %v", path, err)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("gagal membaca response RapidAPI: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("RapidAPI %s mengembalikan status %d: %s", path, resp.StatusCode, string(body))
	}

	if err := json.Unmarshal(body, target); err != nil {
		log.Printf("[Instagram] gagal decode response %s: %v — body: %s", path, err, string(body))
		return fmt.Errorf("gagal decode response RapidAPI: %w", err)
	}
	return nil
}

// instagramCommunity mengikuti skema nyata /community — sudah diverifikasi
// langsung dengan key aktif (curl ke akun besar yang pasti ter-index, lalu ke
// akun klinik sendiri). Followers ada di usersCount (BUKAN membersCount).
// API ini TIDAK menyediakan data following maupun jumlah post sama sekali —
// kedua kolom itu di instagram_cache akan selalu 0.
type instagramCommunity struct {
	ScreenName  string  `json:"screenName"`
	Name        string  `json:"name"`
	UsersCount  int     `json:"usersCount"`
	AvgER       float64 `json:"avgER"`
	AvgLikes    int     `json:"avgLikes"`
	AvgComments int     `json:"avgComments"`
}

type instagramCommunityResponse struct {
	Data instagramCommunity `json:"data"`
}

// FetchAndCacheInstagram menarik statistik akun Instagram dari RapidAPI dan
// menyimpannya sebagai cache singleton di db_klinik (instagram_cache). Kalau
// request gagal (network/API down), error dikembalikan TANPA mengubah baris
// cache yang sudah ada — data lama tetap dipakai oleh GetInstagramStatsHandler.
func FetchAndCacheInstagram(db *gorm.DB) error {
	profileURL := os.Getenv("INSTAGRAM_PROFILE_URL")
	if profileURL == "" {
		return fmt.Errorf("INSTAGRAM_PROFILE_URL belum diatur di env")
	}

	query := url.Values{"url": {profileURL}}

	var result instagramCommunityResponse
	if err := instagramAPIRequest(db, "/community", query, &result); err != nil {
		return fmt.Errorf("gagal ambil statistik Instagram: %w", err)
	}

	community := result.Data
	// avgER dari API umumnya berupa fraksi (0-1) — dikonversi ke persen (kolom
	// engagement_rate DECIMAL(5,2), sesuai contoh format "3.24%" di spesifikasi).
	engagementRatePercent := community.AvgER * 100

	var cache models.InstagramCache
	found := db.Order("id ASC").First(&cache).Error == nil

	cache.Followers = community.UsersCount
	// Following & PostsCount sengaja tidak diisi — API ini tidak menyediakan
	// datanya sama sekali, jadi kolomnya tetap 0 (bukan bug).
	cache.EngagementRate = engagementRatePercent
	cache.AvgLikes = community.AvgLikes
	cache.AvgComments = community.AvgComments
	cache.Username = community.ScreenName
	cache.FullName = community.Name

	if found {
		if err := db.Save(&cache).Error; err != nil {
			return err
		}
	} else if err := db.Create(&cache).Error; err != nil {
		return err
	}

	log.Println("[Instagram] FetchAndCache berhasil")
	return nil
}

// InstagramHitStats meringkas pemakaian kuota RapidAPI Instagram, terpisah
// dari HitStats milik Google Business.
type InstagramHitStats struct {
	HitsThisMonth int64      `json:"hits_this_month"`
	HitsTotal     int64      `json:"hits_total"`
	LastHitAt     *time.Time `json:"last_hit_at"`
}

// GetInstagramHitStats mengembalikan ringkasan pemakaian RapidAPI Instagram.
// Cron mingguan (Senin 08:00) menyumbang ~4-5 hit/bulan (1 hit per FetchAndCache),
// sisanya dari klik manual Refresh Data — jauh di bawah limit 50/bulan.
func GetInstagramHitStats(db *gorm.DB) (InstagramHitStats, error) {
	var stats InstagramHitStats
	if err := db.Model(&models.InstagramAPIHitLog{}).Count(&stats.HitsTotal).Error; err != nil {
		return stats, err
	}

	now := time.Now()
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	if err := db.Model(&models.InstagramAPIHitLog{}).
		Where("created_at >= ?", monthStart).
		Count(&stats.HitsThisMonth).Error; err != nil {
		return stats, err
	}

	var last models.InstagramAPIHitLog
	if err := db.Order("created_at DESC").First(&last).Error; err == nil {
		stats.LastHitAt = &last.CreatedAt
	}
	return stats, nil
}
