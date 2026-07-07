package handlers

import (
	"net/http"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetLayananHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		layanan, err := services.Layanan(db)
		if err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, layanan)
	}
}

func CreateLayananHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var layanan models.Layanan
		if err := c.ShouldBindJSON(&layanan); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := services.CreateLayanan(db, &layanan); err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusCreated, layanan)
	}
}

func UpdateLayananHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var layanan models.Layanan
		if err := c.ShouldBindJSON(&layanan); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := services.UpdateLayanan(db, &layanan); err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, layanan)
	}
}

func DeleteLayananHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var layanan models.Layanan
		if err := c.ShouldBindJSON(&layanan); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := services.DeleteLayanan(db, layanan.ID); err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "layanan dihapus"})
	}
}
