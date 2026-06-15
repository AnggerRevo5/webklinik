package handlers

import (
	"backend/models"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ── PUBLIC ────────────────────────────────────────────────────────────────────

// GET /api/artikel  — list artikel published, tanpa konten (hemat bandwidth)
func GetArtikelPublicHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var artikelList []models.Artikel
		query := db.Select(
			"id, judul, slug, ringkasan, kategori, foto_url, penulis, status, published_at, urutan, created_at, updated_at",
		).Where("status = ?", "published")

		if limitStr := c.Query("limit"); limitStr != "" {
			if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 && limit <= 50 {
				query = query.Limit(limit)
			}
		}

		if kategori := c.Query("kategori"); kategori != "" && kategori != "Semua" {
			query = query.Where("kategori = ?", kategori)
		}

		query.Order("published_at DESC, created_at DESC").Find(&artikelList)

		if artikelList == nil {
			artikelList = []models.Artikel{}
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": artikelList})
	}
}

// GET /api/artikel/:slug  — detail lengkap termasuk konten
func GetArtikelBySlugHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		slug := c.Param("slug")
		var artikel models.Artikel
		if err := db.Where("slug = ? AND status = ?", slug, "published").First(&artikel).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Artikel tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": artikel})
	}
}

// ── ADMIN ─────────────────────────────────────────────────────────────────────

// GET /api/admin/artikel  — list semua artikel (draft + published)
func AdminGetArtikelHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "20"))
		if page < 1 {
			page = 1
		}
		if perPage < 1 || perPage > 100 {
			perPage = 20
		}
		offset := (page - 1) * perPage

		query := db.Model(&models.Artikel{}).Select(
			"id, judul, slug, ringkasan, kategori, foto_url, penulis, status, published_at, urutan, created_at, updated_at",
		)
		if status := c.Query("status"); status == "draft" || status == "published" {
			query = query.Where("status = ?", status)
		}

		var total int64
		query.Count(&total)

		var artikelList []models.Artikel
		query.Order("created_at DESC").Limit(perPage).Offset(offset).Find(&artikelList)

		if artikelList == nil {
			artikelList = []models.Artikel{}
		}
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    artikelList,
			"pagination": gin.H{
				"page":        page,
				"per_page":    perPage,
				"total":       total,
				"total_pages": (total + int64(perPage) - 1) / int64(perPage),
			},
		})
	}
}

// GET /api/admin/artikel/:id  — detail lengkap termasuk konten (untuk editor)
func AdminGetArtikelDetailHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var artikel models.Artikel
		if err := db.First(&artikel, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Artikel tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "data": artikel})
	}
}

// POST /api/admin/artikel  — buat artikel baru
func AdminCreateArtikelHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		type Body struct {
			Judul     string `json:"judul"     binding:"required"`
			Konten    string `json:"konten"`
			Ringkasan string `json:"ringkasan"`
			Kategori  string `json:"kategori"`
			FotoURL   string `json:"foto_url"`
			Penulis   string `json:"penulis"`
			Status    string `json:"status"`
		}
		var body Body
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
			return
		}

		slug := ensureUniqueArtikelSlug(db, generateArtikelSlug(body.Judul), 0)
		ringkasan := body.Ringkasan
		if ringkasan == "" && body.Konten != "" {
			ringkasan = generateArtikelRingkasan(body.Konten, 200)
		}

		status := "draft"
		if body.Status == "published" {
			status = "published"
		}
		var publishedAt *time.Time
		if status == "published" {
			now := time.Now()
			publishedAt = &now
		}

		artikel := models.Artikel{
			Judul:       body.Judul,
			Slug:        slug,
			Konten:      body.Konten,
			Ringkasan:   ringkasan,
			Kategori:    body.Kategori,
			FotoURL:     body.FotoURL,
			Penulis:     body.Penulis,
			Status:      status,
			PublishedAt: publishedAt,
		}
		if err := db.Create(&artikel).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal menyimpan artikel"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Artikel berhasil disimpan", "data": artikel})
	}
}

