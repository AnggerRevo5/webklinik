package handlers

import (
	"log"
	"net/http"
	"os"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SeedInitialSuperadmin memindahkan akun admin lama (ADMIN_USERNAME/
// ADMIN_PASSWORD_HASH di .env — sama seperti dipakai jalur break-glass di
// Next.js) jadi superadmin pertama di database, HANYA kalau admin_users masih
// kosong sama sekali. ADMIN_PASSWORD sebagai fallback plaintext (di-hash di
// sini) untuk kasus ADMIN_PASSWORD_HASH belum pernah dibuat.
func SeedInitialSuperadmin(db *gorm.DB) {
	var count int64
	db.Model(&models.AdminUser{}).Count(&count)
	if count > 0 {
		return
	}

	username := os.Getenv("ADMIN_USERNAME")
	if username == "" {
		log.Println("[AdminAuth] ADMIN_USERNAME belum diatur, superadmin awal tidak dibuat — isi dulu lalu restart")
		return
	}

	passwordHash := os.Getenv("ADMIN_PASSWORD_HASH")
	if passwordHash == "" {
		plaintext := os.Getenv("ADMIN_PASSWORD")
		if plaintext == "" {
			log.Println("[AdminAuth] ADMIN_PASSWORD_HASH/ADMIN_PASSWORD belum diatur, superadmin awal tidak dibuat")
			return
		}
		hash, err := services.HashPassword(plaintext)
		if err != nil {
			log.Printf("[AdminAuth] Gagal hash ADMIN_PASSWORD: %v", err)
			return
		}
		passwordHash = hash
	}

	if err := db.Create(&models.AdminUser{
		Username:     username,
		PasswordHash: passwordHash,
		Role:         models.RoleSuperadmin,
		IsActive:     true,
	}).Error; err != nil {
		log.Printf("[AdminAuth] Gagal membuat superadmin awal: %v", err)
		return
	}
	log.Printf("[AdminAuth] Superadmin awal dibuat dari .env: %s", username)
}

// requireSuperadmin membaca header X-Admin-Role — di-set oleh proxy Next.js
// sendiri berdasarkan sesi yang sudah divalidasi (bukan dari input klien
// langsung, sama seperti X-Admin-Key yang sudah ada). Dipakai untuk endpoint
// yang cuma boleh diakses superadmin (audit log, kelola akun admin).
func requireSuperadmin(c *gin.Context) bool {
	if c.GetHeader("X-Admin-Role") != models.RoleSuperadmin {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "error": "Hanya superadmin yang bisa mengakses ini"})
		return false
	}
	return true
}

// POST /api/admin/session — login. Dipanggil langsung dari Next.js
// (server-to-server, bukan lewat proxy publik), sama seperti recordAuditLog.
func AdminSessionLoginHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			Username string `json:"username" binding:"required"`
			Password string `json:"password" binding:"required"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "username dan password wajib diisi"})
			return
		}

		token, role, err := services.AdminLogin(db, body.Username, body.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"success": true, "token": token, "role": role, "username": body.Username})
	}
}

// POST /api/admin/session/validate
func AdminSessionValidateHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			Token string `json:"token" binding:"required"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"valid": false})
			return
		}

		role, username, ok := services.ValidateAdminSession(db, body.Token)
		if !ok {
			c.JSON(http.StatusOK, gin.H{"valid": false})
			return
		}
		c.JSON(http.StatusOK, gin.H{"valid": true, "role": role, "username": username})
	}
}

// DELETE /api/admin/session — logout.
func AdminSessionLogoutHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body struct {
			Token string `json:"token"`
		}
		_ = c.ShouldBindJSON(&body)
		if body.Token != "" {
			services.LogoutAdminSession(db, body.Token)
		}
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

// GET /api/admin/admin-users — superadmin only.
func AdminListUsersHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !requireSuperadmin(c) {
			return
		}
		var users []models.AdminUser
		db.Order("created_at ASC").Find(&users)
		c.JSON(http.StatusOK, gin.H{"success": true, "data": users})
	}
}

