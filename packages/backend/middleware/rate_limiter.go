package middleware

import (
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type bucket struct {
	count   int
	resetAt time.Time
}

// RateLimiter membatasi jumlah request per IP dalam window waktu tertentu.
// Penyimpanan in-memory: tepat untuk deployment 1 instance. Konsekuensinya
// hitungan hilang saat proses restart dan tidak dibagi antar-instance — bila
// suatu saat scale-out, ganti backing store ke Redis/terpusat.
type RateLimiter struct {
	mu      sync.Mutex
	clients map[string]*bucket
	limit   int
	window  time.Duration
}

func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		clients: make(map[string]*bucket),
		limit:   limit,
		window:  window,
	}
	go rl.cleanup()
	return rl
}

// cleanup menghapus entry yang sudah kadaluarsa dari memory.
func (rl *RateLimiter) cleanup() {
	for {
		time.Sleep(rl.window * 3)
		rl.mu.Lock()
		now := time.Now()
		for ip, b := range rl.clients {
			if now.After(b.resetAt) {
				delete(rl.clients, ip)
			}
		}
		rl.mu.Unlock()
	}
}

// allow menandai satu request dari ip. Bila ditolak, retryAfter berisi sisa
// waktu hingga window direset (untuk header Retry-After).
func (rl *RateLimiter) allow(ip string) (ok bool, retryAfter time.Duration) {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	b, exists := rl.clients[ip]
	if !exists || now.After(b.resetAt) {
		rl.clients[ip] = &bucket{count: 1, resetAt: now.Add(rl.window)}
		return true, 0
	}
	if b.count >= rl.limit {
		return false, time.Until(b.resetAt)
	}
	b.count++
	return true, 0
}

// AllowKey menjalankan pembatasan yang sama seperti Middleware() tapi untuk
// kunci arbitrer (mis. hash NIK), dipakai saat pembatasan bukan berbasis IP.
func (rl *RateLimiter) AllowKey(key string) (ok bool, retryAfter time.Duration) {
	return rl.allow(key)
}

func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		allowed, retryAfter := rl.allow(c.ClientIP())
		if !allowed {
			// Retry-After (detik, minimal 1) supaya klien tahu kapan boleh coba lagi.
			sec := int(retryAfter.Seconds())
			if sec < 1 {
				sec = 1
			}
			c.Header("Retry-After", strconv.Itoa(sec))
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Terlalu banyak request. Coba lagi dalam beberapa saat.",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
