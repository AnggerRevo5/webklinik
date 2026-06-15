package handlers

import (
	"backend/models"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// DokterJadwal adalah hasil JOIN dokter + jadwal untuk endpoint GetDokterByPoliHari.
type DokterJadwal struct {
	KdDokter   string `json:"kd_dokter"`
	NmDokter   string `json:"nm_dokter"`
	JamMulai   string `json:"jam_mulai"`
	JamSelesai string `json:"jam_selesai"`
	Kuota      int    `json:"kuota"`
	SisaKuota  int    `json:"sisa_kuota"`
}

func khanzaNotAvailable(c *gin.Context) {
	c.JSON(http.StatusServiceUnavailable, gin.H{
		"success": false,
		"error":   "Layanan Khanza tidak tersedia, hubungi administrator",
	})
}

// GET /api/pendaftaran/cek-pasien?nik=xxxx
func CekPasienByNIKHandler(dbKhanza *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if dbKhanza == nil {
			khanzaNotAvailable(c)
			return
		}
		nik := c.Query("nik")
		if nik == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Parameter nik wajib diisi"})
			return
		}

		var pasien models.KhanzaPasien
		result := dbKhanza.Where("no_ktp = ?", nik).First(&pasien)
		if result.Error != nil {
			c.JSON(http.StatusOK, gin.H{
				"success": true,
				"found":   false,
				"message": "Pasien belum terdaftar, silakan isi data baru",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"found":   true,
			"data": gin.H{
				"no_rkm_medis": pasien.NoRkmMedis,
				"nm_pasien":    pasien.NmPasien,
				"tgl_lahir":    pasien.TglLahir,
				"jk":           pasien.Jk,
				"no_tlp":       pasien.NoTlp,
				"alamat":       pasien.Alamat,
				"no_ktp":       pasien.NoKtp,
				"kd_pj":        pasien.KdPj,
			},
		})
	}
}

// GET /api/pendaftaran/poli
func GetPoliAktifHandler(dbKhanza *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if dbKhanza == nil {
			khanzaNotAvailable(c)
			return
		}
		var poli []models.KhanzaPoliklinik
		dbKhanza.
			Where("status = '1' AND kd_poli != '-'").
			Order("nm_poli").
			Find(&poli)
		c.JSON(http.StatusOK, gin.H{"success": true, "data": poli})
	}
}

// GET /api/pendaftaran/dokter?kd_poli=U0003&hari=SENIN&tanggal=2026-06-16
func GetDokterByPoliHariHandler(dbKhanza *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if dbKhanza == nil {
			khanzaNotAvailable(c)
			return
		}
		kdPoli := c.Query("kd_poli")
		hari := c.Query("hari")
		tanggal := c.Query("tanggal")
		if kdPoli == "" || hari == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Parameter kd_poli dan hari wajib diisi"})
			return
		}

		const baseSQL = `
			SELECT d.kd_dokter, d.nm_dokter, j.jam_mulai, j.jam_selesai, j.kuota,
			       (j.kuota - IFNULL(
			           (SELECT COUNT(*) FROM booking_registrasi br
			            WHERE br.kd_dokter = d.kd_dokter
			            AND br.tanggal_periksa = %s
			            AND br.status != 'Batal'), 0
			       )) AS sisa_kuota
			FROM dokter d
			JOIN jadwal j ON d.kd_dokter = j.kd_dokter
			WHERE d.status = '1'
			AND j.kd_poli = ?
			AND j.hari_kerja = ?
			AND d.kd_dokter != '-'
		`

		var hasil []DokterJadwal
		if tanggal != "" {
			dbKhanza.Raw(fmt.Sprintf(baseSQL, "?"), tanggal, kdPoli, hari).Scan(&hasil)
		} else {
			dbKhanza.Raw(fmt.Sprintf(baseSQL, "CURDATE()"), kdPoli, hari).Scan(&hasil)
		}

		c.JSON(http.StatusOK, gin.H{"success": true, "data": hasil})
	}
}

