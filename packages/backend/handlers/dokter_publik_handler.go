package handlers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type JadwalPublikItem struct {
	HariKerja  string `json:"hari_kerja"`
	JamMulai   string `json:"jam_mulai"`
	JamSelesai string `json:"jam_selesai"`
	NmPoli     string `json:"nm_poli"`
}

type DokterPublikResponse struct {
	KdDokter  string             `json:"kd_dokter"`
	NmDokter  string             `json:"nm_dokter"`
	Jk        string             `json:"jk"`
	Spesialis string             `json:"spesialis"`
	NoTelp    string             `json:"no_telp"`
	FotoURL   string             `json:"foto_url"`
	Jadwal    []JadwalPublikItem `json:"jadwal"`
}

type DokterAdminResponse struct {
	KdDokter      string             `json:"kd_dokter"`
	NmDokter      string             `json:"nm_dokter"`
	Jk            string             `json:"jk"`
	Spesialis     string             `json:"spesialis"`
	NoTelp        string             `json:"no_telp"`
	Status        string             `json:"status"`
	FotoURL       string             `json:"foto_url"`
	TampilWebsite bool               `json:"tampil_website"`
	Jadwal        []JadwalPublikItem `json:"jadwal"`
}

// GET /api/dokter-publik
// Hanya dokter dengan tampil_website=1 di db_klinik.dokter_foto.
func GetDokterPublikHandler(db *gorm.DB, dbKhanza *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		empty := []DokterPublikResponse{}

		if dbKhanza == nil {
			c.JSON(http.StatusOK, gin.H{"success": true, "data": empty})
			return
		}

		// Step 1: Ambil kd_dokter yang boleh tampil dari db_klinik
		var fotoList []models.DokterFoto
		db.Where("tampil_website = ?", true).Find(&fotoList)
		if len(fotoList) == 0 {
			c.JSON(http.StatusOK, gin.H{"success": true, "data": empty})
			return
		}

		tampilSet := make(map[string]bool, len(fotoList))
		fotoMap := make(map[string]string, len(fotoList))
		kdList := make([]string, 0, len(fotoList))
		for _, f := range fotoList {
			tampilSet[f.KdDokter] = true
			fotoMap[f.KdDokter] = f.FotoURL
			kdList = append(kdList, f.KdDokter)
		}

		// Step 2: Ambil dokter aktif dari Khanza yang ada di kdList
		type DokterRaw struct {
			KdDokter  string
			NmDokter  string
			Jk        string
			Spesialis string
			NoTelp    string
		}
		var dokterList []DokterRaw
		dbKhanza.Raw(`
			SELECT d.kd_dokter, d.nm_dokter, d.jk,
			       COALESCE(NULLIF(s.nm_sps, ''), 'Dokter Umum') AS spesialis,
			       COALESCE(d.no_telp, '') AS no_telp
			FROM dokter d
			LEFT JOIN spesialis s ON d.kd_sps = s.kd_sps
			WHERE d.status = '1' AND d.kd_dokter != '-' AND d.kd_dokter IN ?
			ORDER BY d.nm_dokter
		`, kdList).Scan(&dokterList)

		if len(dokterList) == 0 {
			c.JSON(http.StatusOK, gin.H{"success": true, "data": empty})
			return
		}

		// Step 3: Ambil jadwal dari Khanza
		type JadwalRaw struct {
			KdDokter   string
			HariKerja  string
			JamMulai   string
			JamSelesai string
			NmPoli     string
		}
		var jadwalList []JadwalRaw
		dbKhanza.Raw(`
			SELECT j.kd_dokter, j.hari_kerja,
			       TIME_FORMAT(j.jam_mulai, '%H:%i') AS jam_mulai,
			       TIME_FORMAT(j.jam_selesai, '%H:%i') AS jam_selesai,
			       COALESCE(p.nm_poli, '-') AS nm_poli
			FROM jadwal j
			LEFT JOIN poliklinik p ON j.kd_poli = p.kd_poli
			WHERE j.kd_dokter IN ?
			ORDER BY FIELD(j.hari_kerja,'SENIN','SELASA','RABU','KAMIS','JUMAT','SABTU','AKHAD'),
			         j.jam_mulai
		`, kdList).Scan(&jadwalList)

		jadwalMap := make(map[string][]JadwalPublikItem)
		for _, j := range jadwalList {
			jadwalMap[j.KdDokter] = append(jadwalMap[j.KdDokter], JadwalPublikItem{
				HariKerja:  j.HariKerja,
				JamMulai:   j.JamMulai,
				JamSelesai: j.JamSelesai,
				NmPoli:     j.NmPoli,
			})
		}

		result := make([]DokterPublikResponse, 0, len(dokterList))
		for _, d := range dokterList {
			jadwal := jadwalMap[d.KdDokter]
			if jadwal == nil {
				jadwal = []JadwalPublikItem{}
			}
			result = append(result, DokterPublikResponse{
				KdDokter:  d.KdDokter,
				NmDokter:  d.NmDokter,
				Jk:        d.Jk,
				Spesialis: d.Spesialis,
				NoTelp:    d.NoTelp,
				FotoURL:   fotoMap[d.KdDokter],
				Jadwal:    jadwal,
			})
		}

		c.JSON(http.StatusOK, gin.H{"success": true, "data": result})
	}
}

