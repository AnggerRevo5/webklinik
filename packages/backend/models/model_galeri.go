package models

type Galeri struct {
	ID       uint64 `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Kategori string `gorm:"column:kategori;index"              json:"kategori"`
	Text     string `gorm:"column:text"                        json:"text"`
	URL      string `gorm:"column:url"                         json:"url"`
}

func (Galeri) TableName() string { return "galeri" }
