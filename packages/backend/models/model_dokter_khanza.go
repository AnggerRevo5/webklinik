package models

// KhanzaDokter memetakan tabel dokter di Khanza SIK.
// Gunakan hanya dengan DBKhanza, BUKAN DBWebsite.

type KhanzaDokter struct {
	KdDokter     string `gorm:"column:kd_dokter;primaryKey" json:"kd_dokter"`
	NmDokter     string `gorm:"column:nm_dokter"            json:"nm_dokter"`
	Jk           string `gorm:"column:jk"                   json:"jk"`
	TmpLahir     string `gorm:"column:tmp_lahir"            json:"tmp_lahir"`
	TglLahir     string `gorm:"column:tgl_lahir"            json:"tgl_lahir"`
	GolDrh       string `gorm:"column:gol_drh"              json:"gol_drh"`
	Agama        string `gorm:"column:agama"                json:"agama"`
	AlmtTgl      string `gorm:"column:almt_tgl"             json:"almt_tgl"`
	NoTelp       string `gorm:"column:no_telp"              json:"no_telp"`
	Email        string `gorm:"column:email"                json:"email"`
	SttsNikah    string `gorm:"column:stts_nikah"           json:"stts_nikah"`
	KdSps        string `gorm:"column:kd_sps"               json:"kd_sps"`
	Alumni       string `gorm:"column:alumni"               json:"alumni"`
	NoIjnPraktek string `gorm:"column:no_ijn_praktek"       json:"no_ijn_praktek"`
	Status       string `gorm:"column:status"               json:"status"`
}

func (KhanzaDokter) TableName() string { return "dokter" }
