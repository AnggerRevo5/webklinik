package models

// KhanzaBooking, KhanzaPasien, KhanzaPoliklinik, KhanzaPenjab memetakan tabel Khanza SIK.
// Gunakan hanya dengan DBKhanza, BUKAN DBWebsite.

type KhanzaPasien struct {
	NoRkmMedis       string `gorm:"column:no_rkm_medis;primaryKey"`
	NmPasien         string `gorm:"column:nm_pasien"`
	NoKtp            string `gorm:"column:no_ktp"`
	Jk               string `gorm:"column:jk"`
	TmpLahir         string `gorm:"column:tmp_lahir"`
	TglLahir         string `gorm:"column:tgl_lahir"`
	NmIbu            string `gorm:"column:nm_ibu"`
	Alamat           string `gorm:"column:alamat"`
	GolDarah         string `gorm:"column:gol_darah"`
	Pekerjaan        string `gorm:"column:pekerjaan"`
	SttsNikah        string `gorm:"column:stts_nikah"`
	Agama            string `gorm:"column:agama"`
	TglDaftar        string `gorm:"column:tgl_daftar"`
	NoTlp            string `gorm:"column:no_tlp"`
	Umur             string `gorm:"column:umur"`
	Pnd              string `gorm:"column:pnd"`
	Keluarga         string `gorm:"column:keluarga"`
	Namakeluarga     string `gorm:"column:namakeluarga"`
	KdPj             string `gorm:"column:kd_pj"`
	NoPeserta        string `gorm:"column:no_peserta"`
	KdKel            int    `gorm:"column:kd_kel"`
	KdKec            int    `gorm:"column:kd_kec"`
	KdKab            int    `gorm:"column:kd_kab"`
	KdProp           int    `gorm:"column:kd_prop"`
	PekerjaanPj      string `gorm:"column:pekerjaanpj"`
	AlamatPj         string `gorm:"column:alamatpj"`
	KelurahanPj      string `gorm:"column:kelurahanpj"`
	KecamatanPj      string `gorm:"column:kecamatanpj"`
	KabupatenPj      string `gorm:"column:kabupatenpj"`
	PropinsiPj       string `gorm:"column:propinsipj"`
	PerusahaanPasien string `gorm:"column:perusahaan_pasien"`
	SukuBangsa       int    `gorm:"column:suku_bangsa"`
	BahasaPasien     int    `gorm:"column:bahasa_pasien"`
	CacatFisik       int    `gorm:"column:cacat_fisik"`
	Email            string `gorm:"column:email"`
	Nip              string `gorm:"column:nip"`
}

func (KhanzaPasien) TableName() string { return "pasien" }

type KhanzaBooking struct {
	TanggalBooking string `gorm:"column:tanggal_booking"`
	JamBooking     string `gorm:"column:jam_booking"`
	NoRkmMedis     string `gorm:"column:no_rkm_medis;primaryKey"`
	TanggalPeriksa string `gorm:"column:tanggal_periksa;primaryKey"`
	KdDokter       string `gorm:"column:kd_dokter"`
	KdPoli         string `gorm:"column:kd_poli"`
	NoReg          string `gorm:"column:no_reg"`
	KdPj           string `gorm:"column:kd_pj"`
	LimitReg       int    `gorm:"column:limit_reg"`
	WaktuKunjungan string `gorm:"column:waktu_kunjungan"`
	Status         string `gorm:"column:status"`
}

func (KhanzaBooking) TableName() string { return "booking_registrasi" }

type KhanzaPoliklinik struct {
	KdPoli string `gorm:"column:kd_poli;primaryKey" json:"kd_poli"`
	NmPoli string `gorm:"column:nm_poli"            json:"nm_poli"`
	Status string `gorm:"column:status"             json:"-"`
}

func (KhanzaPoliklinik) TableName() string { return "poliklinik" }

type KhanzaPenjab struct {
	KdPj           string `gorm:"column:kd_pj;primaryKey" json:"kd_pj"`
	PngJawab       string `gorm:"column:png_jawab"        json:"png_jawab"`
	NamaPerusahaan string `gorm:"column:nama_perusahaan"  json:"nama_perusahaan"`
	Status         string `gorm:"column:status"           json:"status"`
}

func (KhanzaPenjab) TableName() string { return "penjab" }
