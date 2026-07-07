package main

import (
	"log"
	"os"

	database "backend/Database"
	"backend/handlers"
	"backend/models"
	"backend/routes"
	"backend/services"

	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
)

func main() {
	_ = godotenv.Load()

	db, err := database.Connect()
	if err != nil {
		log.Fatal("gagal konek nih ke database awowkwkwk:", err)
	}
	db.AutoMigrate(
		&models.Promo{},
		&models.Galeri{},
		&models.DokterFoto{},
		&models.MediaLibrary{},
		&models.Review{},
		&models.KlinikInfo{},
		&models.Artikel{},
		&models.SocialIconClick{},
		&models.SiteSetting{},
		&models.Staff{},
		&models.OperationalHour{},
		&models.VisitorSession{},
		&models.PageView{},
		&models.AuditLog{},
		&models.GoogleBusinessCache{},
		&models.GoogleReviewCache{},
		&models.GoogleAPIHitLog{},
		&models.InstagramCache{},
		&models.InstagramAPIHitLog{},
		&models.TiktokCache{},
		&models.TiktokAPIHitLog{},
		&models.FacebookCache{},
		&models.FacebookAPIHitLog{},
		&models.AdminUser{},
		&models.AdminSession{},
	)
	handlers.SeedSiteSettings(db)
	handlers.SeedInitialSuperadmin(db)

	dbKhanza := database.ConnectKhanza()
	if dbKhanza == nil {
		log.Println("Khanza DB tidak terhubung, fitur pendaftaran online Khanza dinonaktifkan")
	}

	cldSvc, cldErr := services.NewCloudinaryService(
		os.Getenv("CLOUDINARY_CLOUD_NAME"),
		os.Getenv("CLOUDINARY_API_KEY"),
		os.Getenv("CLOUDINARY_API_SECRET"),
	)
	if cldErr != nil {
		log.Printf("WARNING: Cloudinary tidak aktif: %v", cldErr)
		cldSvc = nil
	}

	// Google Business: bootstrap cache kosong saat start (non-blocking — tidak
	// boleh menunda/menggagalkan startup server bila RapidAPI sedang down),
	// lalu jadwalkan refresh mingguan tiap Senin jam 07.00.
	if os.Getenv("GOOGLE_BUSINESS_ID") != "" {
		var googleBusinessCount int64
		db.Model(&models.GoogleBusinessCache{}).Count(&googleBusinessCount)
		if googleBusinessCount == 0 {
			go func() {
				if err := services.FetchAndCache(db); err != nil {
					log.Printf("[GoogleBusiness] Gagal fetch awal: %v", err)
				}
			}()
		}
	}
	googleCron := cron.New()
	googleCron.AddFunc("0 7 * * 1", func() {
		if err := services.FetchAndCache(db); err != nil {
			log.Printf("[GoogleBusiness] Gagal refresh terjadwal: %v", err)
		}
	})
	googleCron.Start()

	// Instagram/TikTok/Facebook: TIDAK ada bootstrap fetch otomatis saat startup
	// meski tabel kosong (beda dari Google Business) — data cache sengaja
	// dibiarkan kosong sampai admin klik Refresh Data manual, atau cron
	// mingguan (Senin 08:00) berikut ini jalan. TikTok & Facebook sengaja
	// ditambahkan ke cron Instagram yang sudah ada (bukan cron terpisah) —
	// ketiganya berbagi kuota RapidAPI yang sama.
	instagramCron := cron.New()
	instagramCron.AddFunc("0 8 * * 1", func() {
		if err := services.FetchAndCacheInstagram(db); err != nil {
			log.Printf("[Instagram] Gagal refresh terjadwal: %v", err)
		}
		if err := services.FetchAndCacheTiktok(db); err != nil {
			log.Printf("[TikTok] Gagal refresh terjadwal: %v", err)
		}
		if err := services.FetchAndCacheFacebook(db); err != nil {
			log.Printf("[Facebook] Gagal refresh terjadwal: %v", err)
		}
	})
	instagramCron.Start()

	r := routes.SetupRouter(db, dbKhanza, cldSvc)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := r.Run(":" + port); err != nil {
		log.Fatal("Gagal menjalankan server:", err)
	}
}
