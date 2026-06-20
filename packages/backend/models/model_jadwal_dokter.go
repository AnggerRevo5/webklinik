package models

// KhanzaJadwal, KhanzaSpesialis memetakan tabel Khanza SIK.
// Gunakan hanya dengan DBKhanza, BUKAN DBWebsite.

type KhanzaJadwal struct {
	KdDokter   string `gorm:"column:kd_dokter;primaryKey"  json:"kd_dokter"`
	HariKerja  string `gorm:"column:hari_kerja;primaryKey" json:"hari_kerja"`
	JamMulai   string `gorm:"column:jam_mulai;primaryKey"  json:"jam_mulai"`
	JamSelesai string `gorm:"column:jam_selesai"           json:"jam_selesai"`
	KdPoli     string `gorm:"column:kd_poli"               json:"kd_poli"`
	Kuota      int    `gorm:"column:kuota"                 json:"kuota"`
}

func (KhanzaJadwal) TableName() string { return "jadwal" }

type KhanzaSpesialis struct {
	KdSps string `gorm:"column:kd_sps;primaryKey" json:"kd_sps"`
	NmSps string `gorm:"column:nm_sps"            json:"nm_sps"`
}

func (KhanzaSpesialis) TableName() string { return "spesialis" }