// POST /api/admin/admin-users — superadmin only.
func AdminCreateUserHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !requireSuperadmin(c) {
			return
		}
		var body struct {
			Username string `json:"username" binding:"required,max=100"`
			Password string `json:"password" binding:"required,min=8"`
			Role     string `json:"role" binding:"required"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
			return
		}
		if body.Role != models.RoleSuperadmin && body.Role != models.RoleAdmin {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "role tidak valid"})
			return
		}

		hash, err := services.HashPassword(body.Password)
		if err != nil {
			respondInternal(c, err, "")
			return
		}

		user := models.AdminUser{
			Username:     body.Username,
			PasswordHash: hash,
			Role:         body.Role,
			IsActive:     true,
		}
		if err := db.Create(&user).Error; err != nil {
			c.JSON(http.StatusConflict, gin.H{"success": false, "error": "Username sudah dipakai"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"success": true, "data": user})
	}
}

// PUT /api/admin/admin-users/:id — superadmin only. Update role/is_active,
// dan password kalau diisi.
func AdminUpdateUserHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !requireSuperadmin(c) {
			return
		}
		id := c.Param("id")

		var body struct {
			Role     string `json:"role"`
			IsActive *bool  `json:"is_active"`
			Password string `json:"password"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
			return
		}

		var user models.AdminUser
		if err := db.First(&user, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Akun tidak ditemukan"})
			return
		}

		if user.Username == c.GetHeader("X-Admin-Username") {
			c.JSON(http.StatusConflict, gin.H{"success": false, "error": "Tidak bisa mengubah role/status akun sendiri"})
			return
		}

		// Cegah superadmin aktif terakhir didemosi/dinonaktifkan sendiri —
		// supaya tidak ada skenario tidak ada satupun superadmin tersisa.
		willDemote := body.Role != "" && body.Role != models.RoleSuperadmin && user.Role == models.RoleSuperadmin
		willDeactivate := body.IsActive != nil && !*body.IsActive && user.IsActive
		if willDemote || willDeactivate {
			var activeSuperadminCount int64
			db.Model(&models.AdminUser{}).
				Where("role = ? AND is_active = ? AND id != ?", models.RoleSuperadmin, true, user.ID).
				Count(&activeSuperadminCount)
			if activeSuperadminCount == 0 {
				c.JSON(http.StatusConflict, gin.H{"success": false, "error": "Tidak boleh menonaktifkan/menurunkan superadmin aktif terakhir"})
				return
			}
		}

		updates := map[string]interface{}{}
		if body.Role == models.RoleSuperadmin || body.Role == models.RoleAdmin {
			updates["role"] = body.Role
		}
		if body.IsActive != nil {
			updates["is_active"] = *body.IsActive
		}
		if body.Password != "" {
			hash, err := services.HashPassword(body.Password)
			if err != nil {
				respondInternal(c, err, "")
				return
			}
			updates["password_hash"] = hash
		}

		if len(updates) > 0 {
			db.Model(&user).Updates(updates)
		}
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}

// DELETE /api/admin/admin-users/:id — superadmin only.
func AdminDeleteUserHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !requireSuperadmin(c) {
			return
		}
		id := c.Param("id")

		var user models.AdminUser
		if err := db.First(&user, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Akun tidak ditemukan"})
			return
		}

		if user.Username == c.GetHeader("X-Admin-Username") {
			c.JSON(http.StatusConflict, gin.H{"success": false, "error": "Tidak bisa menghapus akun sendiri"})
			return
		}

		if user.Role == models.RoleSuperadmin {
			var activeSuperadminCount int64
			db.Model(&models.AdminUser{}).
				Where("role = ? AND is_active = ? AND id != ?", models.RoleSuperadmin, true, user.ID).
				Count(&activeSuperadminCount)
			if activeSuperadminCount == 0 {
				c.JSON(http.StatusConflict, gin.H{"success": false, "error": "Tidak boleh menghapus superadmin aktif terakhir"})
				return
			}
		}

		db.Delete(&user)
		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}
