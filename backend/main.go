package main

import (
	"log"
	"os"

	database "backend/Database"
	"backend/handlers"
	"backend/models"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	db, err := database.Connect()
	if err != nil {
		log.Fatal("gagal konek nih ke database awowkwkwk:", err)
	}

	if err := database.AutoMigrate(
		db,
		&models.Admin{},
		&models.Dokter{},
		&models.Kamar{},
		&models.Galeri{},
		&models.Promo{},
		&models.ArtikelKategori{},
		&models.Artikel{},
		&models.Layanan{},
		&models.JadwalDokter{},
		&models.PesanKontak{},
		&models.SiteConfig{},
		&models.SocialLink{},
		&models.JamOperasional{},
	); err != nil {
		log.Fatal("Gagal migrasi database:", err)
	}

	r := handlers.SetupRouter(db)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := r.Run(":" + port); err != nil {
		log.Fatal("Gagal menjalankan server:", err)
	}
}
