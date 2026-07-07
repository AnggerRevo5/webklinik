package services

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"time"

	"backend/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

const sessionTTL = 7 * 24 * time.Hour

// hashToken menghasilkan SHA-256 hex dari token mentah — dipakai sebagai kunci
// pencarian di admin_sessions. Token asli tidak pernah disimpan, sama seperti
// prinsip password hashing (kalau tabel bocor, token tidak langsung bisa dipakai).
func hashToken(token string) string {
	sum := sha256.Sum256([]byte(token))
	return hex.EncodeToString(sum[:])
}

// generateToken membuat token acak 32 byte, diberi prefix "db_" supaya
// Next.js bisa membedakan sesi hierarki (divalidasi ke backend ini) dari
// sesi break-glass (murni di sisi Next.js, prefix "bg_", tidak pernah
// menyentuh tabel ini sama sekali).
func generateToken() (string, error) {
	buf := make([]byte, 32)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return "db_" + hex.EncodeToString(buf), nil
}

// AdminLogin memverifikasi username/password terhadap admin_users, lalu
// membuat baris admin_sessions baru. Dipanggil langsung dari Next.js
// (server-to-server, sama seperti recordAuditLog) — bukan lewat proxy publik.
func AdminLogin(db *gorm.DB, username, password string) (token string, role string, err error) {
	var user models.AdminUser
	if err := db.Where("username = ? AND is_active = ?", username, true).First(&user).Error; err != nil {
		return "", "", errors.New("username atau password salah")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", "", errors.New("username atau password salah")
	}

	token, err = generateToken()
	if err != nil {
		return "", "", err
	}

	session := models.AdminSession{
		TokenHash:   hashToken(token),
		AdminUserID: user.ID,
		ExpiresAt:   time.Now().Add(sessionTTL),
	}
	if err := db.Create(&session).Error; err != nil {
		return "", "", err
	}

	return token, user.Role, nil
}

// ValidateAdminSession mengecek token terhadap admin_sessions, dan membaca
// ulang is_active/role dari admin_users setiap kali (bukan dari cache) —
// supaya begitu superadmin menonaktifkan/mendemosi seorang admin, itu
// langsung berlaku di request berikutnya, bukan menunggu token expired.
func ValidateAdminSession(db *gorm.DB, token string) (role string, username string, ok bool) {
	var session models.AdminSession
	if err := db.Where("token_hash = ? AND expires_at > ?", hashToken(token), time.Now()).First(&session).Error; err != nil {
		return "", "", false
	}

	var user models.AdminUser
	if err := db.Where("id = ? AND is_active = ?", session.AdminUserID, true).First(&user).Error; err != nil {
		return "", "", false
	}

	// Sliding expiry — perpanjang masa berlaku selama masih dipakai aktif.
	db.Model(&session).Update("expires_at", time.Now().Add(sessionTTL))

	return user.Role, user.Username, true
}

// LogoutAdminSession menghapus sesi (invalidate di server, bukan cuma hapus cookie).
func LogoutAdminSession(db *gorm.DB, token string) {
	db.Where("token_hash = ?", hashToken(token)).Delete(&models.AdminSession{})
}

// HashPassword membungkus bcrypt untuk dipakai saat membuat/mengubah admin_users.
func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hash), err
}
