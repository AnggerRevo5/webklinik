package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterStaffRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/staff", handlers.GetStaffHandler(db))
	r.POST("/api/staff", handlers.CreateStaffHandler(db))
	r.PUT("/api/staff/:id", handlers.UpdateStaffHandler(db))
	r.DELETE("/api/staff/:id", handlers.DeleteStaffHandler(db))
}
