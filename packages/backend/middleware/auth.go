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

// isProtectedReadPath = path GET/HEAD yang tetap butuh X-Admin-Key (data admin/PII).
// Endpoint /api/admin/* jelas admin; /api/visitor-sessions & /api/event adalah
// endpoint analitik lama yang membocorkan IP pengunjung bila dibiarkan publik.
func isProtectedReadPath(path string) bool {
	return strings.HasPrefix(path, "/api/admin/") ||
		path == "/api/visitor-sessions" ||
		path == "/api/event"
}

// analyticsReadPaths = path yang boleh dibaca dengan ANALYTICS_API_KEY (key
// terbatas untuk dashboard analitik pihak lain). Hanya GET/HEAD, tidak ada
// path lain (review, audit-log, kelola admin, dsb) yang boleh diakses key ini.
var analyticsReadPaths = []string{
	"/api/admin/stats/visitor",
	"/api/admin/stats/social-clicks",
	"/api/admin/visitor-sessions",
}

// AdminAuth memeriksa X-Admin-Key header untuk request mutating dan untuk
// pembacaan (GET/HEAD) ke path admin/PII. OPTIONS (CORS preflight), GET/HEAD ke
// path publik, dan mutasi ke publicPOSTPrefixes selalu diizinkan.
func AdminAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		method := c.Request.Method
		path := c.Request.URL.Path

		// OPTIONS (CORS preflight) selalu diizinkan.
		if method == "OPTIONS" {
			c.Next()
			return
		}

		if method == "GET" || method == "HEAD" {
			// Pembacaan publik bebas; pembacaan data admin/PII wajib key.
			if !isProtectedReadPath(path) {
				c.Next()
				return
			}
		} else {
			// Method mutasi: path publik bebas, sisanya wajib key.
			for _, prefix := range publicPOSTPrefixes {
				if strings.HasPrefix(path, prefix) {
					c.Next()
					return
				}
			}
		}

		// ANALYTICS_API_KEY: key terbatas untuk dashboard analitik pihak lain.
		// Hanya lolos untuk GET/HEAD ke analyticsReadPaths; selain itu ditolak
		// meski key-nya valid, supaya key ini tidak bisa dipakai membaca atau
		// mengubah data admin lain.
		if analyticsKey := os.Getenv("ANALYTICS_API_KEY"); analyticsKey != "" {
			if c.GetHeader("X-Admin-Key") == analyticsKey {
				if method == "GET" || method == "HEAD" {
					for _, allowed := range analyticsReadPaths {
						if path == allowed {
							c.Next()
							return
						}
					}
				}
				c.JSON(http.StatusForbidden, gin.H{"error": "Key ini hanya untuk data analitik"})
				c.Abort()
				return
			}
		}

		expected := os.Getenv("ADMIN_API_KEY")
		if expected == "" {
			// Kunci belum dikonfigurasi — tolak semua mutasi (fail-closed) supaya
			// konfigurasi yang belum lengkap tidak membuka backend untuk publik.
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Server belum dikonfigurasi"})
			c.Abort()
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
