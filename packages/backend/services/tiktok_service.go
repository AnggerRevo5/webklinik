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

var tiktokHTTPClient = &http.Client{Timeout: 15 * time.Second}

// tiktokAPIRequest — pola identik instagramAPIRequest (lihat instagram_service.go),
// sengaja tidak digabung/diubah supaya implementasi Instagram tidak tersentuh.
// Pakai RAPIDAPI_INSTAGRAM_KEY/HOST yang sama (API yang sama mendukung
// beberapa jenis akun sosial, bukan cuma Instagram). Dicatat ke
// tiktok_api_hit_log (terpisah dari punya Instagram).
func tiktokAPIRequest(db *gorm.DB, path string, query url.Values, target interface{}) error {
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

	resp, err := tiktokHTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("gagal menghubungi RapidAPI: %w", err)
	}
	defer resp.Body.Close()

	if err := db.Create(&models.TiktokAPIHitLog{Endpoint: path}).Error; err != nil {
		log.Printf("[TikTok] gagal mencatat hit log untuk %s: %v", path, err)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("gagal membaca response RapidAPI: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("RapidAPI %s mengembalikan status %d: %s", path, resp.StatusCode, string(body))
	}

	if err := json.Unmarshal(body, target); err != nil {
		log.Printf("[TikTok] gagal decode response %s: %v — body: %s", path, err, string(body))
		return fmt.Errorf("gagal decode response RapidAPI: %w", err)
	}
	return nil
}

// tiktokCommunity — skema sama persis instagramCommunity (satu API yang sama,
// beda jenis akun saja). Belum diverifikasi langsung dengan URL TikTok asli
// (developer mengisi TIKTOK_PROFILE_URL sendiri), tapi endpoint & skema JSON-nya
// identik dengan yang sudah diverifikasi untuk Instagram.
type tiktokCommunity struct {
	ScreenName  string  `json:"screenName"`
	Name        string  `json:"name"`
	UsersCount  int     `json:"usersCount"`
	AvgER       float64 `json:"avgER"`
	AvgLikes    int     `json:"avgLikes"`
	AvgComments int     `json:"avgComments"`
}

type tiktokCommunityResponse struct {
	Data tiktokCommunity `json:"data"`
}

// FetchAndCacheTiktok menarik statistik akun TikTok dari RapidAPI dan
// menyimpannya sebagai cache singleton di db_klinik (tiktok_cache). Kalau
// TIKTOK_PROFILE_URL belum diisi, atau request gagal, error dikembalikan
// TANPA mengubah baris cache yang sudah ada — data lama tetap dipakai.
func FetchAndCacheTiktok(db *gorm.DB) error {
	profileURL := os.Getenv("TIKTOK_PROFILE_URL")
	if profileURL == "" {
		return fmt.Errorf("TIKTOK_PROFILE_URL belum diatur di env")
	}

	query := url.Values{"url": {profileURL}}

	var result tiktokCommunityResponse
	if err := tiktokAPIRequest(db, "/community", query, &result); err != nil {
		return fmt.Errorf("gagal ambil statistik TikTok: %w", err)
	}

	community := result.Data
	engagementRatePercent := community.AvgER * 100

	var cache models.TiktokCache
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

	log.Println("[TikTok] FetchAndCache berhasil")
	return nil
}

// TiktokHitStats meringkas pemakaian kuota RapidAPI TikTok, terpisah dari
// HitStats milik Instagram/Google Business.
type TiktokHitStats struct {
	HitsThisMonth int64      `json:"hits_this_month"`
	HitsTotal     int64      `json:"hits_total"`
	LastHitAt     *time.Time `json:"last_hit_at"`
}

func GetTiktokHitStats(db *gorm.DB) (TiktokHitStats, error) {
	var stats TiktokHitStats
	if err := db.Model(&models.TiktokAPIHitLog{}).Count(&stats.HitsTotal).Error; err != nil {
		return stats, err
	}

	now := time.Now()
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	if err := db.Model(&models.TiktokAPIHitLog{}).
		Where("created_at >= ?", monthStart).
		Count(&stats.HitsThisMonth).Error; err != nil {
		return stats, err
	}

	var last models.TiktokAPIHitLog
	if err := db.Order("created_at DESC").First(&last).Error; err == nil {
		stats.LastHitAt = &last.CreatedAt
	}
	return stats, nil
}
