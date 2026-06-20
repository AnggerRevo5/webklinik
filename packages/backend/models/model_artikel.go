package models

import "time"

type Artikel struct {
	ID          uint       `gorm:"column:id;primaryKey;autoIncrement"     json:"id"`
	Judul       string     `gorm:"column:judul;not null"                  json:"judul"`
	Slug        string     `gorm:"column:slug;not null;unique"            json:"slug"`
	Ringkasan   string     `gorm:"column:ringkasan"                       json:"ringkasan"`
	Konten      string     `gorm:"column:konten"                          json:"konten"`
	Kategori    string     `gorm:"column:kategori;default:Tips Kesehatan" json:"kategori"`
	FotoURL     string     `gorm:"column:foto_url"                        json:"foto_url"`
	Penulis     string     `gorm:"column:penulis;default:Tim Medis"       json:"penulis"`
	Status      string     `gorm:"column:status;default:draft"            json:"status"`
	PublishedAt *time.Time `gorm:"column:published_at"                    json:"published_at"`
	Urutan      int        `gorm:"column:urutan;default:0"                json:"urutan"`
	CreatedAt   time.Time  `gorm:"column:created_at;autoCreateTime"       json:"created_at"`
	UpdatedAt   time.Time  `gorm:"column:updated_at;autoUpdateTime"       json:"updated_at"`
}

func (Artikel) TableName() string { return "artikel" }
