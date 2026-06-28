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
)

func main() {
	_ = godotenv.Load()

	db, err := database.Connect()
	if err != nil {
		log.Fatal("gagal konek nih ke database awowkwkwk:", err)
	}
	db.AutoMigrate(&models.Promo{})
	db.AutoMigrate(&models.DokterFoto{})
	db.AutoMigrate(&models.MediaLibrary{})
	db.AutoMigrate(&models.Review{})
	db.AutoMigrate(&models.KlinikInfo{})
	db.AutoMigrate(&models.Artikel{})
	db.AutoMigrate(&models.SocialIconClick{})
	db.AutoMigrate(&models.SiteSetting{})
	handlers.SeedSiteSettings(db)

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

	r := routes.SetupRouter(db, dbKhanza, cldSvc)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := r.Run(":" + port); err != nil {
		log.Fatal("Gagal menjalankan server:", err)
	}
}
