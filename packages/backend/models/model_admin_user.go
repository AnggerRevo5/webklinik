package models

import "time"

// AdminUser adalah akun admin dengan hierarki role. Baris pertama dibuat
// otomatis oleh SeedInitialSuperadmin (main.go) dari ADMIN_USERNAME/
// ADMIN_PASSWORD_HASH — migrasi dari sistem 1-admin lama.
type AdminUser struct {
	ID           uint64    `gorm:"column:id;primaryKey"                json:"id"`
	Username     string    `gorm:"column:username;uniqueIndex;size:100" json:"username"`
	PasswordHash string    `gorm:"column:password_hash;size:255"        json:"-"`
	Role         string    `gorm:"column:role;size:20"                  json:"role"`
	IsActive     bool      `gorm:"column:is_active;default:1"           json:"is_active"`
	CreatedAt    time.Time `gorm:"column:created_at;autoCreateTime"     json:"created_at"`
	UpdatedAt    time.Time `gorm:"column:updated_at;autoUpdateTime"     json:"updated_at"`
}

func (AdminUser) TableName() string { return "admin_users" }

const (
	RoleSuperadmin = "superadmin"
	RoleAdmin      = "admin"
)

// AdminSession menyimpan sesi login yang tervalidasi ke AdminUser — beda dari
// sesi "break-glass" (yang sepenuhnya di sisi Next.js, tidak pernah menyentuh
// tabel ini) supaya sesi hierarki tetap hidup lintas restart Next.js.
// TokenHash adalah SHA-256 dari token asli — token mentah tidak pernah
// disimpan, sama seperti prinsip password hashing.
type AdminSession struct {
	ID          uint64    `gorm:"column:id;primaryKey"              json:"id"`
	TokenHash   string    `gorm:"column:token_hash;uniqueIndex;size:64" json:"-"`
	AdminUserID uint64    `gorm:"column:admin_user_id;index"        json:"admin_user_id"`
	ExpiresAt   time.Time `gorm:"column:expires_at;index"           json:"expires_at"`
	CreatedAt   time.Time `gorm:"column:created_at;autoCreateTime"  json:"created_at"`
}

func (AdminSession) TableName() string { return "admin_sessions" }
