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
	ID             uint64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	URL            string     `gorm:"column:url"                         json:"url"`
	Tampil         bool       `gorm:"column:tampil;default:0"            json:"tampil"`
	TanggalMulai   *time.Time `gorm:"column:tanggal_mulai"               json:"tanggal_mulai"`
	TanggalSelesai *time.Time `gorm:"column:tanggal_selesai"             json:"tanggal_selesai"`
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

type DokterFoto struct {
	KdDokter      string    `gorm:"column:kd_dokter;primaryKey"        json:"kd_dokter"`
	FotoURL       string    `gorm:"column:foto_url"                    json:"foto_url"`
	TampilWebsite bool      `gorm:"column:tampil_website;default:0"    json:"tampil_website"`
	CreatedAt     time.Time `gorm:"column:created_at;autoCreateTime"   json:"created_at"`
	UpdatedAt     time.Time `gorm:"column:updated_at;autoUpdateTime"   json:"updated_at"`
}


func (DokterFoto) TableName() string { return "dokter_foto" }

type MediaLibrary struct {
	ID         uint      `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	URL        string    `gorm:"column:url;not null"               json:"url"`
	PublicID   string    `gorm:"column:public_id;not null;unique"  json:"public_id"`
	NamaFile   string    `gorm:"column:nama_file"                  json:"nama_file"`
	Folder     string    `gorm:"column:folder"                     json:"folder"`
	Format     string    `gorm:"column:format"                     json:"format"`
	Ukuran     int       `gorm:"column:ukuran"                     json:"ukuran"`
	Lebar      int       `gorm:"column:lebar"                      json:"lebar"`
	Tinggi     int       `gorm:"column:tinggi"                     json:"tinggi"`
	UploadedAt time.Time `gorm:"column:uploaded_at;autoCreateTime" json:"uploaded_at"`
}

func (MediaLibrary) TableName() string { return "media_library" }

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
