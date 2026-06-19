package services

import (
	"backend/models"
	"fmt"

	"gorm.io/gorm"
)

type HomeData struct {
	Banner                []models.Banner               `json:"banner"`
	Layanan               []models.Layanan              `json:"layanan"`
	Dokter                []models.Dokter               `json:"dokter"`
	Promo                 []models.Promo                `json:"promo"`
	Galeri                []models.Galeri               `json:"galeri"`
	Event                 []models.Event                `json:"event"`
	VisitorSessions       []models.VisitorSession       `json:"visitor_sessions"`
	SocialMediaEngagement []models.SocialMediaEngagement `json:"social_media_engagement"`
	SocialMediaStats      []models.SocialMediaStats     `json:"social_media_stats"`
	GBPInteractions       []models.GBPInteraction       `json:"gbp_interactions"`
	GoogleReviews         []models.GoogleReview         `json:"google_reviews"`
	KlinikInfo            *models.KlinikInfo            `json:"klinik_info,omitempty"`
}

func Banner(db *gorm.DB) ([]models.Banner, error) {
	var banner []models.Banner
	if err := db.Find(&banner).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data banner: %w", err)
	}
	return banner, nil
}

func CreateBanner(db *gorm.DB, banner *models.Banner) error {
	if err := db.Create(banner).Error; err != nil {
		return fmt.Errorf("gagal menambah banner: %w", err)
	}
	return nil
}

func UpdateBanner(db *gorm.DB, banner *models.Banner) error {
	if err := db.Save(banner).Error; err != nil {
		return fmt.Errorf("gagal mengubah banner: %w", err)
	}
	return nil
}

func DeleteBanner(db *gorm.DB, id uint64) error {
	if err := db.Delete(&models.Banner{}, id).Error; err != nil {
		return fmt.Errorf("gagal menghapus banner: %w", err)
	}
	return nil
}

func Layanan(db *gorm.DB) ([]models.Layanan, error) {
	var layanan []models.Layanan
	if err := db.Find(&layanan).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data layanan: %w", err)
	}
	return layanan, nil
}

func CreateLayanan(db *gorm.DB, layanan *models.Layanan) error {
	if err := db.Create(layanan).Error; err != nil {
		return fmt.Errorf("gagal menambah layanan: %w", err)
	}
	return nil
}

func UpdateLayanan(db *gorm.DB, layanan *models.Layanan) error {
	if err := db.Save(layanan).Error; err != nil {
		return fmt.Errorf("gagal mengubah layanan: %w", err)
	}
	return nil
}

func DeleteLayanan(db *gorm.DB, id uint64) error {
	if err := db.Delete(&models.Layanan{}, id).Error; err != nil {
		return fmt.Errorf("gagal menghapus layanan: %w", err)
	}
	return nil
}

func Dokter(db *gorm.DB) ([]models.Dokter, error) {
	var dokter []models.Dokter
	if err := db.Find(&dokter).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data dokter: %w", err)
	}
	return dokter, nil
}

func CreateDokter(db *gorm.DB, dokter *models.Dokter) error {
	if err := db.Create(dokter).Error; err != nil {
		return fmt.Errorf("gagal menambah dokter: %w", err)
	}
	return nil
}

func UpdateDokter(db *gorm.DB, dokter *models.Dokter) error {
	if err := db.Save(dokter).Error; err != nil {
		return fmt.Errorf("gagal mengubah dokter: %w", err)
	}
	return nil
}

func DeleteDokter(db *gorm.DB, id uint64) error {
	if err := db.Delete(&models.Dokter{}, id).Error; err != nil {
		return fmt.Errorf("gagal menghapus dokter: %w", err)
	}
	return nil
}

func Promo(db *gorm.DB) ([]models.Promo, error) {
	var promo []models.Promo
	if err := db.Find(&promo).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data promo: %w", err)
	}
	return promo, nil
}

func CreatePromo(db *gorm.DB, promo *models.Promo) error {
	if err := db.Create(promo).Error; err != nil {
		return fmt.Errorf("gagal menambah promo: %w", err)
	}
	return nil
}

func UpdatePromo(db *gorm.DB, promo *models.Promo) error {
	if err := db.Save(promo).Error; err != nil {
		return fmt.Errorf("gagal mengubah promo: %w", err)
	}
	return nil
}

func DeletePromo(db *gorm.DB, id uint64) error {
	if err := db.Delete(&models.Promo{}, id).Error; err != nil {
		return fmt.Errorf("gagal menghapus promo: %w", err)
	}
	return nil
}

func Galeri(db *gorm.DB) ([]models.Galeri, error) {
	var galeri []models.Galeri
	if err := db.Find(&galeri).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data galeri: %w", err)
	}
	return galeri, nil
}

func CreateGaleri(db *gorm.DB, galeri *models.Galeri) error {
	if err := db.Create(galeri).Error; err != nil {
		return fmt.Errorf("gagal menambah galeri: %w", err)
	}
	return nil
}

