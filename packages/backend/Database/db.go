package db

import (
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func Connect() (*gorm.DB, error) {
	_ = godotenv.Load()

	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		user := os.Getenv("DB_USER")
		password := os.Getenv("DB_PASSWORD")
		host := os.Getenv("DB_HOST")
		port := os.Getenv("DB_PORT")
		name := os.Getenv("DB_NAME")

		if user == "" || host == "" || port == "" || name == "" {
			return nil, fmt.Errorf("MAMPUS")
		}

		dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, password, host, port, name)
	}

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("gagal konek nih ke database awowkwkwk: %w", err)
	}

	return db, nil
}

// ConnectKhanza menghubungkan ke database Khanza SIK (latin1, dengan retry).
// Mengembalikan nil jika KHANZA_DB_HOST tidak diset atau koneksi gagal.
func ConnectKhanza() *gorm.DB {
	host := os.Getenv("KHANZA_DB_HOST")
	if host == "" {
		log.Println("[Khanza] KHANZA_DB_HOST tidak diset, koneksi Khanza dinonaktifkan")
		return nil
	}

	user := os.Getenv("KHANZA_DB_USER")
	password := os.Getenv("KHANZA_DB_PASSWORD")
	name := os.Getenv("KHANZA_DB_NAME")
	if name == "" {
		name = "sik"
	}

	// charset=latin1 karena Khanza menggunakan latin1_swedish_ci
	dsn := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?charset=latin1&parseTime=True&loc=Local",
		user, password, host, name)

	var db *gorm.DB
	var err error
	for i := 0; i < 10; i++ {
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err == nil {
			sqlDB, pingErr := db.DB()
			if pingErr == nil {
				if pingErr = sqlDB.Ping(); pingErr == nil {
					log.Printf("[Khanza] Koneksi berhasil ke %s/%s", host, name)
					return db
				}
			}
		}
		log.Printf("[Khanza] DB belum siap, retry %d/10...", i+1)
		time.Sleep(3 * time.Second)
	}

	log.Printf("[Khanza] Gagal konek setelah 10 percobaan: %v", err)
	return nil
}
