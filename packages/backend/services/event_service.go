package services

import (
	"backend/models"
	"fmt"

	"gorm.io/gorm"
)

func Event(db *gorm.DB) ([]models.Event, error) {
	var event []models.Event
	if err := db.Find(&event).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data event: %w", err)
	}
	return event, nil
}
