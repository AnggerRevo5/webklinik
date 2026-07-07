package services

import (
	"backend/models"
	"log"

	"gorm.io/gorm"
)

// HomePublikData hanya berisi data yang ditampilkan di halaman publik website.
// Jauh lebih ringan dari HomeData lama yang mengambil semua tabel analytics.
type HomePublikData struct {
	Banner           []models.Banner          `json:"banner"`
	Layanan          []models.Layanan         `json:"layanan"`
	Promo            []models.Promo           `json:"promo"`
	KlinikInfo       *models.KlinikInfo       `json:"klinik_info,omitempty"`
	SiteSettings     []models.SiteSetting     `json:"site_settings"`
	OperationalHours []models.OperationalHour `json:"operational_hours"`
}

// HomePublik mengambil hanya 3 tabel + klinik_info untuk halaman publik.
// Sebelumnya Home() mengambil 12 tabel termasuk analytics yang tidak dipakai frontend.
func HomePublik(db *gorm.DB) (HomePublikData, error) {
	var data HomePublikData

	tryFind := func(dest interface{}, label string) {
		if err := db.Find(dest).Error; err != nil {
			log.Printf("WARNING home/%s: %v", label, err)
		}
	}

	tryFind(&data.Banner, "banner")
	tryFind(&data.Layanan, "layanan")

	if promos, err := PromoPublik(db); err != nil {
		log.Printf("WARNING home/promo: %v", err)
		data.Promo = []models.Promo{}
	} else {
		data.Promo = promos
	}

	// Error dari First() sengaja diabaikan (sama seperti handlers/review_handler.go)
	// — kalau tabel klinik_info belum ada isinya sama sekali, klinikInfo tetap
	// struct kosong (rating_google=0), tapi RatingSummary di bawah tetap bisa
	// mengisinya dari cache Google Business. Tanpa ini, klinik_info tidak pernah
	// dikirim ke frontend sama sekali kalau baris manualnya belum pernah dibuat.
	var klinikInfo models.KlinikInfo
	db.First(&klinikInfo)
	// Prioritaskan rating dari cache Google Business (kalau sudah pernah
	// di-refresh) di atas angka manual — supaya hero halaman utama konsisten
	// dengan yang ditampilkan di halaman Tentang Kami (lihat
	// handlers/review_handler.go, sumber logikanya sama-sama RatingSummary).
	klinikInfo.RatingGoogle, klinikInfo.TotalUlasan = RatingSummary(db, klinikInfo.RatingGoogle, klinikInfo.TotalUlasan)
	data.KlinikInfo = &klinikInfo

	db.Where("is_active = ?", true).Find(&data.SiteSettings)

	db.Order("sort_order asc").Order("id asc").Find(&data.OperationalHours)

	return data, nil
}
