package models

type Banner struct {
	ID  uint64 `gorm:"column:id" json:"id"`
	URL string `gorm:"column:url" json:"url"`
}

func (Banner) TableName() string { return "banner" }
