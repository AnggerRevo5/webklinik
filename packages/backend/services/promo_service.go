package services

import (
	"backend/models"
	"fmt"
	"time"

	"gorm.io/gorm"
)

func Promo(db *gorm.DB) ([]models.Promo, error) {
	var promo []models.Promo
	if err := db.Order("id DESC").Find(&promo).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data promo: %w", err)
	}
	return promo, nil
}

// PromoPublik hanya mengembalikan promo yang aktif (tampil=1) dan dalam rentang tanggal.
func PromoPublik(db *gorm.DB) ([]models.Promo, error) {
	var promos []models.Promo
	now := time.Now()
	err := db.Where("tampil = ?", true).
		Where("tanggal_mulai IS NULL OR tanggal_mulai <= ?", now).
		Where("tanggal_selesai IS NULL OR tanggal_selesai >= ?", now).
		Order("id DESC").
		Find(&promos).Error
	if err != nil {
		return nil, fmt.Errorf("gagal mengambil promo publik: %w", err)
	}
	return promos, nil
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
