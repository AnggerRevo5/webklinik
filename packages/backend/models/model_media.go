package models

import "time"

type MediaLibrary struct {
	ID         uint      `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	URL        string    `gorm:"column:url;not null"               json:"url"`
	PublicID   string    `gorm:"column:public_id;not null;unique"  json:"public_id"`
	NamaFile   string    `gorm:"column:nama_file"                  json:"nama_file"`
	Folder     string    `gorm:"column:folder"                     json:"folder"`
	Format     string    `gorm:"column:format"                     json:"format"`
	Ukuran     int       `gorm:"column:ukuran"                     json:"ukuran"`
	Lebar      int       `gorm:"column:lebar"                      json:"lebar"`
	Tinggi     int       `gorm:"column:tinggi"                     json:"tinggi"`
	UploadedAt time.Time `gorm:"column:uploaded_at;autoCreateTime" json:"uploaded_at"`
}

func (MediaLibrary) TableName() string { return "media_library" }
