package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// publicPOSTPrefixes = path POST/PUT/DELETE yang bebas diakses tanpa API key
var publicPOSTPrefixes = []string{
	"/api/pendaftaran",
	"/api/track/",
	"/api/kontak",
}

// AdminAuth memeriksa X-Admin-Key header untuk semua request mutating.
// GET, OPTIONS, HEAD, dan path di publicPOSTPrefixes selalu diizinkan.
func AdminAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		method := c.Request.Method

		if method == "GET" || method == "OPTIONS" || method == "HEAD" {
			c.Next()
			return
		}

		path := c.Request.URL.Path
		for _, prefix := range publicPOSTPrefixes {
			if strings.HasPrefix(path, prefix) {
				c.Next()
				return
			}
		}

		expected := os.Getenv("ADMIN_API_KEY")
		if expected == "" {
			// Kunci belum dikonfigurasi di .env — izinkan sementara agar tidak lock out
			c.Next()
			return
		}

		if c.GetHeader("X-Admin-Key") != expected {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Tidak diizinkan"})
			c.Abort()
			return
		}
		c.Next()
	}
}
