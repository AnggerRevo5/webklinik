package middleware

import (
	"backend/models"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// AuditLog mencatat setiap mutasi (POST/PUT/PATCH/DELETE) yang lolos AdminAuth
// ke tabel audit_logs, supaya aktivitas admin bisa ditelusuri bila suatu saat
// terjadi penyalahgunaan. HARUS dipasang setelah AdminAuth di rantai middleware
// — request yang ditolak AdminAuth tidak pernah sampai ke sini.
func AuditLog(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		method := c.Request.Method
		if method == "OPTIONS" || method == "GET" || method == "HEAD" {
			return
		}
		path := c.Request.URL.Path
		// Mutasi publik (pendaftaran, tracking, kontak) bukan aktivitas admin.
		// Endpoint audit-log sendiri juga dilewati supaya tidak dobel-catat.
		if isPublicMutationPath(path) || path == "/api/admin/audit-log" {
			return
		}

		ip := c.GetHeader("CF-Connecting-IP")
		if ip == "" {
			ip = c.ClientIP()
		}

		db.Create(&models.AuditLog{
			Actor:     "admin",
			Action:    "admin_mutation",
			Method:    method,
			Path:      path,
			IPAddress: ip,
			UserAgent: c.GetHeader("User-Agent"),
			Detail:    fmt.Sprintf("status=%d", c.Writer.Status()),
			CreatedAt: time.Now(),
		})
	}
}

func isPublicMutationPath(path string) bool {
	for _, prefix := range publicPOSTPrefixes {
		if len(path) >= len(prefix) && path[:len(prefix)] == prefix {
			return true
		}
	}
	return false
}
