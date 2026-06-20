package services

import (
	"backend/models"
	"log"

	"gorm.io/gorm"
)

type HomeData struct {
	Banner                []models.Banner                `json:"banner"`
	Layanan               []models.Layanan               `json:"layanan"`
	Dokter                []models.Dokter                `json:"dokter"`
	Promo                 []models.Promo                 `json:"promo"`
	Galeri                []models.Galeri                `json:"galeri"`
	Event                 []models.Event                 `json:"event"`
	VisitorSessions       []models.VisitorSession        `json:"visitor_sessions"`
	SocialMediaEngagement []models.SocialMediaEngagement `json:"social_media_engagement"`
	SocialMediaStats      []models.SocialMediaStats      `json:"social_media_stats"`
	GBPInteractions       []models.GBPInteraction        `json:"gbp_interactions"`
	GoogleReviews         []models.GoogleReview          `json:"google_reviews"`
	KlinikInfo            *models.KlinikInfo             `json:"klinik_info,omitempty"`
}

func Home(db *gorm.DB) (HomeData, error) {
	var data HomeData

	// Tabel-tabel inti — hanya kembalikan error kalau tabel benar-benar krusial dan pasti ada.
	// Tabel yang mungkin tidak ada di beberapa environment (XAMPP vs Docker) dilewati dengan log.
	tryFind := func(dest interface{}, label string) {
		if err := db.Find(dest).Error; err != nil {
			log.Printf("WARNING home/%s: %v", label, err)
		}
	}

	tryFind(&data.Banner, "banner")
	tryFind(&data.Layanan, "layanan")
	tryFind(&data.Dokter, "dokter")
	tryFind(&data.Galeri, "galeri")
	tryFind(&data.Event, "event")
	tryFind(&data.VisitorSessions, "visitor_sessions")
	tryFind(&data.SocialMediaEngagement, "social_media_engagement")
	tryFind(&data.SocialMediaStats, "social_media_stats")
	tryFind(&data.GBPInteractions, "gbp_interactions")
	tryFind(&data.GoogleReviews, "google_reviews")

	if promoPublik, promoErr := PromoPublik(db); promoErr != nil {
		log.Printf("WARNING home/promo: %v", promoErr)
		data.Promo = []models.Promo{}
	} else {
		data.Promo = promoPublik
	}

	var klinikInfo models.KlinikInfo
	if err := db.First(&klinikInfo).Error; err == nil {
		data.KlinikInfo = &klinikInfo
	}

	return data, nil
}
