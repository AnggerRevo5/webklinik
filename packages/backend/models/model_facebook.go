package models

import "time"

// FacebookCache — struktur identik InstagramCache (lihat model_instagram.go),
// diisi lewat endpoint RapidAPI "Instagram Statistics API" yang sama
// (mendukung beberapa jenis akun sosial, bukan cuma Instagram).
type FacebookCache struct {
	ID             uint      `gorm:"column:id;primaryKey"       json:"id"`
	Followers      int       `gorm:"column:followers"           json:"followers"`
	Following      int       `gorm:"column:following"           json:"following"`
	PostsCount     int       `gorm:"column:posts_count"         json:"posts_count"`
	EngagementRate float64   `gorm:"column:engagement_rate"     json:"engagement_rate"`
	AvgLikes       int       `gorm:"column:avg_likes"            json:"avg_likes"`
	AvgComments    int       `gorm:"column:avg_comments"         json:"avg_comments"`
	Username       string    `gorm:"column:username"            json:"username"`
	FullName       string    `gorm:"column:full_name"           json:"full_name"`
	UpdatedAt      time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

func (FacebookCache) TableName() string { return "facebook_cache" }

// FacebookAPIHitLog — tabel hit-log terpisah dari milik Instagram/TikTok
// (sengaja tidak digabung), demi tidak menyentuh implementasi yang sudah ada.
type FacebookAPIHitLog struct {
	ID        uint64    `gorm:"column:id;primaryKey" json:"id"`
	Endpoint  string    `gorm:"column:endpoint;size:100;index" json:"endpoint"`
	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime;index" json:"created_at"`
}

func (FacebookAPIHitLog) TableName() string { return "facebook_api_hit_log" }
