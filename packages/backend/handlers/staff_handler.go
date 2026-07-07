package handlers

import (
	"net/http"
	"strconv"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GetStaffHandler — publik. Dengan ?active=true hanya mengembalikan staff aktif.
func GetStaffHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		onlyActive := c.Query("active") == "true"
		staff, err := services.StaffList(db, onlyActive)
		if err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, staff)
	}
}

func CreateStaffHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var staff models.Staff
		if err := c.ShouldBindJSON(&staff); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := services.CreateStaff(db, &staff); err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusCreated, staff)
	}
}

func UpdateStaffHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var staff models.Staff
		if err := c.ShouldBindJSON(&staff); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if staff.ID == 0 {
			if id, err := strconv.ParseUint(c.Param("id"), 10, 64); err == nil {
				staff.ID = id
			}
		}
		if err := services.UpdateStaff(db, &staff); err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, staff)
	}
}

func DeleteStaffHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body models.Staff
		_ = c.ShouldBindJSON(&body)
		id := body.ID
		if id == 0 {
			if parsed, err := strconv.ParseUint(c.Param("id"), 10, 64); err == nil {
				id = parsed
			}
		}
		if err := services.DeleteStaff(db, id); err != nil {
			respondInternal(c, err, "")
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "staff dihapus"})
	}
}
