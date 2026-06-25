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

// GaleriFiltered mengembalikan semua galeri, atau hanya kategori tertentu kalau kategori tidak kosong.
func GaleriFiltered(db *gorm.DB, kategori string) ([]models.Galeri, error) {
	var galeri []models.Galeri
	q := db
	if kategori != "" {
		q = q.Where("kategori = ?", kategori)
	}
	if err := q.Find(&galeri).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data galeri: %w", err)
	}
	return galeri, nil
}

// GaleriPreviewResult adalah response untuk endpoint preview (maks 2 foto per kategori).
type GaleriPreviewResult struct {
	Kegiatan  []models.Galeri `json:"kegiatan"`
	Layanan   []models.Galeri `json:"layanan"`
	Fasilitas []models.Galeri `json:"fasilitas"`
	Poli      []models.Galeri `json:"poli"`
}

// GaleriPreview mengambil maks 2 foto per kategori untuk ditampilkan di halaman Tentang Kami.
func GaleriPreview(db *gorm.DB) (GaleriPreviewResult, error) {
	var result GaleriPreviewResult

	for _, pair := range []struct {
		kat  string
		dest *[]models.Galeri
	}{
		{"Kegiatan", &result.Kegiatan},
		{"Layanan", &result.Layanan},
		{"Fasilitas", &result.Fasilitas},
		{"Poli", &result.Poli},
	} {
		if err := db.Where("kategori = ?", pair.kat).Limit(2).Find(pair.dest).Error; err != nil {
			return result, fmt.Errorf("gagal mengambil preview %s: %w", pair.kat, err)
		}
		if *pair.dest == nil {
			*pair.dest = []models.Galeri{}
		}
	}

	return result, nil
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
