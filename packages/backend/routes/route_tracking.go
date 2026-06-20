package routes

import (
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterTrackingRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/visitor-sessions", handlers.GetVisitorSessionsHandler(db))

	track := r.Group("/api/track")
	{
		track.POST("/session/start", handlers.TrackSessionStartHandler(db))
		track.POST("/session/pageview", handlers.TrackPageviewHandler(db))
		track.POST("/session/end", handlers.TrackSessionEndHandler(db))
		track.POST("/social-click", handlers.TrackSocialClickHandler(db))
	}
}