// GET /api/admin/dokter
// Semua dokter aktif dari Khanza + status tampil_website dari db_klinik.
func AdminGetDokterHandler(db *gorm.DB, dbKhanza *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		empty := []DokterAdminResponse{}

		if dbKhanza == nil {
			c.JSON(http.StatusOK, gin.H{"success": true, "data": empty})
			return
		}

		type DokterRaw struct {
			KdDokter  string
			NmDokter  string
			Jk        string
			Spesialis string
			NoTelp    string
			Status    string
		}
		var dokterList []DokterRaw
		dbKhanza.Raw(`
			SELECT d.kd_dokter, d.nm_dokter, d.jk,
			       COALESCE(NULLIF(s.nm_sps, ''), 'Dokter Umum') AS spesialis,
			       COALESCE(d.no_telp, '') AS no_telp,
			       d.status
			FROM dokter d
			LEFT JOIN spesialis s ON d.kd_sps = s.kd_sps
			WHERE d.status = '1' AND d.kd_dokter != '-'
			ORDER BY d.nm_dokter
		`).Scan(&dokterList)

		if len(dokterList) == 0 {
			c.JSON(http.StatusOK, gin.H{"success": true, "data": empty})
			return
		}

		// Ambil semua dokter_foto dari db_klinik
		var fotoList []models.DokterFoto
		db.Find(&fotoList)
		fotoMap := make(map[string]models.DokterFoto, len(fotoList))
		for _, f := range fotoList {
			fotoMap[f.KdDokter] = f
		}

		// Ambil jadwal semua dokter aktif
		kdList := make([]string, 0, len(dokterList))
		for _, d := range dokterList {
			kdList = append(kdList, d.KdDokter)
		}

		type JadwalRaw struct {
			KdDokter   string
			HariKerja  string
			JamMulai   string
			JamSelesai string
			NmPoli     string
		}
		var jadwalList []JadwalRaw
		dbKhanza.Raw(`
			SELECT j.kd_dokter, j.hari_kerja,
			       TIME_FORMAT(j.jam_mulai, '%H:%i') AS jam_mulai,
			       TIME_FORMAT(j.jam_selesai, '%H:%i') AS jam_selesai,
			       COALESCE(p.nm_poli, '-') AS nm_poli
			FROM jadwal j
			LEFT JOIN poliklinik p ON j.kd_poli = p.kd_poli
			WHERE j.kd_dokter IN ?
			ORDER BY FIELD(j.hari_kerja,'SENIN','SELASA','RABU','KAMIS','JUMAT','SABTU','AKHAD'),
			         j.jam_mulai
		`, kdList).Scan(&jadwalList)

		jadwalMap := make(map[string][]JadwalPublikItem)
		for _, j := range jadwalList {
			jadwalMap[j.KdDokter] = append(jadwalMap[j.KdDokter], JadwalPublikItem{
				HariKerja:  j.HariKerja,
				JamMulai:   j.JamMulai,
				JamSelesai: j.JamSelesai,
				NmPoli:     j.NmPoli,
			})
		}

		result := make([]DokterAdminResponse, 0, len(dokterList))
		for _, d := range dokterList {
			foto := fotoMap[d.KdDokter]
			jadwal := jadwalMap[d.KdDokter]
			if jadwal == nil {
				jadwal = []JadwalPublikItem{}
			}
			result = append(result, DokterAdminResponse{
				KdDokter:      d.KdDokter,
				NmDokter:      d.NmDokter,
				Jk:            d.Jk,
				Spesialis:     d.Spesialis,
				NoTelp:        d.NoTelp,
				Status:        d.Status,
				FotoURL:       foto.FotoURL,
				TampilWebsite: foto.TampilWebsite,
				Jadwal:        jadwal,
			})
		}

		c.JSON(http.StatusOK, gin.H{"success": true, "data": result})
	}
}

// PATCH /api/admin/dokter/:kd_dokter/toggle-tampil
// Toggle tampil_website di db_klinik.dokter_foto. Tidak menyentuh Khanza.
func AdminToggleTampilDokterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		kdDokter := c.Param("kd_dokter")
		if kdDokter == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "kd_dokter wajib diisi"})
			return
		}

		var foto models.DokterFoto
		result := db.Where("kd_dokter = ?", kdDokter).First(&foto)
		if result.Error != nil {
			// Belum ada record → buat baru dengan tampil_website=true
			foto = models.DokterFoto{
				KdDokter:      kdDokter,
				TampilWebsite: true,
			}
			if err := db.Create(&foto).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		} else {
			foto.TampilWebsite = !foto.TampilWebsite
			if err := db.Save(&foto).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		}

		c.JSON(http.StatusOK, gin.H{"success": true, "tampil_website": foto.TampilWebsite})
	}
}
