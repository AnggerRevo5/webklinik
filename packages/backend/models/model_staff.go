package models

// Staff menyimpan data tim/staff klinik yang ditampilkan di section "Tim Kami".
// Hanya data non-sensitif: nama lengkap, jabatan, dan foto.
type Staff struct {
	ID       uint64 `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Nama     string `gorm:"column:nama"                        json:"nama"`
	Jabatan  string `gorm:"column:jabatan"                     json:"jabatan"`
	FotoURL  string `gorm:"column:foto_url"                    json:"foto_url"`
	Urutan   int    `gorm:"column:urutan;default:0;index"      json:"urutan"`
	IsActive bool   `gorm:"column:is_active;default:1"         json:"is_active"`
}

func (Staff) TableName() string { return "staff" }
