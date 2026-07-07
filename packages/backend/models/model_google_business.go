package models

import "time"

// GoogleBusinessCache menyimpan snapshot rating & profil bisnis dari Google
// Business (via RapidAPI Local Business Data). Diperlakukan sebagai baris
// tunggal (singleton) — di-refresh berkala oleh services.FetchAndCache.
// Rating5..Rating1 adalah distribusi bintang dari SEMUA ulasan (field
// reviews_per_rating di response /business-details), bukan cuma yang di-cache
// di google_reviews_cache (yang dibatasi limit=20).
type GoogleBusinessCache struct {
	ID          uint      `gorm:"column:id;primaryKey"        json:"id"`
	Rating      float64   `gorm:"column:rating"               json:"rating"`
	ReviewCount int       `gorm:"column:review_count"         json:"review_count"`
	Name        string    `gorm:"column:name"                 json:"name"`
	Address     string    `gorm:"column:address"              json:"address"`
	Phone       string    `gorm:"column:phone"                json:"phone"`
	Rating5     int       `gorm:"column:rating_5"             json:"rating_5"`
	Rating4     int       `gorm:"column:rating_4"             json:"rating_4"`
	Rating3     int       `gorm:"column:rating_3"             json:"rating_3"`
	Rating2     int       `gorm:"column:rating_2"             json:"rating_2"`
	Rating1     int       `gorm:"column:rating_1"             json:"rating_1"`
	UpdatedAt   time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (GoogleBusinessCache) TableName() string { return "google_business_cache" }

// GoogleReviewCache menyimpan daftar ulasan Google. GoogleReviewID (dari field
// review_id RapidAPI) adalah kunci upsert di services.FetchAndCache — supaya
// refresh berkala tidak menghapus/mereset Tampil yang sudah diatur admin.
type GoogleReviewCache struct {
	ID           uint      `gorm:"column:id;primaryKey"        json:"id"`
	GoogleReviewID string  `gorm:"column:google_review_id;uniqueIndex" json:"google_review_id"`
	ReviewerName string    `gorm:"column:reviewer_name"        json:"reviewer_name"`
	Rating       int       `gorm:"column:rating"               json:"rating"`
	ReviewText   string    `gorm:"column:review_text"          json:"review_text"`
	ReviewDate   string    `gorm:"column:review_date"          json:"review_date"`
	OwnerReply   string    `gorm:"column:owner_reply"          json:"owner_reply"`
	PublishedAt  string    `gorm:"column:published_at"         json:"published_at"`
	Tampil       bool      `gorm:"column:tampil;default:1"     json:"tampil"`
	UpdatedAt    time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (GoogleReviewCache) TableName() string { return "google_reviews_cache" }

// GoogleAPIHitLog mencatat setiap panggilan nyata ke RapidAPI (Local Business
// Data) — satu baris per request HTTP, terlepas dari sukses/gagal. Dipakai
// admin untuk memantau pemakaian kuota bulanan RapidAPI.
type GoogleAPIHitLog struct {
	ID        uint64    `gorm:"column:id;primaryKey" json:"id"`
	Endpoint  string    `gorm:"column:endpoint;size:100;index" json:"endpoint"`
	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime;index" json:"created_at"`
}

func (GoogleAPIHitLog) TableName() string { return "google_api_hit_log" }
