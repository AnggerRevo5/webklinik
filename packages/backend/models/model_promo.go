package models

import "time"

type Promo struct {
	ID             uint64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	URL            string     `gorm:"column:url"                         json:"url"`
	Tampil         bool       `gorm:"column:tampil;default:0"            json:"tampil"`
	TanggalMulai   *time.Time `gorm:"column:tanggal_mulai"               json:"tanggal_mulai"`
	TanggalSelesai *time.Time `gorm:"column:tanggal_selesai"             json:"tanggal_selesai"`
}

func (Promo) TableName() string { return "promo" }
