package services

import (
	"backend/models"
	"fmt"

	"gorm.io/gorm"
)

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
