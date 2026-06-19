package routes

import (
	"backend/handlers"
	"backend/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, dbKhanza *gorm.DB, cldSvc *services.CloudinaryService) *gin.Engine {
	r := gin.Default()
	r.MaxMultipartMemory = 10 << 20
	r.Use(cors.Default())

	handlers.RegisterRoutes(r, db, dbKhanza, cldSvc)

	return r
}
