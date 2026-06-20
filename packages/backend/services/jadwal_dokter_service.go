package services

import (
	"backend/models"
	"fmt"

	"gorm.io/gorm"
)

func GetJadwalDokter(db *gorm.DB, kdDokter string) ([]models.KhanzaJadwal, error) {
	var jadwal []models.KhanzaJadwal
	query := db.Order("hari_kerja, jam_mulai")
	if kdDokter != "" {
		query = query.Where("kd_dokter = ?", kdDokter)
	}
	if err := query.Find(&jadwal).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil jadwal dokter: %w", err)
	}
	return jadwal, nil
}

func CreateJadwalDokter(db *gorm.DB, jadwal *models.KhanzaJadwal) error {
	if err := db.Create(jadwal).Error; err != nil {
		return fmt.Errorf("gagal menambah jadwal dokter: %w", err)
	}
	return nil
}

func UpdateJadwalDokter(db *gorm.DB, jadwal *models.KhanzaJadwal, oldHariKerja, oldJamMulai string) error {
	if err := db.Where("kd_dokter = ? AND hari_kerja = ? AND jam_mulai = ?", jadwal.KdDokter, oldHariKerja, oldJamMulai).Delete(&models.KhanzaJadwal{}).Error; err != nil {
		return fmt.Errorf("gagal menghapus jadwal lama: %w", err)
	}
	if err := db.Create(jadwal).Error; err != nil {
		return fmt.Errorf("gagal membuat jadwal baru: %w", err)
	}
	return nil
}

func DeleteJadwalDokter(db *gorm.DB, kdDokter, hariKerja, jamMulai string) error {
	if err := db.Where("kd_dokter = ? AND hari_kerja = ? AND jam_mulai = ?", kdDokter, hariKerja, jamMulai).Delete(&models.KhanzaJadwal{}).Error; err != nil {
		return fmt.Errorf("gagal menghapus jadwal dokter: %w", err)
	}
	return nil
}
