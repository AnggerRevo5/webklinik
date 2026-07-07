package handlers

import (
	"net/http"
	"strconv"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetOperationalHoursHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		hours, err := services.OperationalHours(db)
		if err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, hours)
	}
}

func CreateOperationalHourHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var h models.OperationalHour
		if err := c.ShouldBindJSON(&h); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := services.CreateOperationalHour(db, &h); err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusCreated, h)
	}
}

func UpdateOperationalHourHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var h models.OperationalHour
		if err := c.ShouldBindJSON(&h); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if h.ID == 0 {
			if id, err := strconv.ParseUint(c.Param("id"), 10, 64); err == nil {
				h.ID = id
			}
		}
		if err := services.UpdateOperationalHour(db, &h); err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, h)
	}
}

func DeleteOperationalHourHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body models.OperationalHour
		_ = c.ShouldBindJSON(&body)
		id := body.ID
		if id == 0 {
			if parsed, err := strconv.ParseUint(c.Param("id"), 10, 64); err == nil {
				id = parsed
			}
		}
		if err := services.DeleteOperationalHour(db, id); err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "jam operasional dihapus"})
	}
}