// GET /api/pendaftaran/kuota?kd_dokter=D0000004&tanggal=2026-06-15
func CekKuotaHandler(dbKhanza *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if dbKhanza == nil {
			khanzaNotAvailable(c)
			return
		}
		kdDokter := c.Query("kd_dokter")
		tanggal := c.Query("tanggal")
		if kdDokter == "" || tanggal == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Parameter kd_dokter dan tanggal wajib diisi"})
			return
		}

		t, err := time.Parse("2006-01-02", tanggal)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Format tanggal tidak valid (YYYY-MM-DD)"})
			return
		}

		hariMap := map[time.Weekday]string{
			time.Monday:    "SENIN",
			time.Tuesday:   "SELASA",
			time.Wednesday: "RABU",
			time.Thursday:  "KAMIS",
			time.Friday:    "JUMAT",
			time.Saturday:  "SABTU",
			time.Sunday:    "AKHAD",
		}
		hari := hariMap[t.Weekday()]

		var jadwal models.KhanzaJadwal
		dbKhanza.
			Where("kd_dokter = ? AND hari_kerja = ?", kdDokter, hari).
			First(&jadwal)

		var terisi int64
		dbKhanza.Model(&models.KhanzaBooking{}).
			Where("kd_dokter = ? AND tanggal_periksa = ? AND status != 'Batal'", kdDokter, tanggal).
			Count(&terisi)

		sisa := jadwal.Kuota - int(terisi)
		tersedia := sisa > 0 || jadwal.Kuota == 0

		c.JSON(http.StatusOK, gin.H{
			"success":     true,
			"kuota":       jadwal.Kuota,
			"terisi":      terisi,
			"sisa":        sisa,
			"tersedia":    tersedia,
			"jam_mulai":   jadwal.JamMulai,
			"jam_selesai": jadwal.JamSelesai,
		})
	}
}

// GET /api/pendaftaran/penjamin
func GetPenjaminHandler(dbKhanza *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if dbKhanza == nil {
			khanzaNotAvailable(c)
			return
		}
		var penjab []models.KhanzaPenjab
		dbKhanza.
			Where("status = '1' AND kd_pj != '-'").
			Order("png_jawab").
			Find(&penjab)
		c.JSON(http.StatusOK, gin.H{"success": true, "data": penjab})
	}
}

