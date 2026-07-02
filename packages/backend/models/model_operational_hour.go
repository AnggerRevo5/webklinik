package models

import "time"

// OperationalHour menyimpan jam operasional klinik per baris (mis. per hari atau
// rentang hari), ditampilkan di section "Jam Operasional" pada halaman beranda.
type OperationalHour struct {
	ID        uint64    `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	DayLabel  string    `gorm:"column:day_label"                   json:"day_label"`
	OpenTime  *string   `gorm:"column:open_time"                   json:"open_time"`
	CloseTime *string   `gorm:"column:close_time"                  json:"close_time"`
	Is24Hours bool      `gorm:"column:is_24_hours;default:0"        json:"is_24_hours"`
	Note      string    `gorm:"column:note"                        json:"note"`
	SortOrder int       `gorm:"column:sort_order;default:0;index"  json:"sort_order"`
	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime"   json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at;autoUpdateTime"   json:"updated_at"`
}

func (OperationalHour) TableName() string { return "operational_hours" }
