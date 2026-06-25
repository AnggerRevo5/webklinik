package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type bucket struct {
	count   int
	resetAt time.Time
}

// RateLimiter membatasi jumlah request per IP dalam window waktu tertentu.
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

func (rl *RateLimiter) allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	b, ok := rl.clients[ip]
	if !ok || now.After(b.resetAt) {
		rl.clients[ip] = &bucket{count: 1, resetAt: now.Add(rl.window)}
		return true
	}
	if b.count >= rl.limit {
		return false
	}
	b.count++
	return true
}

func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !rl.allow(c.ClientIP()) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Terlalu banyak request. Coba lagi dalam beberapa saat.",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