// POST /api/pendaftaran
func SubmitPendaftaranHandler(dbKhanza *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if dbKhanza == nil {
			khanzaNotAvailable(c)
			return
		}

		type RequestBody struct {
			IsNewPasien    bool   `json:"is_new_pasien"`
			NoRkmMedis     string `json:"no_rkm_medis"`
			NoKtp          string `json:"no_ktp"`
			NmPasien       string `json:"nm_pasien"`
			Jk             string `json:"jk"`
			TmpLahir       string `json:"tmp_lahir"`
			TglLahir       string `json:"tgl_lahir"`
			NmIbu          string `json:"nm_ibu"`
			Alamat         string `json:"alamat"`
			GolDarah       string `json:"gol_darah"`
			Pekerjaan      string `json:"pekerjaan"`
			SttsNikah      string `json:"stts_nikah"`
			Agama          string `json:"agama"`
			NoTlp          string `json:"no_tlp"`
			Pnd            string `json:"pnd"`
			Keluarga       string `json:"keluarga"`
			Namakeluarga   string `json:"namakeluarga"`
			KdPj           string `json:"kd_pj"`
			NoPeserta      string `json:"no_peserta"`
			KdPoli         string `json:"kd_poli"`
			KdDokter       string `json:"kd_dokter"`
			TanggalPeriksa string `json:"tanggal_periksa"`
			WaktuKunjungan string `json:"waktu_kunjungan"`
		}

		var body RequestBody
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
			return
		}

		tx := dbKhanza.Begin()
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()

		noRkmMedis := body.NoRkmMedis

		if body.IsNewPasien {
			var maxNo struct{ MaxNo string }
			tx.Raw(`SELECT LPAD(MAX(CAST(no_rkm_medis AS UNSIGNED)) + 1, 6, '0') AS max_no
			        FROM pasien WHERE no_rkm_medis REGEXP '^[0-9]+$'`).Scan(&maxNo)
			if maxNo.MaxNo == "" || maxNo.MaxNo == "000000" {
				maxNo.MaxNo = "000001"
			}
			noRkmMedis = maxNo.MaxNo

			umur := hitungUmur(body.TglLahir)

			pasienBaru := models.KhanzaPasien{
				NoRkmMedis:       noRkmMedis,
				NmPasien:         body.NmPasien,
				NoKtp:            body.NoKtp,
				Jk:               body.Jk,
				TmpLahir:         body.TmpLahir,
				TglLahir:         body.TglLahir,
				NmIbu:            body.NmIbu,
				Alamat:           body.Alamat,
				GolDarah:         ifEmpty(body.GolDarah, "-"),
				Pekerjaan:        ifEmpty(body.Pekerjaan, "-"),
				SttsNikah:        ifEmpty(body.SttsNikah, "BELUM MENIKAH"),
				Agama:            ifEmpty(body.Agama, "-"),
				TglDaftar:        time.Now().Format("2006-01-02"),
				NoTlp:            body.NoTlp,
				Umur:             umur,
				Pnd:              ifEmpty(body.Pnd, "-"),
				Keluarga:         ifEmpty(body.Keluarga, "DIRI SENDIRI"),
				Namakeluarga:     ifEmpty(body.Namakeluarga, body.NmPasien),
				KdPj:             body.KdPj,
				NoPeserta:        body.NoPeserta,
				KdKel:            1,
				KdKec:            1,
				KdKab:            1,
				KdProp:           1,
				PekerjaanPj:      "-",
				AlamatPj:         ifEmpty(body.Alamat, "-"),
				KelurahanPj:      "-",
				KecamatanPj:      "-",
				KabupatenPj:      "-",
				PropinsiPj:       "-",
				PerusahaanPasien: "-",
				SukuBangsa:       1,
				BahasaPasien:     1,
				CacatFisik:       1,
				Email:            "-",
				Nip:              "-",
			}

			if err := tx.Create(&pasienBaru).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"success": false,
					"error":   "Gagal mendaftarkan pasien: " + err.Error(),
				})
				return
			}
		}

		// Cek duplikat: 1 pasien hanya boleh booking 1x per tanggal (composite PK)
		var existingBooking models.KhanzaBooking
		if dupCheck := tx.Where("no_rkm_medis = ? AND tanggal_periksa = ?",
			noRkmMedis, body.TanggalPeriksa).First(&existingBooking); dupCheck.Error == nil {
			tx.Rollback()
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"error":   "Pasien sudah memiliki booking pada tanggal ini",
			})
			return
		}

		// no_reg: urutan per tanggal_periksa, format '001','002',...
		var countBooking int64
		tx.Model(&models.KhanzaBooking{}).
			Where("tanggal_periksa = ?", body.TanggalPeriksa).
			Count(&countBooking)
		noReg := fmt.Sprintf("%03d", countBooking+1)

		waktuKunjungan := body.TanggalPeriksa + " " + body.WaktuKunjungan
		if body.WaktuKunjungan == "" {
			waktuKunjungan = body.TanggalPeriksa + " 00:00:00"
		}

		booking := models.KhanzaBooking{
			TanggalBooking: time.Now().Format("2006-01-02"),
			JamBooking:     time.Now().Format("15:04:05"),
			NoRkmMedis:     noRkmMedis,
			TanggalPeriksa: body.TanggalPeriksa,
			KdDokter:       body.KdDokter,
			KdPoli:         body.KdPoli,
			NoReg:          noReg,
			KdPj:           body.KdPj,
			LimitReg:       1,
			WaktuKunjungan: waktuKunjungan,
			Status:         "Belum",
		}

		if err := tx.Create(&booking).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   "Gagal membuat booking: " + err.Error(),
			})
			return
		}

		tx.Commit()

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Pendaftaran berhasil",
			"data": gin.H{
				"no_reg":          noReg,
				"no_rkm_medis":    noRkmMedis,
				"tanggal_periksa": body.TanggalPeriksa,
				"waktu_kunjungan": waktuKunjungan,
				"status":          "Belum",
			},
		})
	}
}

func ifEmpty(s, def string) string {
	if s == "" {
		return def
	}
	return s
}

func hitungUmur(tglLahirStr string) string {
	tgl, err := time.Parse("2006-01-02", tglLahirStr)
	if err != nil {
		return "-"
	}
	now := time.Now()
	tahun := now.Year() - tgl.Year()
	bulan := int(now.Month()) - int(tgl.Month())
	hari := now.Day() - tgl.Day()
	if hari < 0 {
		bulan--
	}
	if bulan < 0 {
		tahun--
		bulan += 12
	}
	if hari < 0 {
		hari = 0
	}
	return fmt.Sprintf("%d Th %d Bl %d Hr", tahun, bulan, hari)
}
