package models

import "time"

// InstagramCache menyimpan snapshot statistik akun Instagram publik klinik
// (via RapidAPI Instagram Statistics API). Diperlakukan sebagai baris tunggal
// (singleton), sama seperti GoogleBusinessCache — di-refresh berkala oleh
// services.FetchAndCache (paket instagram).
type InstagramCache struct {
	ID             uint      `gorm:"column:id;primaryKey"       json:"id"`
	Followers      int       `gorm:"column:followers"           json:"followers"`
	Following      int       `gorm:"column:following"           json:"following"`
	PostsCount     int       `gorm:"column:posts_count"         json:"posts_count"`
	EngagementRate float64   `gorm:"column:engagement_rate"     json:"engagement_rate"`
	AvgLikes       int       `gorm:"column:avg_likes"           json:"avg_likes"`
	AvgComments    int       `gorm:"column:avg_comments"        json:"avg_comments"`
	Username       string    `gorm:"column:username"            json:"username"`
	FullName       string    `gorm:"column:full_name"           json:"full_name"`
	UpdatedAt      time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (InstagramCache) TableName() string { return "instagram_cache" }

// InstagramAPIHitLog mencatat setiap panggilan nyata ke RapidAPI Instagram
// Statistics API — satu baris per request, terlepas dari sukses/gagal. Tabel
// terpisah dari GoogleAPIHitLog (bukan digabung) supaya tidak menyentuh fitur
// Google Business yang sudah berjalan di production.
type InstagramAPIHitLog struct {
	ID        uint64    `gorm:"column:id;primaryKey" json:"id"`
	Endpoint  string    `gorm:"column:endpoint;size:100;index" json:"endpoint"`
	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime;index" json:"created_at"`
}

func (InstagramAPIHitLog) TableName() string { return "instagram_api_hit_log" }
