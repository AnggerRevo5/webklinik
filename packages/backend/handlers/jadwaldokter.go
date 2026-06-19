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
		jadwal, err := services.GetJadwalDokter(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, jadwal)
	}
}

func CreateJadwalDokterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var jadwal models.JadwalDokter
		if err := c.ShouldBindJSON(&jadwal); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.CreateJadwalDokter(db, &jadwal); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, jadwal)
	}
}

func UpdateJadwalDokterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var jadwal models.JadwalDokter
		if err := c.ShouldBindJSON(&jadwal); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.UpdateJadwalDokter(db, &jadwal); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, jadwal)
	}
}

func DeleteJadwalDokterHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var jadwal models.JadwalDokter
		if err := c.ShouldBindJSON(&jadwal); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := services.DeleteJadwalDokter(db, jadwal.KodeDokter); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "jadwal dokter dihapus"})
	}
}
