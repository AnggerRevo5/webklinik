package models

import "time"

type Banner struct {
	ID  uint64 `gorm:"column:id" json:"id"`
	URL string `gorm:"column:url" json:"url"`
}

func (Banner) TableName() string { return "banner" }

type Layanan struct {
	ID          uint64 `gorm:"column:id" json:"id"`
	URL         string `gorm:"column:url" json:"url"`
	NamaLayanan string `gorm:"column:nama_layanan" json:"nama_layanan"`
}

func (Layanan) TableName() string { return "layanan" }

type Dokter struct {
	ID            uint64 `gorm:"column:id" json:"id"`
	URL           string `gorm:"column:url" json:"url"`
	NamaDokter    string `gorm:"column:nama_dokter" json:"nama_dokter"`
	JadwalPraktek string `gorm:"column:jadwal_praktek" json:"jadwal_praktek"`
	Kategori      string `gorm:"column:kategori" json:"kategori"`
}

func (Dokter) TableName() string { return "dokter" }

type Promo struct {
	ID  uint64 `gorm:"column:id" json:"id"`
	URL string `gorm:"column:url" json:"url"`
}

func (Promo) TableName() string { return "promo" }

type Galeri struct {
	ID       uint64 `gorm:"column:id" json:"id"`
	Kategori string `gorm:"column:kategori" json:"kategori"`
	Text     string `gorm:"column:text" json:"text"`
	URL      string `gorm:"column:url" json:"url"`
}

func (Galeri) TableName() string { return "galeri" }

type Event struct {
	ID         uint64    `gorm:"column:id" json:"id"`
	SessionID  string    `gorm:"column:session_id" json:"session_id"`
	EventType  string    `gorm:"column:event_type" json:"event_type"`
	EventValue string    `gorm:"column:event_value" json:"event_value"`
	IPAddress  string    `gorm:"column:ip_address" json:"ip_address"`
	UserAgent  string    `gorm:"column:user_agent" json:"user_agent"`
	CreatedAt  time.Time `gorm:"column:created_at" json:"created_at"`
}

func (Event) TableName() string { return "event" }

type VisitorSession struct {
	ID             uint64     `gorm:"column:id" json:"id"`
	SessionID      string     `gorm:"column:session_id" json:"session_id"`
	IPAddress      string     `gorm:"column:ip_address" json:"ip_address"`
	Device         string     `gorm:"column:device" json:"device"`
	Browser        string     `gorm:"column:browser" json:"browser"`
	PagesVisited   int        `gorm:"column:pages_visited" json:"pages_visited"`
	DurationSecond int        `gorm:"column:duration_second" json:"duration_second"`
	Source         string     `gorm:"column:source" json:"source"`
	StartedAt      time.Time  `gorm:"column:started_at" json:"started_at"`
	EndedAt        *time.Time `gorm:"column:ended_at" json:"ended_at,omitempty"`
}

func (VisitorSession) TableName() string { return "visitor_sessions" }
