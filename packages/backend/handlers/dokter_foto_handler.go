package handlers

import (
	"net/http"

	"backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// PUT /api/dokter-foto/:kd_dokter
// Upsert foto dokter di db_klinik.dokter_foto.
// Field foto_url boleh kosong (untuk menghapus foto).
func UpdateDokterFotoHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		kdDokter := c.Param("kd_dokter")
		if kdDokter == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "kd_dokter diperlukan"})
			return
		}

		var body struct {
			FotoURL string `json:"foto_url"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		foto := models.DokterFoto{
			KdDokter: kdDokter,
			FotoURL:  body.FotoURL,
		}

		// Upsert: insert kalau belum ada, update kalau sudah ada
		result := db.Where(models.DokterFoto{KdDokter: kdDokter}).
			Assign(models.DokterFoto{FotoURL: body.FotoURL}).
			FirstOrCreate(&foto)

		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}

		// Jika record sudah ada tapi FotoURL berbeda, update
		if result.RowsAffected == 0 {
			db.Model(&foto).Update("foto_url", body.FotoURL)
		}

		c.JSON(http.StatusOK, gin.H{"success": true, "data": foto})
	}
}
