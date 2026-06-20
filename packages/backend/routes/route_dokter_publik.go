package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterDokterPublikRoutes(r *gin.Engine, db *gorm.DB, dbKhanza *gorm.DB) {
	r.GET("/api/dokter-publik", handlers.GetDokterPublikHandler(db, dbKhanza))
	r.GET("/api/admin/dokter", handlers.AdminGetDokterHandler(db, dbKhanza))
	r.PATCH("/api/admin/dokter/:kd_dokter/toggle-tampil", handlers.AdminToggleTampilDokterHandler(db))
}
