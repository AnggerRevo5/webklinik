package models

type Layanan struct {
	ID          uint64 `gorm:"column:id" json:"id"`
	URL         string `gorm:"column:url" json:"url"`
	NamaLayanan string `gorm:"column:nama_layanan" json:"nama_layanan"`
}

func (Layanan) TableName() string { return "layanan" }
