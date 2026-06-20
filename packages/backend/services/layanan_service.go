package services

import (
	"backend/models"
	"fmt"

	"gorm.io/gorm"
)

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
