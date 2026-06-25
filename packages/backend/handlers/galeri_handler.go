package handlers

import (
	"net/http"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetGaleriHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		kategori := c.Query("kategori")
		galeri, err := services.GaleriFiltered(db, kategori)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, galeri)
	}
}

func GetGaleriPreviewHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		preview, err := services.GaleriPreview(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, preview)
	}
}

func CreateGaleriHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var galeri models.Galeri
		if err := c.ShouldBindJSON(&galeri); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := services.CreateGaleri(db, &galeri); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, galeri)
	}
}

func UpdateGaleriHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var galeri models.Galeri
		if err := c.ShouldBindJSON(&galeri); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := services.UpdateGaleri(db, &galeri); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, galeri)
	}
}

func DeleteGaleriHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var galeri models.Galeri
		if err := c.ShouldBindJSON(&galeri); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := services.DeleteGaleri(db, galeri.ID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "galeri dihapus"})
	}
}
