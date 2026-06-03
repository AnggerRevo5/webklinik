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

type SocialMediaEngagement struct {
	ID            uint64    `gorm:"column:id" json:"id"`
	Platform      string    `gorm:"column:platform" json:"platform"`
	LikesCount    uint64    `gorm:"column:likes_count" json:"likes_count"`
	CommentsCount uint64    `gorm:"column:comments_count" json:"comments_count"`
	SharesCount   uint64    `gorm:"column:shares_count" json:"shares_count"`
	SavesCount    uint64    `gorm:"column:saves_count" json:"saves_count"`
	RecordedAt    time.Time `gorm:"column:recorded_at" json:"recorded_at"`
}

func (SocialMediaEngagement) TableName() string { return "social_media_engagement" }

type SocialMediaStats struct {
	ID             uint64    `gorm:"column:id" json:"id"`
	Platform       string    `gorm:"column:platform" json:"platform"`
	FollowerCount  uint64    `gorm:"column:follower_count" json:"follower_count"`
	EngagementRate float64   `gorm:"column:engagement_rate" json:"engagement_rate"`
	RecordedAt     time.Time `gorm:"column:recorded_at" json:"recorded_at"`
}

func (SocialMediaStats) TableName() string { return "social_media_stats" }

type GBPInteraction struct {
	ID              uint64    `gorm:"column:id" json:"id"`
	InteractionType string    `gorm:"column:interaction_type" json:"interaction_type"`
	Count           uint64    `gorm:"column:count" json:"count"`
	RecordedAt      time.Time `gorm:"column:recorded_at" json:"recorded_at"`
}

func (GBPInteraction) TableName() string { return "gbp_interactions" }

type GoogleReview struct {
	ID            uint64    `gorm:"column:id" json:"id"`
	ReviewCount   uint64    `gorm:"column:review_count" json:"review_count"`
	AverageRating float64   `gorm:"column:average_rating" json:"average_rating"`
	RecordedAt    time.Time `gorm:"column:recorded_at" json:"recorded_at"`
}

func (GoogleReview) TableName() string { return "google_reviews" }
<<<<<<< HEAD
=======

type Pasien struct {
	ID 	 uint64 `gorm:"column:id" json:"id"`
	Nama string `gorm:"column:nama" json:"nama"`
	NamaOrtu string `gorm:"column:nama_ortu" json:"nama_ortu"`
	PenanggungJawab string `gorm:"column:penanggung_jawab" json:"penanggung_jawab"`
	NoTelp string `gorm:"column:no_telp" json:"no_telp"`
	Alamat string `gorm:"column:alamat" json:"alamat"`
	TanggalLahir time.Time `gorm:"column:tanggal_lahir" json:"tanggal_lahir"`
	NIK string `gorm:"column:nik" json:"nik"`
	JenisKelamin string `gorm:"column:jenis_kelamin" json:"jenis_kelamin"`
	JenisPasien string `gorm:"column:jenis_pasien" json:"jenis_pasien"`
	TanggalKunjungan time.Time `gorm:"column:tanggal_kunjungan" json:"tanggal_kunjungan"`
	WaktuKunjungan time.Time `gorm:"column:waktu_kunjungan" json:"waktu_kunjungan"`
	Keluhan string `gorm:"column:keluhan" json:"keluhan"`
	Layanan string `gorm:"column:layanan" json:"layanan"`
	Dokter string `gorm:"column:dokter" json:"dokter"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
}

func (Pasien) TableName() string { return "pasien" }
>>>>>>> b39cabe8c5d7841050a8538e68291a3be470270a
