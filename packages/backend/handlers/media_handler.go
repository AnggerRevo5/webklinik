package handlers

import (
	"net/http"
	"strconv"

	"backend/models"
	"backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GET /api/media  — list gambar dari media_library
func GetMediaHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		folder := c.Query("folder")
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "24"))
		if page < 1 {
			page = 1
		}
		if perPage < 1 || perPage > 100 {
			perPage = 24
		}
		offset := (page - 1) * perPage

		query := db.Model(&models.MediaLibrary{})
		if folder != "" && services.ValidFolders[folder] {
			query = query.Where("folder = ?", folder)
		}

		var total int64
		query.Count(&total)

		var media []models.MediaLibrary
		query.Order("uploaded_at DESC").Limit(perPage).Offset(offset).Find(&media)

		totalPages := int((total + int64(perPage) - 1) / int64(perPage))

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    media,
			"pagination": gin.H{
				"page":        page,
				"per_page":    perPage,
				"total":       total,
				"total_pages": totalPages,
			},
		})
	}
}

// POST /api/media/upload  — upload file ke Cloudinary lalu simpan URL ke media_library
func UploadMediaHandler(db *gorm.DB, cldSvc *services.CloudinaryService) gin.HandlerFunc {
	return func(c *gin.Context) {
		if cldSvc == nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"success": false,
				"error":   "Cloudinary tidak dikonfigurasi. Periksa CLOUDINARY_* di .env backend",
			})
			return
		}

		folder := c.PostForm("folder")
		if !services.ValidFolders[folder] {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Folder tidak valid. Pilih: dokter/layanan/promo/galeri/artikel/logo/staff",
			})
			return
		}

		fh, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "File tidak ditemukan di request"})
			return
		}

		if fh.Size > services.MaxFileSize {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Ukuran file maksimal 5MB"})
			return
		}

		mimeType := fh.Header.Get("Content-Type")
		if !services.ValidMimeTypes[mimeType] {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Format tidak didukung. Gunakan JPG, PNG, WebP, atau GIF",
			})
			return
		}

		file, err := fh.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Gagal membaca file"})
			return
		}
		defer file.Close()

		result, err := cldSvc.Upload(file, fh.Filename, mimeType, folder)
		if err != nil {
			respondInternal(c, err, "Gagal mengunggah gambar")
			return
		}

		media := models.MediaLibrary{
			URL:      result.URL,
			PublicID: result.PublicID,
			NamaFile: fh.Filename,
			Folder:   folder,
			Format:   result.Format,
			Ukuran:   result.Bytes,
			Lebar:    result.Width,
			Tinggi:   result.Height,
		}
		if err := db.Create(&media).Error; err != nil {
			// Rollback: hapus dari Cloudinary supaya tidak ada orphan file
			_ = cldSvc.Delete(result.PublicID)
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   "Upload berhasil tapi gagal simpan data. Coba lagi.",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Upload berhasil",
			"data":    media,
		})
	}
}

// POST /api/admin/media/sync-cloudinary  — tarik semua asset dari Cloudinary ke media_library
func SyncCloudinaryMediaHandler(db *gorm.DB, cldSvc *services.CloudinaryService) gin.HandlerFunc {
	return func(c *gin.Context) {
		if cldSvc == nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"success": false,
				"error":   "Cloudinary tidak dikonfigurasi. Periksa CLOUDINARY_* di .env backend",
			})
			return
		}

		result, err := cldSvc.SyncFromCloudinary(db)
		if err != nil {
			respondInternal(c, err, "Gagal sync media dari Cloudinary")
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success":     true,
			"total_found": result.TotalFound,
			"added":       result.Added,
			"skipped":     result.Skipped,
		})
	}
}

// DELETE /api/media/:id  — hapus dari Cloudinary + media_library
func DeleteMediaHandler(db *gorm.DB, cldSvc *services.CloudinaryService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var media models.MediaLibrary
		if err := db.First(&media, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Gambar tidak ditemukan"})
			return
		}

		if cldSvc != nil {
			_ = cldSvc.Delete(media.PublicID)
		}

		url := media.URL

		// Hapus record galeri yang memakai URL ini (galeri tanpa foto tidak berguna)
		db.Where("url = ?", url).Delete(&models.Galeri{})

		// Kosongkan URL di tabel lain — jangan hapus record-nya
		db.Model(&models.Promo{}).Where("url = ?", url).Update("url", "")
		db.Model(&models.DokterFoto{}).Where("foto_url = ?", url).Update("foto_url", "")
		db.Model(&models.Artikel{}).Where("foto_url = ?", url).Update("foto_url", "")
		db.Model(&models.Layanan{}).Where("url = ?", url).Update("url", "")
		db.Model(&models.Banner{}).Where("url = ?", url).Update("url", "")

		db.Delete(&media)

		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Gambar berhasil dihapus"})
	}
}
