package services

import (
	"time"

	"backend/models"

	"gorm.io/gorm"
)

// ─── SocialMediaStats ─────────────────────────────────────────────────────────

func GetAllSocialMediaStats(db *gorm.DB) ([]models.SocialMediaStats, error) {
	var items []models.SocialMediaStats
	err := db.Order("recorded_at DESC").Find(&items).Error
	return items, err
}

func CreateSocialMediaStats(db *gorm.DB, m *models.SocialMediaStats) error {
	if m.RecordedAt.IsZero() {
		m.RecordedAt = time.Now()
	}
	return db.Create(m).Error
}

func UpdateSocialMediaStats(db *gorm.DB, id uint64, m *models.SocialMediaStats) error {
	m.ID = id
	return db.Save(m).Error
}

func DeleteSocialMediaStats(db *gorm.DB, id uint64) error {
	return db.Delete(&models.SocialMediaStats{}, id).Error
}

// ─── SocialMediaEngagement ────────────────────────────────────────────────────

func GetAllSocialMediaEngagement(db *gorm.DB) ([]models.SocialMediaEngagement, error) {
	var items []models.SocialMediaEngagement
	err := db.Order("recorded_at DESC").Find(&items).Error
	return items, err
}

func CreateSocialMediaEngagement(db *gorm.DB, m *models.SocialMediaEngagement) error {
	if m.RecordedAt.IsZero() {
		m.RecordedAt = time.Now()
	}
	return db.Create(m).Error
}

func UpdateSocialMediaEngagement(db *gorm.DB, id uint64, m *models.SocialMediaEngagement) error {
	m.ID = id
	return db.Save(m).Error
}

func DeleteSocialMediaEngagement(db *gorm.DB, id uint64) error {
	return db.Delete(&models.SocialMediaEngagement{}, id).Error
}

// ─── GBPInteraction ───────────────────────────────────────────────────────────

func GetAllGBPInteraction(db *gorm.DB) ([]models.GBPInteraction, error) {
	var items []models.GBPInteraction
	err := db.Order("recorded_at DESC").Find(&items).Error
	return items, err
}

func CreateGBPInteraction(db *gorm.DB, m *models.GBPInteraction) error {
	if m.RecordedAt.IsZero() {
		m.RecordedAt = time.Now()
	}
	return db.Create(m).Error
}

func UpdateGBPInteraction(db *gorm.DB, id uint64, m *models.GBPInteraction) error {
	m.ID = id
	return db.Save(m).Error
}

func DeleteGBPInteraction(db *gorm.DB, id uint64) error {
	return db.Delete(&models.GBPInteraction{}, id).Error
}
