package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterPromoRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/promo", handlers.GetPromoHandler(db))
	r.POST("/api/promo", handlers.CreatePromoHandler(db))
	r.PUT("/api/promo/:id", handlers.UpdatePromoHandler(db))
	r.DELETE("/api/promo/:id", handlers.DeletePromoHandler(db))
}
