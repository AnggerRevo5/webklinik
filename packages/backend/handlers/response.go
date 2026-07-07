package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// respondInternal mencatat detail error ke log server (untuk diagnosis) dan
// mengembalikan pesan generik ke klien. Tujuannya agar detail DB/internal tidak
// bocor ke response publik. publicMsg opsional; kosongkan untuk pesan default.
func respondInternal(c *gin.Context, err error, publicMsg string) {
	log.Printf("[ERROR] %s %s: %v", c.Request.Method, c.Request.URL.Path, err)
	if publicMsg == "" {
		publicMsg = "Terjadi kesalahan di server. Coba lagi nanti."
	}
	c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": publicMsg})
}
