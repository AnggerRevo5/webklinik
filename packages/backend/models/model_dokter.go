package models

type Dokter struct {
	ID            uint64 `gorm:"column:id" json:"id"`
	URL           string `gorm:"column:url" json:"url"`
	NamaDokter    string `gorm:"column:nama_dokter" json:"nama_dokter"`
	JadwalPraktek string `gorm:"column:jadwal_praktek" json:"jadwal_praktek"`
	Kategori      string `gorm:"column:kategori" json:"kategori"`
}

func (Dokter) TableName() string { return "dokter" }
