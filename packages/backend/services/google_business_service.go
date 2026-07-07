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

var googleBusinessHTTPClient = &http.Client{Timeout: 15 * time.Second}

// rapidAPIRequest melakukan GET ke endpoint RapidAPI Local Business Data
// dengan header x-rapidapi-key/x-rapidapi-host dari env, lalu unmarshal body
// JSON ke target. Body mentah di-log saat gagal decode agar mapping field
// mudah disesuaikan tanpa mengubah struktur kode.
//
// Setiap request yang benar-benar terkirim ke RapidAPI dicatat ke
// google_api_hit_log (terlepas dari sukses/gagal) — dipakai admin untuk
// memantau pemakaian kuota bulanan. Pencatatan gagal tidak dianggap fatal.
func rapidAPIRequest(db *gorm.DB, path string, query url.Values, target interface{}) error {
	apiKey := os.Getenv("RAPIDAPI_KEY")
	apiHost := os.Getenv("RAPIDAPI_HOST")
	if apiKey == "" || apiHost == "" {
		return fmt.Errorf("RAPIDAPI_KEY/RAPIDAPI_HOST belum diatur di env")
	}

	reqURL := fmt.Sprintf("https://%s%s?%s", apiHost, path, query.Encode())
	req, err := http.NewRequest(http.MethodGet, reqURL, nil)
	if err != nil {
		return fmt.Errorf("gagal membuat request: %w", err)
	}
	req.Header.Set("x-rapidapi-key", apiKey)
	req.Header.Set("x-rapidapi-host", apiHost)

	resp, err := googleBusinessHTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("gagal menghubungi RapidAPI: %w", err)
	}
	defer resp.Body.Close()

	if err := db.Create(&models.GoogleAPIHitLog{Endpoint: path}).Error; err != nil {
		log.Printf("[GoogleBusiness] gagal mencatat hit log untuk %s: %v", path, err)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("gagal membaca response RapidAPI: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("RapidAPI %s mengembalikan status %d: %s", path, resp.StatusCode, string(body))
	}

	if err := json.Unmarshal(body, target); err != nil {
		log.Printf("[GoogleBusiness] gagal decode response %s: %v — body: %s", path, err, string(body))
		return fmt.Errorf("gagal decode response RapidAPI: %w", err)
	}
	return nil
}

type rapidBusinessSearchResult struct {
	BusinessID string `json:"business_id"`
	Name       string `json:"name"`
}

type rapidBusinessSearchResponse struct {
	Data []rapidBusinessSearchResult `json:"data"`
}

// SearchBusinessID mencari business_id KRI Ampelgading Medical Centre lewat
// endpoint /search. Tidak menulis ke .env — hasilnya dikembalikan supaya admin
// menyalinnya sendiri ke GOOGLE_BUSINESS_ID (menulis env var dari proses yang
// sedang berjalan tidak reliable, apalagi di container).
func SearchBusinessID(db *gorm.DB) (string, error) {
	query := url.Values{
		"query":    {"KRI Ampelgading Medical Centre"},
		"region":   {"id"},
		"language": {"id"},
	}

	var result rapidBusinessSearchResponse
	if err := rapidAPIRequest(db, "/search", query, &result); err != nil {
		return "", err
	}
	if len(result.Data) == 0 {
		return "", fmt.Errorf("tidak ada hasil pencarian bisnis")
	}

	businessID := result.Data[0].BusinessID
	log.Printf("[GoogleBusiness] business_id ditemukan: %s (%s)", businessID, result.Data[0].Name)
	return businessID, nil
}

type rapidBusinessDetail struct {
	Rating           float64        `json:"rating"`
	ReviewCount      int            `json:"review_count"`
	Name             string         `json:"name"`
	FullAddress      string         `json:"full_address"`
	PhoneNumber      string         `json:"phone_number"`
	ReviewsPerRating map[string]int `json:"reviews_per_rating"`
}

type rapidBusinessDetailsResponse struct {
	Data []rapidBusinessDetail `json:"data"`
}

// rapidReview mengikuti skema nyata /business-reviews-v2 (bukan /business-reviews,
// yang tidak ada di gateway RapidAPI — sudah diverifikasi langsung dengan key aktif).
// Nama pereview ada di author_name, dan balasan pemilik di owner_response_text
// (flat, bukan object owner_response bersarang).
type rapidReview struct {
	ReviewID          string `json:"review_id"`
	AuthorName        string `json:"author_name"`
	Rating            int    `json:"rating"`
	ReviewText        string `json:"review_text"`
	ReviewDatetimeUTC string `json:"review_datetime_utc"`
	ReviewTime        string `json:"review_time"`
	OwnerResponseText string `json:"owner_response_text"`
}

type rapidBusinessReviewsResponse struct {
	Data struct {
		Reviews []rapidReview `json:"reviews"`
	} `json:"data"`
}

// RatingSummary mengembalikan rating & jumlah ulasan dari cache Google Business
// (google_business_cache) bila sudah pernah di-refresh dan rating-nya > 0;
// kalau tidak, jatuh ke nilai manual yang diberikan (biasanya dari KlinikInfo).
// Dipakai di lebih dari satu tempat (handlers/review_handler.go untuk halaman
// Tentang Kami, services/home_service.go untuk hero halaman utama) supaya
// keduanya konsisten membaca rating yang sama.
func RatingSummary(db *gorm.DB, manualRating float64, manualTotal int) (float64, int) {
	var cache models.GoogleBusinessCache
	if db.Order("id ASC").First(&cache).Error == nil && cache.Rating > 0 {
		return cache.Rating, cache.ReviewCount
	}
	return manualRating, manualTotal
}

