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
