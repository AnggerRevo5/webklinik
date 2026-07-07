package models

import "time"

// AuditLog mencatat aktivitas admin (login, logout, dan mutasi data) untuk
// keperluan penelusuran bila terjadi penyalahgunaan — bukan untuk debugging.
type AuditLog struct {
	ID        uint64    `gorm:"column:id;primaryKey" json:"id"`
	Actor     string    `gorm:"column:actor;size:100" json:"actor"`
	Action    string    `gorm:"column:action;size:100;index" json:"action"`
	Method    string    `gorm:"column:method;size:10" json:"method,omitempty"`
	Path      string    `gorm:"column:path;size:255" json:"path,omitempty"`
	IPAddress string    `gorm:"column:ip_address;size:45" json:"ip_address"`
	// Kota/Negara hasil enrichment IP (BUKAN GPS) — hanya diisi untuk event
	// login_success/login_failed, dipakai mendeteksi login dari lokasi tak
	// biasa. Lihat middleware.AdminAuth & handlers.RecordAuditLogHandler.
	Kota      string    `gorm:"column:kota;size:100" json:"kota,omitempty"`
	Negara    string    `gorm:"column:negara;size:10" json:"negara,omitempty"`
	UserAgent string    `gorm:"column:user_agent;type:text" json:"user_agent,omitempty"`
	Detail    string    `gorm:"column:detail;type:text" json:"detail,omitempty"`
	CreatedAt time.Time `gorm:"column:created_at;index" json:"created_at"`
}

func (AuditLog) TableName() string { return "audit_logs" }
