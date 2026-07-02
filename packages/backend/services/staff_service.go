package services

import (
	"backend/models"
	"fmt"

	"gorm.io/gorm"
)

// StaffList mengembalikan data staff. Jika onlyActive true, hanya staff aktif.
// Diurutkan berdasarkan kolom urutan (asc) lalu id (asc).
func StaffList(db *gorm.DB, onlyActive bool) ([]models.Staff, error) {
	var staff []models.Staff
	q := db.Order("urutan asc").Order("id asc")
	if onlyActive {
		q = q.Where("is_active = ?", true)
	}
	if err := q.Find(&staff).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data staff: %w", err)
	}
	return staff, nil
}

func CreateStaff(db *gorm.DB, staff *models.Staff) error {
	if err := db.Create(staff).Error; err != nil {
		return fmt.Errorf("gagal menambah staff: %w", err)
	}
	return nil
}

func UpdateStaff(db *gorm.DB, staff *models.Staff) error {
	// Save menimpa semua kolom termasuk is_active=false, jadi pakai Updates dengan map
	// agar nilai boolean false tetap tersimpan.
	if err := db.Model(&models.Staff{ID: staff.ID}).Updates(map[string]interface{}{
		"nama":      staff.Nama,
		"jabatan":   staff.Jabatan,
		"foto_url":  staff.FotoURL,
		"urutan":    staff.Urutan,
		"is_active": staff.IsActive,
	}).Error; err != nil {
		return fmt.Errorf("gagal mengubah staff: %w", err)
	}
	return nil
}

func DeleteStaff(db *gorm.DB, id uint64) error {
	if err := db.Delete(&models.Staff{}, id).Error; err != nil {
		return fmt.Errorf("gagal menghapus staff: %w", err)
	}
	return nil
}
