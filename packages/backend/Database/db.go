package db

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// envInt membaca env sebagai integer positif, atau default bila kosong/invalid.
func envInt(key string, def int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			return n
		}
	}
	return def
}

// envSeconds membaca env sebagai detik lalu diubah ke time.Duration.
func envSeconds(key string, def time.Duration) time.Duration {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			return time.Duration(n) * time.Second
		}
	}
	return def
}

// configurePool menerapkan pengaturan connection pool. Tanpa ini, koneksi
// idle yang jadi basi (mis. jalur jaringan sempat putus — VPN/Tailscale
// re-handshake, NAT timeout, WiFi roaming) baru ketahuan mati saat benar-benar
// dipakai untuk query, dan request itu harus menunggu timeout TCP (bisa
// berdetik-detik) sebelum driver retry pakai koneksi baru. ConnMaxLifetime
// memaksa koneksi di-refresh berkala SEBELUM sempat basi, jadi hiccup
// jaringan tidak nyangkut jadi delay panjang di request pengguna.
func configurePool(gdb *gorm.DB) error {
	sqlDB, err := gdb.DB()
	if err != nil {
		return fmt.Errorf("gagal ambil sql.DB dari gorm: %w", err)
	}
	sqlDB.SetMaxOpenConns(envInt("DB_MAX_OPEN_CONNS", 15))
	sqlDB.SetMaxIdleConns(envInt("DB_MAX_IDLE_CONNS", 5))
	sqlDB.SetConnMaxLifetime(envSeconds("DB_CONN_MAX_LIFETIME_SEC", 5*time.Minute))
	sqlDB.SetConnMaxIdleTime(envSeconds("DB_CONN_MAX_IDLE_TIME_SEC", 2*time.Minute))
	return nil
}

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
	if err := configurePool(db); err != nil {
		return nil, err
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
					if poolErr := configurePool(db); poolErr != nil {
						log.Printf("[Khanza] Gagal atur connection pool: %v", poolErr)
					}
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
