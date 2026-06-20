package models

import "time"

type DokterFoto struct {
	KdDokter      string    `gorm:"column:kd_dokter;primaryKey"        json:"kd_dokter"`
	FotoURL       string    `gorm:"column:foto_url"                    json:"foto_url"`
	TampilWebsite bool      `gorm:"column:tampil_website;default:0"    json:"tampil_website"`
	CreatedAt     time.Time `gorm:"column:created_at;autoCreateTime"   json:"created_at"`
	UpdatedAt     time.Time `gorm:"column:updated_at;autoUpdateTime"   json:"updated_at"`
}

func (DokterFoto) TableName() string { return "dokter_foto" }
