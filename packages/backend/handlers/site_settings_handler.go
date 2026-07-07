package handlers

import (
	"net/http"

	"backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// defaultSiteSettings — nilai awal yang disamakan dengan konten hardcoded lama.
// Di-seed sekali bila key belum ada, sehingga admin tinggal mengubah.
var defaultSiteSettings = []models.SiteSetting{
	{SettingKey: "telepon", SettingGroup: "kontak", IsActive: true,
		SettingValue: "0812-2556-6055"},
	{SettingKey: "whatsapp", SettingGroup: "kontak", IsActive: true,
		SettingValue: "6281225566055"},
	{SettingKey: "instagram", SettingGroup: "kontak", IsActive: true,
		SettingValue: "https://www.instagram.com/ampelgadingmedicalcentre"},
	{SettingKey: "facebook", SettingGroup: "kontak", IsActive: true,
		SettingValue: "https://www.facebook.com/share/1JwVSouKaH/?mibextid=wwXIfr"},
	{SettingKey: "tiktok", SettingGroup: "kontak", IsActive: true,
		SettingValue: "https://www.tiktok.com/@ampelgadingmedicalcentre"},
	{SettingKey: "email", SettingGroup: "kontak", IsActive: true,
		SettingValue: "ampelgadingmedicalcentre@gmail.com"},
	{SettingKey: "hero_subtitle", SettingGroup: "beranda", IsActive: true,
		SettingValue: "Pelayanan kesehatan terpadu untuk masyarakat Ampelgading dan sekitarnya. UGD 24 jam, rawat inap, persalinan, laboratorium, dan apotek. Menerima BPJS dan pasien umum."},
	{SettingKey: "about_text", SettingGroup: "tentang", IsActive: true,
		SettingValue: "KRI Ampelgading Medical Centre adalah klinik rawat inap yang berlokasi di Desa Tirtomarto, Kec. Ampelgading, Kab. Malang. Didukung tenaga medis profesional, kami melayani UGD 24 jam, rawat inap, rawat jalan, persalinan, dan laboratorium"},
	{SettingKey: "visi", SettingGroup: "tentang", IsActive: true,
		SettingValue: "Terwujudnya Klinik Rawat Inap Ampelgading Medical Centre yang Berkualitas, Profesional, dan Terpercaya dalam Pelayanan Kesehatan di Kecamatan Ampelgading dan Sekitarnya."},
	{SettingKey: "misi", SettingGroup: "tentang", IsActive: true,
		SettingValue: "Memberikan pelayanan bermutu dengan mengutamakan keselamatan pasien dan program 7S. Memanfaatkan teknologi, meningkatkan fasilitas dan kompetensi karyawan, serta membangun kemitraan dengan pihak profesional medis dan masyarakat."},
	{SettingKey: "timeline", SettingGroup: "tentang", IsActive: true,
		SettingValue: `[{"year":"2011","title":"Awal mula","description":"praktik mandiri dr. Nikma Fitriasari, MMRS"},{"year":"2021","title":"Klinik rawat inap","description":"Resmi menjadi KRI Ampelgading Medical Centre dan beroperasi 24 jam dengan izin klinik pratama"},{"year":"2023","title":"Menerima BPJS","description":"Melayani pasien BPJS Kesehatan & umum"},{"year":"2026","title":"Terus berkembang","description":"Layanan SIAP DOK, homevisit, rating 4.8"}]`},
}

// SeedSiteSettings menambahkan default hanya untuk key yang belum ada.
func SeedSiteSettings(db *gorm.DB) {
	for _, s := range defaultSiteSettings {
		var existing models.SiteSetting
		if db.Where("setting_key = ?", s.SettingKey).First(&existing).Error != nil {
			db.Create(&s)
		}
	}
}

// GET /api/site-settings — publik, daftar setting aktif.
func GetSiteSettingsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var settings []models.SiteSetting
		db.Where("is_active = ?", true).Find(&settings)
		c.JSON(http.StatusOK, settings)
	}
}

// GET /api/admin/site-settings — semua setting (termasuk non-aktif).
func AdminGetSiteSettingsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var settings []models.SiteSetting
		db.Order("setting_group ASC, id ASC").Find(&settings)
		c.JSON(http.StatusOK, gin.H{"success": true, "data": settings})
	}
}

// PUT /api/admin/site-settings — upsert massal.
// Body: [{ "setting_key": "...", "setting_value": "...", "setting_group": "..." }]
func AdminUpdateSiteSettingsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body []struct {
			SettingKey   string `json:"setting_key" binding:"required"`
			SettingValue string `json:"setting_value"`
			SettingGroup string `json:"setting_group"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
			return
		}

		for _, item := range body {
			var existing models.SiteSetting
			if db.Where("setting_key = ?", item.SettingKey).First(&existing).Error == nil {
				db.Model(&existing).Update("setting_value", item.SettingValue)
			} else {
				group := item.SettingGroup
				if group == "" {
					group = "umum"
				}
				db.Create(&models.SiteSetting{
					SettingKey:   item.SettingKey,
					SettingValue: item.SettingValue,
					SettingGroup: group,
					IsActive:     true,
				})
			}
		}

		c.JSON(http.StatusOK, gin.H{"success": true})
	}
}