func UpdateGaleri(db *gorm.DB, galeri *models.Galeri) error {
	if err := db.Save(galeri).Error; err != nil {
		return fmt.Errorf("gagal mengubah galeri: %w", err)
	}
	return nil
}

func DeleteGaleri(db *gorm.DB, id uint64) error {
	if err := db.Delete(&models.Galeri{}, id).Error; err != nil {
		return fmt.Errorf("gagal menghapus galeri: %w", err)
	}
	return nil
}

func Event(db *gorm.DB) ([]models.Event, error) {
	var event []models.Event
	if err := db.Find(&event).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data event: %w", err)
	}
	return event, nil
}

func VisitorSession(db *gorm.DB) ([]models.VisitorSession, error) {
	var sessions []models.VisitorSession
	if err := db.Find(&sessions).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data visitor session: %w", err)
	}
	return sessions, nil
}

func SocialMediaEngangement(db *gorm.DB) ([]models.SocialMediaEngagement, error) {
	var engagements []models.SocialMediaEngagement
	if err := db.Find(&engagements).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data social media engagement: %w", err)
	}
	return engagements, nil
}

func SocialMediaStats(db *gorm.DB) ([]models.SocialMediaStats, error) {
	var stats []models.SocialMediaStats
	if err := db.Find(&stats).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data social media stats: %w", err)
	}
	return stats, nil
}

func GBPInteraction(db *gorm.DB) ([]models.GBPInteraction, error) {
	var interactions []models.GBPInteraction
	if err := db.Find(&interactions).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data GBP interaction: %w", err)
	}
	return interactions, nil
}

func GoogleReview(db *gorm.DB) ([]models.GoogleReview, error) {
	var reviews []models.GoogleReview
	if err := db.Find(&reviews).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data Google review: %w", err)
	}
	return reviews, nil
}

func Home(db *gorm.DB) (HomeData, error) {
	var data HomeData

	if err := db.Find(&data.Banner).Error; err != nil {
		return data, fmt.Errorf("gagal mengambil data banner: %w", err)
	}
	if err := db.Find(&data.Layanan).Error; err != nil {
		return data, fmt.Errorf("gagal mengambil data layanan: %w", err)
	}
	if err := db.Find(&data.Dokter).Error; err != nil {
		return data, fmt.Errorf("gagal mengambil data dokter: %w", err)
	}
	if err := db.Find(&data.Promo).Error; err != nil {
		return data, fmt.Errorf("gagal mengambil data promo: %w", err)
	}
	if err := db.Find(&data.Galeri).Error; err != nil {
		return data, fmt.Errorf("gagal mengambil data galeri: %w", err)
	}
	if err := db.Find(&data.Event).Error; err != nil {
		return data, fmt.Errorf("gagal mengambil data event: %w", err)
	}
	if err := db.Find(&data.VisitorSessions).Error; err != nil {
		return data, fmt.Errorf("gagal mengambil data visitor session: %w", err)
	}
	if err := db.Find(&data.SocialMediaEngagement).Error; err != nil {
		return data, fmt.Errorf("gagal mengambil data social media engagement: %w", err)
	}
	if err := db.Find(&data.SocialMediaStats).Error; err != nil {
		return data, fmt.Errorf("gagal mengambil data social media stats: %w", err)
	}
	if err := db.Find(&data.GBPInteractions).Error; err != nil {
		return data, fmt.Errorf("gagal mengambil data GBP interaction: %w", err)
	}
	if err := db.Find(&data.GoogleReviews).Error; err != nil {
		return data, fmt.Errorf("gagal mengambil data Google review: %w", err)
	}

	var klinikInfo models.KlinikInfo
	if err := db.First(&klinikInfo).Error; err == nil {
		data.KlinikInfo = &klinikInfo
	}

	return data, nil
}

func GetJadwalDokter(db *gorm.DB) ([]models.JadwalDokter, error) {
	var jadwal []models.JadwalDokter
	if err := db.Find(&jadwal).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data jadwal dokter: %w", err)
	}
	return jadwal, nil
}

func CreateJadwalDokter(db *gorm.DB, jadwal *models.JadwalDokter) error {
	if err := db.Create(jadwal).Error; err != nil {
		return fmt.Errorf("gagal menambah jadwal dokter: %w", err)
	}
	return nil
}

func UpdateJadwalDokter(db *gorm.DB, jadwal *models.JadwalDokter) error {
	if err := db.Save(jadwal).Error; err != nil {
		return fmt.Errorf("gagal mengubah jadwal dokter: %w", err)
	}
	return nil
}

func DeleteJadwalDokter(db *gorm.DB, kodeDokter string) error {
	if err := db.Delete(&models.JadwalDokter{}, "kd_dokter = ?", kodeDokter).Error; err != nil {
		return fmt.Errorf("gagal menghapus jadwal dokter: %w", err)
	}
	return nil
}