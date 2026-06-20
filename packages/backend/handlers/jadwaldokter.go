package handlers

import (
	"net/http"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetJadwalDokterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		kdDokter := c.Query("kd_dokter")
		jadwal, err := services.GetJadwalDokter(db, kdDokter)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, jadwal)
	}
}

func CreateJadwalDokterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var jadwal models.KhanzaJadwal
		if err := c.ShouldBindJSON(&jadwal); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := services.CreateJadwalDokter(db, &jadwal); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"success": true, "data": jadwal})
	}
}

type jadwalUpdateInput struct {
	KdDokter     string `json:"kd_dokter"`
	OldHariKerja string `json:"old_hari_kerja"`
	OldJamMulai  string `json:"old_jam_mulai"`
	HariKerja    string `json:"hari_kerja"`
	JamMulai     string `json:"jam_mulai"`
	JamSelesai   string `json:"jam_selesai"`
	KdPoli       string `json:"kd_poli"`
	Kuota        int    `json:"kuota"`
}

func UpdateJadwalDokterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input jadwalUpdateInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		jadwal := models.KhanzaJadwal{
			KdDokter:   input.KdDokter,
			HariKerja:  input.HariKerja,
			JamMulai:   input.JamMulai,
			JamSelesai: input.JamSelesai,
			KdPoli:     input.KdPoli,
			Kuota:      input.Kuota,
		}
		if err := services.UpdateJadwalDokter(db, &jadwal, input.OldHariKerja, input.OldJamMulai); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": jadwal})
	}
}

type jadwalDeleteInput struct {
	KdDokter  string `json:"kd_dokter"`
	HariKerja string `json:"hari_kerja"`
	JamMulai  string `json:"jam_mulai"`
}

func DeleteJadwalDokterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input jadwalDeleteInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := services.DeleteJadwalDokter(db, input.KdDokter, input.HariKerja, input.JamMulai); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "jadwal dihapus"})
	}
}
