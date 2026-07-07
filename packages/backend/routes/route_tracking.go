package routes

import (
	"backend/handlers"
	"backend/middleware"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterTrackingRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/api/visitor-sessions", handlers.GetVisitorSessionsHandler(db))

	// Rate limiter khusus endpoint tracking (mencegah spam/pollusi data analitik).
	// Default 30/menit/IP, bisa disetel via RATE_LIMIT_TRACK.
	trackLimiter := middleware.NewRateLimiter(envInt("RATE_LIMIT_TRACK", 30), time.Minute)

	track := r.Group("/api/track")
	track.Use(trackLimiter.Middleware())
	{
		track.POST("/session/start", handlers.TrackSessionStartHandler(db))
		track.POST("/session/pageview", handlers.TrackPageviewHandler(db))
		track.POST("/session/end", handlers.TrackSessionEndHandler(db))
		track.POST("/social-click", handlers.TrackSocialClickHandler(db))
	}
}
