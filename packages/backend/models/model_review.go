package models

import "time"

type Review struct {
	ID        uint      `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Nama      string    `gorm:"column:nama"                       json:"nama"`
	Rating    int       `gorm:"column:rating"                     json:"rating"`
	Komentar  string    `gorm:"column:komentar"                   json:"komentar"`
	Tanggal   string    `gorm:"column:tanggal"                    json:"tanggal"`
	Tag       string    `gorm:"column:tag"                        json:"tag"`
	Featured  bool      `gorm:"column:featured;default:0"         json:"featured"`
	Tampil    bool      `gorm:"column:tampil;default:1"           json:"tampil"`
	Urutan    int       `gorm:"column:urutan;default:0"           json:"urutan"`
	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime"  json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at;autoUpdateTime"  json:"updated_at"`
}

func (Review) TableName() string { return "review" }

type KlinikInfo struct {
	ID           uint    `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	RatingGoogle float64 `gorm:"column:rating_google"               json:"rating_google"`
	TotalUlasan  int     `gorm:"column:total_ulasan"                json:"total_ulasan"`
	LinkGmaps    string  `gorm:"column:link_gmaps"                  json:"link_gmaps"`
}

func (KlinikInfo) TableName() string { return "klinik_info" }