// PUT /api/admin/artikel/:id  — update artikel
func AdminUpdateArtikelHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var artikel models.Artikel
		if err := db.First(&artikel, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Artikel tidak ditemukan"})
			return
		}

		type Body struct {
			Judul     string `json:"judul"`
			Konten    string `json:"konten"`
			Ringkasan string `json:"ringkasan"`
			Kategori  string `json:"kategori"`
			FotoURL   string `json:"foto_url"`
			Penulis   string `json:"penulis"`
			Status    string `json:"status"`
		}
		var body Body
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
			return
		}

		if body.Judul != "" && body.Judul != artikel.Judul {
			newSlug := generateArtikelSlug(body.Judul)
			if newSlug != artikel.Slug {
				idUint, _ := strconv.ParseUint(id, 10, 64)
				artikel.Slug = ensureUniqueArtikelSlug(db, newSlug, uint(idUint))
			}
			artikel.Judul = body.Judul
		}
		if body.Konten != "" {
			artikel.Konten = body.Konten
		}
		if body.Ringkasan != "" {
			artikel.Ringkasan = body.Ringkasan
		} else if body.Konten != "" && artikel.Ringkasan == "" {
			artikel.Ringkasan = generateArtikelRingkasan(body.Konten, 200)
		}
		if body.Kategori != "" {
			artikel.Kategori = body.Kategori
		}
		artikel.FotoURL = body.FotoURL
		if body.Penulis != "" {
			artikel.Penulis = body.Penulis
		}

		// Handle status change
		if body.Status == "published" && artikel.Status != "published" {
			artikel.Status = "published"
			now := time.Now()
			artikel.PublishedAt = &now
		} else if body.Status == "draft" {
			artikel.Status = "draft"
			artikel.PublishedAt = nil
		}

		if err := db.Save(&artikel).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal menyimpan"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Artikel berhasil diupdate", "data": artikel})
	}
}

// PATCH /api/admin/artikel/:id/publish
func AdminPublishArtikelHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		now := time.Now()
		if err := db.Model(&models.Artikel{}).Where("id = ?", id).Updates(map[string]interface{}{
			"status":       "published",
			"published_at": now,
		}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Artikel dipublish"})
	}
}

// PATCH /api/admin/artikel/:id/draft
func AdminDraftArtikelHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if err := db.Model(&models.Artikel{}).Where("id = ?", id).Updates(map[string]interface{}{
			"status":       "draft",
			"published_at": nil,
		}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Artikel ditarik ke draft"})
	}
}

// DELETE /api/admin/artikel/:id
func AdminDeleteArtikelHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		if err := db.Delete(&models.Artikel{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Artikel dihapus"})
	}
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

func generateArtikelSlug(judul string) string {
	slug := strings.ToLower(judul)
	var b strings.Builder
	for _, r := range slug {
		if unicode.IsLetter(r) || unicode.IsDigit(r) || r == ' ' || r == '-' {
			b.WriteRune(r)
		}
	}
	slug = b.String()
	slug = strings.ReplaceAll(slug, " ", "-")
	re := regexp.MustCompile(`-+`)
	slug = re.ReplaceAllString(slug, "-")
	slug = strings.Trim(slug, "-")
	if len(slug) > 200 {
		slug = slug[:200]
	}
	if slug == "" {
		slug = "artikel"
	}
	return slug
}

// ensureUniqueArtikelSlug — cek keunikan, kecualikan artikel dengan id tertentu (untuk update)
func ensureUniqueArtikelSlug(db *gorm.DB, slug string, excludeID uint) string {
	original := slug
	counter := 1
	for {
		var count int64
		q := db.Model(&models.Artikel{}).Where("slug = ?", slug)
		if excludeID > 0 {
			q = q.Where("id != ?", excludeID)
		}
		q.Count(&count)
		if count == 0 {
			break
		}
		slug = original + "-" + strconv.Itoa(counter)
		counter++
	}
	return slug
}

func generateArtikelRingkasan(htmlKonten string, maxLen int) string {
	re := regexp.MustCompile(`<[^>]*>`)
	text := re.ReplaceAllString(htmlKonten, "")
	text = strings.ReplaceAll(text, "&amp;", "&")
	text = strings.ReplaceAll(text, "&lt;", "<")
	text = strings.ReplaceAll(text, "&gt;", ">")
	text = strings.ReplaceAll(text, "&nbsp;", " ")
	re2 := regexp.MustCompile(`\s+`)
	text = re2.ReplaceAllString(text, " ")
	text = strings.TrimSpace(text)
	if len(text) <= maxLen {
		return text
	}
	lastSpace := strings.LastIndex(text[:maxLen], " ")
	if lastSpace == -1 {
		lastSpace = maxLen
	}
	return text[:lastSpace] + "..."
}
