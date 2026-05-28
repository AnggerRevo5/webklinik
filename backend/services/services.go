package services

import (
	"backend/models"
	"fmt"

	"gorm.io/gorm"
)

func Pasien(db *gorm.DB) ([]models.Pasien, error) {
	var pasien []models.Pasien
	if err := db.Find(&pasien).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data pasien: %w", err)
	}
	return pasien, nil
}

func Admin(db *gorm.DB) ([]models.Admin, error) {
	var admin []models.Admin
	if err := db.Find(&admin).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data admin: %w", err)
	}
	return admin, nil
}

func Dokter(db *gorm.DB) ([]models.Dokter, error) {
	var dokter []models.Dokter
	if err := db.Find(&dokter).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data dokter: %w", err)
	}
	return dokter, nil
}

func Kamar(db *gorm.DB) ([]models.Kamar, error) {
	var kamar []models.Kamar
	if err := db.Find(&kamar).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data kamar: %w", err)
	}
	return kamar, nil
}

func Galeri(db *gorm.DB) ([]models.Galeri, error) {
	var galeri []models.Galeri
	if err := db.Find(&galeri).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data galeri: %w", err)
	}
	return galeri, nil
}

func Promo(db *gorm.DB) ([]models.Promo, error) {
	var promo []models.Promo
	if err := db.Find(&promo).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data promo: %w", err)
	}
	return promo, nil
}

func ArtikelKategori(db *gorm.DB) ([]models.ArtikelKategori, error) {
	var kategori []models.ArtikelKategori
	if err := db.Find(&kategori).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data kategori artikel: %w", err)
	}
	return kategori, nil
}

func Artikel(db *gorm.DB) ([]models.Artikel, error) {
	var artikel []models.Artikel
	if err := db.Find(&artikel).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data artikel: %w", err)
	}
	return artikel, nil
}

func Layanan(db *gorm.DB) ([]models.Layanan, error) {
	var layanan []models.Layanan
	if err := db.Find(&layanan).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data layanan: %w", err)
	}
	return layanan, nil
}

func JadwalDokter(db *gorm.DB) ([]models.JadwalDokter, error) {
	var jadwal []models.JadwalDokter
	if err := db.Find(&jadwal).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data jadwal dokter: %w", err)
	}
	return jadwal, nil
}

func PesanKontak(db *gorm.DB) ([]models.PesanKontak, error) {
	var pesan []models.PesanKontak
	if err := db.Find(&pesan).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data pesan kontak: %w", err)
	}
	return pesan, nil
}

func SiteConfig(db *gorm.DB) ([]models.SiteConfig, error) {
	var config []models.SiteConfig
	if err := db.Find(&config).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data site config: %w", err)
	}
	return config, nil
}

func SocialLink(db *gorm.DB) ([]models.SocialLink, error) {
	var links []models.SocialLink
	if err := db.Find(&links).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data social link: %w", err)
	}
	return links, nil
}

func JamOperasional(db *gorm.DB) ([]models.JamOperasional, error) {
	var jam []models.JamOperasional
	if err := db.Find(&jam).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data jam operasional: %w", err)
	}
	return jam, nil
}

func KlikWhatsapp(db *gorm.DB) ([]models.KlikWhatsapp, error) {
	var klik []models.KlikWhatsapp
	if err := db.Find(&klik).Error; err != nil {
		return nil, fmt.Errorf("gagal mengambil data klik whatsapp: %w", err)
	}
	return klik, nil
}

