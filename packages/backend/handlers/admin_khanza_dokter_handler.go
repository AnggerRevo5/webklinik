package handlers

import (
	"backend/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /api/admin/spesialis — daftar spesialis dari sik untuk dropdown form
func AdminGetSpesialisHandler(dbKhanza *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if dbKhanza == nil {
			c.JSON(http.StatusOK, gin.H{"success": true, "data": []models.KhanzaSpesialis{}})
			return
		}
		var spesialis []models.KhanzaSpesialis
		dbKhanza.Order("nm_sps").Find(&spesialis)
		c.JSON(http.StatusOK, gin.H{"success": true, "data": spesialis})
	}
}

// POST /api/admin/khanza/dokter — tambah dokter baru ke sik.dokter
func AdminCreateKhanzaDokterHandler(dbKhanza *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if dbKhanza == nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Koneksi SIK tidak tersedia"})
			return
		}

		var input models.KhanzaDokter
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if strings.TrimSpace(input.KdDokter) == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "kd_dokter wajib diisi"})
			return
		}
		if strings.TrimSpace(input.NmDokter) == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "nm_dokter wajib diisi"})
			return
		}
		if strings.TrimSpace(input.Email) == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "email wajib diisi"})
			return
		}

		// Cek duplikasi kd_dokter
		var existing models.KhanzaDokter
		if err := dbKhanza.Where("kd_dokter = ?", input.KdDokter).First(&existing).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "kd_dokter sudah digunakan"})
			return
		}

		// Placeholder aman untuk date kosong agar tidak error di MySQL strict mode
		if input.TglLahir == "" {
			input.TglLahir = "1970-01-01"
		}
		input.Status = "1"

		if err := dbKhanza.Create(&input).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"success": true, "data": input})
	}
}

// PUT /api/admin/khanza/dokter/:kd_dokter — update data dokter di sik.dokter
func AdminUpdateKhanzaDokterHandler(dbKhanza *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if dbKhanza == nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Koneksi SIK tidak tersedia"})
			return
		}

		kdDokter := c.Param("kd_dokter")

		var input models.KhanzaDokter
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if strings.TrimSpace(input.NmDokter) == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "nm_dokter wajib diisi"})
			return
		}

		// Pastikan dokter ada dan ambil status-nya agar tidak ter-overwrite
		var existing models.KhanzaDokter
		if err := dbKhanza.Where("kd_dokter = ?", kdDokter).First(&existing).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "dokter tidak ditemukan"})
			return
		}

		if input.TglLahir == "" {
			input.TglLahir = existing.TglLahir
		}
		input.KdDokter = kdDokter
		input.Status = existing.Status // jangan ubah status lewat endpoint ini

		if err := dbKhanza.Save(&input).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"success": true, "data": input})
	}
}

// DELETE /api/admin/khanza/dokter/:kd_dokter — soft-delete: status='0'
// Tidak menghapus row agar data historis (jadwal, rawat jalan, dll) tetap valid.
func AdminDeleteKhanzaDokterHandler(dbKhanza *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if dbKhanza == nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Koneksi SIK tidak tersedia"})
			return
		}

		kdDokter := c.Param("kd_dokter")

		result := dbKhanza.Model(&models.KhanzaDokter{}).
			Where("kd_dokter = ?", kdDokter).
			Update("status", "0")

		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}
		if result.RowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "dokter tidak ditemukan"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"success": true, "message": "dokter dinonaktifkan"})
	}
}
