package models

import "time"

type Pasien struct {
	NamaPasien   string `json:"nm_pasien"`
	NoKTP        string `json:"no_ktp"`
	JenisKelamin string `json:"jk"`
	TempatLahir  string `json:"tmp_lahir"`
	TanggalLahir string `json:"tgl_lahir"`
	NamaIbu      string `json:"nm_ibu"`
	Alamat       string `json:"alamat"`
}

func (Pasien) TableName() string { return "pasien" }

type Admin struct {
	ID        uint64     `gorm:"column:id" json:"id"`
	Name      string     `gorm:"column:name" json:"name"`
	Email     string     `gorm:"column:email" json:"email"`
	Password  string     `gorm:"column:password" json:"-"`
	Role      string     `gorm:"column:role" json:"role"`
	FotoURL   string     `gorm:"column:foto_url" json:"foto_url"`
	IsActive  bool       `gorm:"column:is_active" json:"is_active"`
	LastLogin *time.Time `gorm:"column:last_login" json:"last_login,omitempty"`
	CreatedAt time.Time  `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time  `gorm:"column:updated_at" json:"updated_at"`
}

func (Admin) TableName() string { return "admins" }

type Dokter struct {
	ID            uint64     `gorm:"column:id" json:"id"`
	KodeDokter    string     `gorm:"column:kd_dokter" json:"kd_dokter"`
	NamaDokter    string     `gorm:"column:nm_dokter" json:"nm_dokter"`
	JenisKelamin  string     `gorm:"column:jk" json:"jk"`
	TempatLahir   string     `gorm:"column:tmp_lahir" json:"tmp_lahir"`
	TanggalLahir  *time.Time `gorm:"column:tgl_lahir" json:"tgl_lahir,omitempty"`
	GolonganDarah string     `gorm:"column:gol_drh" json:"gol_drh"`
	Agama         string     `gorm:"column:agama" json:"agama"`
	Alamat        string     `gorm:"column:almt_tgl" json:"almt_tgl"`
	NoTelepon     string     `gorm:"column:no_telp" json:"no_telp"`
	Email         string     `gorm:"column:email" json:"email"`
	Status        string     `gorm:"column:stts_nikah" json:"stts_nikah"`
	KodeSpesialis string     `gorm:"column:kd_sps" json:"kd_sps"`
	Alumni        string     `gorm:"column:alumni" json:"alumni"`
	NoIzinPraktek string     `gorm:"column:no_ijn_praktek" json:"no_ijn_praktek"`
	FotoURL       string     `gorm:"column:foto_url" json:"foto_url"`
	ShortDesc     string     `gorm:"column:short_desc" json:"short_desc"`
	ShowOnWebsite bool       `gorm:"column:show_on_website" json:"show_on_website"`
	CreatedAt     time.Time  `gorm:"column:created_at" json:"created_at"`
	UpdatedAt     time.Time  `gorm:"column:updated_at" json:"updated_at"`
}

func (Dokter) TableName() string { return "dokter" }

type Kamar struct {
	ID            uint64    `gorm:"column:id" json:"id"`
	KodeBangsal   string    `gorm:"column:kd_bangsal" json:"kd_bangsal"`
	NamaBangsal   string    `gorm:"column:nm_bangsal" json:"nm_bangsal"`
	ThumbnailURL  string    `gorm:"column:thumbnail_url" json:"thumbnail_url"`
	RoomDesc      string    `gorm:"column:room_desc" json:"room_desc"`
	Facilities    string    `gorm:"column:facilities" json:"facilities"`
	TotalBed      int       `gorm:"column:total_bed" json:"total_bed"`
	AvailableBed  int       `gorm:"column:available_bed" json:"available_bed"`
	IsFeatured    bool      `gorm:"column:is_featured" json:"is_featured"`
	ShowOnWebsite bool      `gorm:"column:show_on_website" json:"show_on_website"`
	CreatedAt     time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt     time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (Kamar) TableName() string { return "kamar" }

type Galeri struct {
	ID          uint64    `gorm:"column:id" json:"id"`
	Title       string    `gorm:"column:title" json:"title"`
	ImageURL    string    `gorm:"column:image_url" json:"image_url"`
	Category    string    `gorm:"column:category" json:"category"`
	Description string    `gorm:"column:description" json:"description"`
	SortOrder   int       `gorm:"column:sort_order" json:"sort_order"`
	IsActive    bool      `gorm:"column:is_active" json:"is_active"`
	CreatedAt   time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt   time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (Galeri) TableName() string { return "galeri" }

type Promo struct {
	ID        uint64     `gorm:"column:id" json:"id"`
	Title     string     `gorm:"column:title" json:"title"`
	Slug      string     `gorm:"column:slug" json:"slug"`
	ImageURL  string     `gorm:"column:image_url" json:"image_url"`
	ShortDesc string     `gorm:"column:short_desc" json:"short_desc"`
	Desc      string     `gorm:"column:desc" json:"desc"`
	StartDate *time.Time `gorm:"column:start_date" json:"start_date,omitempty"`
	EndDate   *time.Time `gorm:"column:end_date" json:"end_date,omitempty"`
	SortOrder int        `gorm:"column:sort_order" json:"sort_order"`
	IsActive  bool       `gorm:"column:is_active" json:"is_active"`
	CreatedAt time.Time  `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time  `gorm:"column:updated_at" json:"updated_at"`
}

func (Promo) TableName() string { return "promo" }

