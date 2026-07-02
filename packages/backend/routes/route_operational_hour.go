package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterOperationalHourRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/operational-hours", handlers.GetOperationalHoursHandler(db))
	r.POST("/api/operational-hours", handlers.CreateOperationalHourHandler(db))
	r.PUT("/api/operational-hours/:id", handlers.UpdateOperationalHourHandler(db))
	r.DELETE("/api/operational-hours/:id", handlers.DeleteOperationalHourHandler(db))
}
