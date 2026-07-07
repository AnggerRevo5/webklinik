package models

import "time"

type VisitorSession struct {
	ID             uint64     `gorm:"column:id" json:"id"`
	SessionID      string     `gorm:"column:session_id" json:"session_id"`
	VisitorID      string     `gorm:"column:visitor_id;index" json:"visitor_id,omitempty"`
	IPAddress      string     `gorm:"column:ip_address" json:"ip_address"`
	Device         string     `gorm:"column:device" json:"device"`
	Browser        string     `gorm:"column:browser" json:"browser"`
	PagesVisited   int        `gorm:"column:pages_visited" json:"pages_visited"`
	DurationSecond int        `gorm:"column:duration_second" json:"duration_second"`
	Source         string     `gorm:"column:source" json:"source"`

	// Lokasi hasil enrichment IP (kota/provinsi, BUKAN GPS presisi) — hanya
	// diisi bila ConsentAnalytics true. Situs publik tidak pernah meminta GPS
	// presisi pengunjung sama sekali.
	Kota     string `gorm:"column:kota;size:100" json:"kota,omitempty"`
	Provinsi string `gorm:"column:provinsi;size:100" json:"provinsi,omitempty"`
	Negara   string `gorm:"column:negara;size:10;default:ID" json:"negara,omitempty"`
	ISP      string `gorm:"column:isp;size:150" json:"isp,omitempty"`

	// Consent yang diberikan pengunjung (dicatat untuk kepatuhan UU PDP — bukti
	// persetujuan tersimpan bersama datanya, bukan hanya di localStorage klien).
	ConsentAnalytics bool       `gorm:"column:consent_analytics;default:false" json:"consent_analytics"`
	ConsentAt        *time.Time `gorm:"column:consent_at" json:"consent_at,omitempty"`

	StartedAt time.Time  `gorm:"column:started_at" json:"started_at"`
	EndedAt   *time.Time `gorm:"column:ended_at" json:"ended_at,omitempty"`
}

func (VisitorSession) TableName() string { return "visitor_sessions" }

// PageView mencatat setiap halaman yang dikunjungi dalam satu sesi (terpisah
// dari counter PagesVisited di VisitorSession supaya bisa dianalisis per-halaman).
type PageView struct {
	ID          uint64    `gorm:"column:id;primaryKey" json:"id"`
	SessionID   string    `gorm:"column:session_id;index;size:64" json:"session_id"`
	VisitorID   string    `gorm:"column:visitor_id;index;size:64" json:"visitor_id,omitempty"`
	Halaman     string    `gorm:"column:halaman;size:255;index" json:"halaman"`
	DurasiDetik int       `gorm:"column:durasi_detik;default:0" json:"durasi_detik"`
	ViewedAt    time.Time `gorm:"column:viewed_at;index" json:"viewed_at"`
}

func (PageView) TableName() string { return "page_views" }

type SocialIconClick struct {
	ID        uint64    `gorm:"column:id;primaryKey" json:"id"`
	Platform  string    `gorm:"column:platform"      json:"platform"`
	SessionID string    `gorm:"column:session_id"    json:"session_id,omitempty"`
	IPAddress string    `gorm:"column:ip_address"    json:"ip_address"`
	ClickedAt time.Time `gorm:"column:clicked_at"    json:"clicked_at"`
}

func (SocialIconClick) TableName() string { return "social_icon_clicks" }
