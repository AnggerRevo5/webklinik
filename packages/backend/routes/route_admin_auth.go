package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterAdminAuthRoutes(r *gin.Engine, db *gorm.DB) {
	r.POST("/api/admin/session", handlers.AdminSessionLoginHandler(db))
	r.POST("/api/admin/session/validate", handlers.AdminSessionValidateHandler(db))
	r.DELETE("/api/admin/session", handlers.AdminSessionLogoutHandler(db))

	r.GET("/api/admin/admin-users", handlers.AdminListUsersHandler(db))
	r.POST("/api/admin/admin-users", handlers.AdminCreateUserHandler(db))
	r.PUT("/api/admin/admin-users/:id", handlers.AdminUpdateUserHandler(db))
	r.DELETE("/api/admin/admin-users/:id", handlers.AdminDeleteUserHandler(db))
}
