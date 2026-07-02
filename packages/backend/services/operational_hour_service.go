package services

import (
	"backend/models"
	"fmt"

	"gorm.io/gorm"
)

// OperationalHours mengembalikan seluruh jam operasional, terurut sort_order lalu id.
func OperationalHours(db *gorm.DB) ([]models.OperationalHour, error) {
	var hours []models.OperationalHour
	if err := db.Order("sort_order asc").Order("id asc").Find(&hours).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil jam operasional: %w", err)
	}
	return hours, nil
}

func CreateOperationalHour(db *gorm.DB, h *models.OperationalHour) error {
	if err := db.Create(h).Error; err != nil {
		return fmt.Errorf("gagal menambah jam operasional: %w", err)
	}
	return nil
}

func UpdateOperationalHour(db *gorm.DB, h *models.OperationalHour) error {
	// Pakai map agar nilai boolean false (is_24_hours) tetap tersimpan.
	if err := db.Model(&models.OperationalHour{ID: h.ID}).Updates(map[string]interface{}{
		"day_label":   h.DayLabel,
		"open_time":   h.OpenTime,
		"close_time":  h.CloseTime,
		"is_24_hours": h.Is24Hours,
		"note":        h.Note,
		"sort_order":  h.SortOrder,
	}).Error; err != nil {
		return fmt.Errorf("gagal mengubah jam operasional: %w", err)
	}
	return nil
}

func DeleteOperationalHour(db *gorm.DB, id uint64) error {
	if err := db.Delete(&models.OperationalHour{}, id).Error; err != nil {
		return fmt.Errorf("gagal menghapus jam operasional: %w", err)
	}
	return nil
}
