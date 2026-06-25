package services

import (
	"backend/models"
	"log"

	"gorm.io/gorm"
)

// HomePublikData hanya berisi data yang ditampilkan di halaman publik website.
// Jauh lebih ringan dari HomeData lama yang mengambil semua tabel analytics.
type HomePublikData struct {
	Banner     []models.Banner    `json:"banner"`
	Layanan    []models.Layanan   `json:"layanan"`
	Promo      []models.Promo     `json:"promo"`
	KlinikInfo *models.KlinikInfo `json:"klinik_info,omitempty"`
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

	var klinikInfo models.KlinikInfo
	if err := db.First(&klinikInfo).Error; err == nil {
		data.KlinikInfo = &klinikInfo
	}

	return data, nil
}
