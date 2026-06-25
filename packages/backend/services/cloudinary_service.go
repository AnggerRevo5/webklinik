package services

import (
	"context"
	"errors"
	"fmt"
	"mime/multipart"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"backend/models"

	cloudinary "github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/cloudinary/cloudinary-go/v2/api/admin"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"gorm.io/gorm"
)

type CloudinaryService struct {
	cld *cloudinary.Cloudinary
}

type UploadResult struct {
	URL      string
	PublicID string
	Format   string
	Width    int
	Height   int
	Bytes    int
}

var ValidFolders = map[string]bool{
	"dokter":  true,
	"layanan": true,
	"promo":   true,
	"galeri":  true,
	"artikel": true,
	"logo":    true,
	"staff":   true,
}

var ValidMimeTypes = map[string]bool{
	"image/jpeg": true,
	"image/png":  true,
	"image/webp": true,
	"image/gif":  true,
}

const MaxFileSize int64 = 5 * 1024 * 1024 // 5MB

func NewCloudinaryService(cloudName, apiKey, apiSecret string) (*CloudinaryService, error) {
	if cloudName == "" || apiKey == "" || apiSecret == "" {
		return nil, fmt.Errorf("CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, atau CLOUDINARY_API_SECRET belum diisi di .env")
	}
	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return nil, fmt.Errorf("gagal init Cloudinary: %w", err)
	}
	return &CloudinaryService{cld: cld}, nil
}

func (s *CloudinaryService) Upload(file multipart.File, namaFile, mimeType, folder string) (*UploadResult, error) {
	if !ValidFolders[folder] {
		return nil, fmt.Errorf("folder tidak valid: %s", folder)
	}
	if !ValidMimeTypes[mimeType] {
		return nil, fmt.Errorf("format file tidak didukung: %s", mimeType)
	}

	ctx := context.Background()

	base := strings.TrimSuffix(namaFile, filepath.Ext(namaFile))
	publicID := fmt.Sprintf("%s-%d", sanitizeFileName(base), time.Now().Unix())

	resp, err := s.cld.Upload.Upload(ctx, file, uploader.UploadParams{
		PublicID:     publicID,
		Folder:       folder,
		Overwrite:    boolPtr(false),
		ResourceType: "image",
	})
	if err != nil {
		return nil, fmt.Errorf("gagal upload ke Cloudinary: %w", err)
	}

	return &UploadResult{
		URL:      resp.SecureURL,
		PublicID: resp.PublicID,
		Format:   resp.Format,
		Width:    resp.Width,
		Height:   resp.Height,
		Bytes:    resp.Bytes,
	}, nil
}

func (s *CloudinaryService) Delete(publicID string) error {
	ctx := context.Background()
	result, err := s.cld.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID:     publicID,
		ResourceType: "image",
	})
	if err != nil {
		return fmt.Errorf("gagal hapus dari Cloudinary: %w", err)
	}
	if result.Result != "ok" {
		return fmt.Errorf("Cloudinary response: %s", result.Result)
	}
	return nil
}

var reUnsafe = regexp.MustCompile(`[^a-z0-9\-_]`)

func sanitizeFileName(name string) string {
	name = strings.ToLower(strings.TrimSpace(name))
	name = strings.ReplaceAll(name, " ", "-")
	name = reUnsafe.ReplaceAllString(name, "")
	if len(name) > 50 {
		name = name[:50]
	}
	if name == "" {
		return "image"
	}
	return name
}

func boolPtr(b bool) *bool { return &b }

// SyncResult adalah ringkasan hasil SyncFromCloudinary.
type SyncResult struct {
	TotalFound int
	Added      int
	Skipped    int
}

// SyncFromCloudinary menarik semua image asset dari Cloudinary dan mendaftarkannya
// ke tabel media_library. Idempotent — record yang public_id-nya sudah ada di DB dilewati.
func (s *CloudinaryService) SyncFromCloudinary(db *gorm.DB) (*SyncResult, error) {
	ctx := context.Background()
	result := &SyncResult{}

	var nextCursor string
	for {
		params := admin.AssetsParams{
			AssetType:  api.Image,
			MaxResults: 500,
			NextCursor: nextCursor,
		}

		resp, err := s.cld.Admin.Assets(ctx, params)
		if err != nil {
			return nil, fmt.Errorf("gagal fetch assets dari Cloudinary: %w", err)
		}

		for _, asset := range resp.Assets {
			result.TotalFound++

			var existing models.MediaLibrary
			dbErr := db.Where("public_id = ?", asset.PublicID).First(&existing).Error
			if dbErr == nil {
				result.Skipped++
				continue
			}
			if !errors.Is(dbErr, gorm.ErrRecordNotFound) {
				return nil, fmt.Errorf("gagal cek database: %w", dbErr)
			}

			// Ambil nama folder: pakai AssetFolder, fallback ke prefix public_id
			folder := asset.AssetFolder
			if folder == "" {
				if idx := strings.LastIndex(asset.PublicID, "/"); idx != -1 {
					folder = asset.PublicID[:idx]
				}
			}

			// Nama file = bagian setelah "/" terakhir di public_id
			namaFile := asset.PublicID
			if idx := strings.LastIndex(asset.PublicID, "/"); idx != -1 {
				namaFile = asset.PublicID[idx+1:]
			}

			media := models.MediaLibrary{
				URL:      asset.SecureURL,
				PublicID: asset.PublicID,
				NamaFile: namaFile,
				Folder:   folder,
				Format:   asset.Format,
				Ukuran:   asset.Bytes,
				Lebar:    asset.Width,
				Tinggi:   asset.Height,
			}
			if err := db.Create(&media).Error; err != nil {
				// Duplikat akibat race condition — lewati saja
				result.Skipped++
				continue
			}
			result.Added++
		}

		if resp.NextCursor == "" {
			break
		}
		nextCursor = resp.NextCursor
	}

	return result, nil
}
