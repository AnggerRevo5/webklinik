package services

import (
	"context"
	"fmt"
	"mime/multipart"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	cloudinary "github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
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
