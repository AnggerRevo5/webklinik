package services

import (
	"backend/models"
	"fmt"

	"gorm.io/gorm"
)

func Banner(db *gorm.DB) ([]models.Banner, error) {
	var banner []models.Banner
	if err := db.Find(&banner).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data banner: %w", err)
	}
	return banner, nil
}

func Layanan(db *gorm.DB) ([]models.Layanan, error) {
	var layanan []models.Layanan
	if err := db.Find(&layanan).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data layanan: %w", err)
	}
	return layanan, nil
}

func Dokter(db *gorm.DB) ([]models.Dokter, error) {
	var dokter []models.Dokter
	if err := db.Find(&dokter).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data dokter: %w", err)
	}
	return dokter, nil
}

func Promo(db *gorm.DB) ([]models.Promo, error) {
	var promo []models.Promo
	if err := db.Find(&promo).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data promo: %w", err)
	}
	return promo, nil
}

func Galeri(db *gorm.DB) ([]models.Galeri, error) {
	var galeri []models.Galeri
	if err := db.Find(&galeri).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data galeri: %w", err)
	}
	return galeri, nil
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