type ArtikelKategori struct {
	ID        uint64    `gorm:"column:id" json:"id"`
	Name      string    `gorm:"column:name" json:"name"`
	Slug      string    `gorm:"column:slug" json:"slug"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (ArtikelKategori) TableName() string { return "artikel_kategori" }

type Artikel struct {
	ID           uint64     `gorm:"column:id" json:"id"`
	Title        string     `gorm:"column:title" json:"title"`
	Slug         string     `gorm:"column:slug" json:"slug"`
	ThumbnailURL string     `gorm:"column:thumbnail_url" json:"thumbnail_url"`
	ShortDesc    string     `gorm:"column:short_desc" json:"short_desc"`
	Desc         string     `gorm:"column:desc" json:"desc"`
	KategoriID   *uint64    `gorm:"column:kategori_id" json:"kategori_id,omitempty"`
	IsActive     bool       `gorm:"column:is_active" json:"is_active"`
	PublishedAt  *time.Time `gorm:"column:published_at" json:"published_at,omitempty"`
	CreatedAt    time.Time  `gorm:"column:created_at" json:"created_at"`
	UpdatedAt    time.Time  `gorm:"column:updated_at" json:"updated_at"`
}

func (Artikel) TableName() string { return "artikel" }

type Layanan struct {
	ID           uint64    `gorm:"column:id" json:"id"`
	Name         string    `gorm:"column:name" json:"name"`
	Slug         string    `gorm:"column:slug" json:"slug"`
	ThumbnailURL string    `gorm:"column:thumbnail_url" json:"thumbnail_url"`
	ShortDesc    string    `gorm:"column:short_desc" json:"short_desc"`
	Desc         string    `gorm:"column:desc" json:"desc"`
	SortOrder    int       `gorm:"column:sort_order" json:"sort_order"`
	IsActive     bool      `gorm:"column:is_active" json:"is_active"`
	CreatedAt    time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt    time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (Layanan) TableName() string { return "layanan" }

type JadwalDokter struct {
	ID        uint64    `gorm:"column:id" json:"id"`
	DoctorID  *uint64   `gorm:"column:doctor_id" json:"doctor_id,omitempty"`
	DayOfWeek string    `gorm:"column:day_of_week" json:"day_of_week"`
	StartTime *string   `gorm:"column:start_time" json:"start_time,omitempty"`
	EndTime   *string   `gorm:"column:end_time" json:"end_time,omitempty"`
	IsActive  bool      `gorm:"column:is_active" json:"is_active"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (JadwalDokter) TableName() string { return "jadwaldokter" }

type PesanKontak struct {
	ID        uint64    `gorm:"column:id" json:"id"`
	Name      string    `gorm:"column:name" json:"name"`
	Email     string    `gorm:"column:email" json:"email"`
	Subject   string    `gorm:"column:subject" json:"subject"`
	Message   string    `gorm:"column:message" json:"message"`
	Status    string    `gorm:"column:status" json:"status"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (PesanKontak) TableName() string { return "pesan_kontak" }

type SiteConfig struct {
	ID           uint64    `gorm:"column:id" json:"id"`
	SettingKey   string    `gorm:"column:setting_key" json:"setting_key"`
	SettingValue string    `gorm:"column:setting_value" json:"setting_value"`
	SettingGroup string    `gorm:"column:setting_group" json:"setting_group"`
	IsActive     bool      `gorm:"column:is_active" json:"is_active"`
	CreatedAt    time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt    time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (SiteConfig) TableName() string { return "site_configs" }

type SocialLink struct {
	ID        uint64    `gorm:"column:id" json:"id"`
	Label     string    `gorm:"column:label" json:"label"`
	URL       string    `gorm:"column:url" json:"url"`
	Icon      string    `gorm:"column:icon" json:"icon"`
	SortOrder int       `gorm:"column:sort_order" json:"sort_order"`
	IsActive  bool      `gorm:"column:is_active" json:"is_active"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (SocialLink) TableName() string { return "social_links" }

type OperationalHour struct {
	ID        uint64    `gorm:"column:id" json:"id"`
	DayLabel  string    `gorm:"column:day_label" json:"day_label"`
	OpenTime  *string   `gorm:"column:open_time" json:"open_time,omitempty"`
	CloseTime *string   `gorm:"column:close_time" json:"close_time,omitempty"`
	Is24Hours bool      `gorm:"column:is_24_hours" json:"is_24_hours"`
	Note      string    `gorm:"column:note" json:"note"`
	SortOrder int       `gorm:"column:sort_order" json:"sort_order"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
}

type JamOperasional struct {
	ID        uint64    `gorm:"column:id" json:"id"`
	DayLabel  string    `gorm:"column:day_label" json:"day_label"`
	OpenTime  *string   `gorm:"column:open_time" json:"open_time,omitempty"`
	CloseTime *string   `gorm:"column:close_time" json:"close_time,omitempty"`
	Is24Hours bool      `gorm:"column:is_24_hours" json:"is_24_hours"`
	Note      string    `gorm:"column:note" json:"note"`
	SortOrder int       `gorm:"column:sort_order" json:"sort_order"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (JamOperasional) TableName() string { return "jam_operasional" }

type KlikWhatsapp struct {
	ID        uint64    `gorm:"column:id" json:"id"`
	Label     string    `gorm:"column:label" json:"label"`
	URL       string    `gorm:"column:url" json:"url"`
	CreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (KlikWhatsapp) TableName() string { return "klik_whatsapp" }