// FetchAndCache menarik detail bisnis & ulasan terbaru dari RapidAPI, lalu
// menyimpannya sebagai cache di db_klinik (google_business_cache & google_reviews_cache).
func FetchAndCache(db *gorm.DB) error {
	businessID := os.Getenv("GOOGLE_BUSINESS_ID")
	if businessID == "" {
		return fmt.Errorf("GOOGLE_BUSINESS_ID belum diatur di env")
	}

	if err := fetchBusinessDetails(db, businessID); err != nil {
		return err
	}
	if err := fetchBusinessReviews(db, businessID); err != nil {
		return err
	}

	log.Println("[GoogleBusiness] FetchAndCache berhasil")
	return nil
}

func fetchBusinessDetails(db *gorm.DB, businessID string) error {
	query := url.Values{
		"business_id": {businessID},
		"region":      {"id"},
		"language":    {"id"},
	}

	var result rapidBusinessDetailsResponse
	if err := rapidAPIRequest(db, "/business-details", query, &result); err != nil {
		return fmt.Errorf("gagal ambil business-details: %w", err)
	}
	if len(result.Data) == 0 {
		return fmt.Errorf("business-details mengembalikan data kosong")
	}
	detail := result.Data[0]

	var cache models.GoogleBusinessCache
	found := db.Order("id ASC").First(&cache).Error == nil

	cache.Rating = detail.Rating
	cache.ReviewCount = detail.ReviewCount
	cache.Name = detail.Name
	cache.Address = detail.FullAddress
	cache.Phone = detail.PhoneNumber
	cache.Rating5 = detail.ReviewsPerRating["5"]
	cache.Rating4 = detail.ReviewsPerRating["4"]
	cache.Rating3 = detail.ReviewsPerRating["3"]
	cache.Rating2 = detail.ReviewsPerRating["2"]
	cache.Rating1 = detail.ReviewsPerRating["1"]

	if found {
		return db.Save(&cache).Error
	}
	return db.Create(&cache).Error
}

func fetchBusinessReviews(db *gorm.DB, businessID string) error {
	// limit=50: menaikkan ini TIDAK menambah jumlah hit RapidAPI bulanan — biaya
	// dihitung per panggilan API, bukan per jumlah ulasan yang di-return (sudah
	// diverifikasi langsung: limit=50 mengembalikan semua 34 ulasan klinik
	// dalam satu kali panggilan yang sama, tanpa perlu cursor/pagination).
	query := url.Values{
		"business_id": {businessID},
		"limit":       {"50"},
		"sort_by":     {"newest"},
		"region":      {"id"},
		"language":    {"id"},
	}

	var result rapidBusinessReviewsResponse
	if err := rapidAPIRequest(db, "/business-reviews-v2", query, &result); err != nil {
		return fmt.Errorf("gagal ambil business-reviews: %w", err)
	}

	// Upsert per google_review_id (bukan hapus-semua-lalu-insert) — supaya
	// refresh berkala tidak mereset kolom Tampil yang sudah dikurasi admin.
	// Ulasan lama yang sudah tidak muncul di 20 hasil terbaru tetap tersimpan.
	return db.Transaction(func(tx *gorm.DB) error {
		for _, r := range result.Data.Reviews {
			if r.ReviewID == "" {
				continue
			}
			var row models.GoogleReviewCache
			err := tx.Where(models.GoogleReviewCache{GoogleReviewID: r.ReviewID}).
				Assign(models.GoogleReviewCache{
					ReviewerName: r.AuthorName,
					Rating:       r.Rating,
					ReviewText:   r.ReviewText,
					ReviewDate:   r.ReviewTime,
					OwnerReply:   r.OwnerResponseText,
					PublishedAt:  r.ReviewDatetimeUTC,
				}).
				FirstOrCreate(&row).Error
			if err != nil {
				return err
			}
		}
		return nil
	})
}

// HitStats meringkas pemakaian kuota RapidAPI supaya admin bisa memantau
// batas paket bulanannya. HitsThisMonth dihitung dari awal bulan kalender
// berjalan (bukan rolling 30 hari), disesuaikan dengan siklus billing bulanan
// yang umum dipakai RapidAPI.
type HitStats struct {
	HitsThisMonth int64      `json:"hits_this_month"`
	HitsTotal     int64      `json:"hits_total"`
	LastHitAt     *time.Time `json:"last_hit_at"`
}

// GetHitStats mengembalikan ringkasan pemakaian RapidAPI. Setiap FetchAndCache
// = 2 hit (business-details + business-reviews-v2); cron mingguan (Senin
// 07:00) menyumbang ~8-9 hit/bulan, sisanya dari klik manual Refresh Data.
func GetHitStats(db *gorm.DB) (HitStats, error) {
	var stats HitStats
	if err := db.Model(&models.GoogleAPIHitLog{}).Count(&stats.HitsTotal).Error; err != nil {
		return stats, err
	}

	now := time.Now()
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	if err := db.Model(&models.GoogleAPIHitLog{}).
		Where("created_at >= ?", monthStart).
		Count(&stats.HitsThisMonth).Error; err != nil {
		return stats, err
	}

	var last models.GoogleAPIHitLog
	if err := db.Order("created_at DESC").First(&last).Error; err == nil {
		stats.LastHitAt = &last.CreatedAt
	}
	return stats, nil
}
