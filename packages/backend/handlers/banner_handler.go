package handlers

import (
	"net/http"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetBannerHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		banner, err := services.Banner(db)
		if err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, banner)
	}
}

func CreateBannerHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var banner models.Banner
		if err := c.ShouldBindJSON(&banner); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := services.CreateBanner(db, &banner); err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusCreated, banner)
	}
}

func UpdateBannerHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var banner models.Banner
		if err := c.ShouldBindJSON(&banner); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := services.UpdateBanner(db, &banner); err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, banner)
	}
}

func DeleteBannerHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var banner models.Banner
		if err := c.ShouldBindJSON(&banner); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := services.DeleteBanner(db, banner.ID); err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "banner dihapus"})
	}
}
