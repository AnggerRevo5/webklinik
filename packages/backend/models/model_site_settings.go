package models

// SiteSetting menyimpan konten situs yang bisa diedit admin secara key-value.
// Mis. nomor telepon, subjudul hero, teks Tentang Kami, visi/misi, timeline (JSON).
type SiteSetting struct {
	ID           uint   `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	SettingKey   string `gorm:"column:setting_key;size:100;uniqueIndex" json:"setting_key"`
	SettingValue string `gorm:"column:setting_value;type:text" json:"setting_value"`
	SettingGroup string `gorm:"column:setting_group;size:50;default:umum" json:"setting_group"`
	IsActive     bool   `gorm:"column:is_active;default:1" json:"is_active"`
}

func (SiteSetting) TableName() string { return "site_settings" }
