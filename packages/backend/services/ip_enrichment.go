package services

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"
)

// IPGeoInfo adalah hasil enrichment lokasi kasar dari alamat IP (level kota,
// bukan alamat presisi). Dipakai hanya untuk analitik agregat pengunjung.
type IPGeoInfo struct {
	Kota     string
	Provinsi string
	Negara   string
	ISP      string
}

type ipAPIResponse struct {
	Status     string `json:"status"`
	Message    string `json:"message"`
	CountryCode string `json:"countryCode"`
	RegionName string `json:"regionName"`
	City       string `json:"city"`
	ISP        string `json:"isp"`
}

var ipEnrichClient = &http.Client{Timeout: 3 * time.Second}

func isPrivateOrLocalIP(ip string) bool {
	return ip == "" || ip == "127.0.0.1" || ip == "::1" ||
		strings.HasPrefix(ip, "192.168.") || strings.HasPrefix(ip, "10.") ||
		strings.HasPrefix(ip, "172.16.") || strings.HasPrefix(ip, "172.17.") ||
		strings.HasPrefix(ip, "172.18.") || strings.HasPrefix(ip, "172.19.") ||
		strings.HasPrefix(ip, "172.2") || strings.HasPrefix(ip, "172.30.") ||
		strings.HasPrefix(ip, "172.31.")
}

// EnrichIP menerjemahkan IP publik menjadi kota/provinsi/ISP kasar via
// ip-api.com (free tier, 45 request/menit). Gagal/timeout tidak fatal —
// tracking tetap jalan tanpa data lokasi. HANYA dipanggil dari alur yang
// sudah mendapat consent_analytics = true.
func EnrichIP(ip string) *IPGeoInfo {
	if isPrivateOrLocalIP(ip) {
		return nil
	}

	resp, err := ipEnrichClient.Get("http://ip-api.com/json/" + ip + "?fields=status,message,countryCode,regionName,city,isp")
	if err != nil {
		log.Printf("[ip-enrich] gagal request untuk IP: %v", err)
		return nil
	}
	defer resp.Body.Close()

	var out ipAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		log.Printf("[ip-enrich] gagal decode respons: %v", err)
		return nil
	}
	if out.Status != "success" {
		return nil
	}

	return &IPGeoInfo{
		Kota:     out.City,
		Provinsi: out.RegionName,
		Negara:   out.CountryCode,
		ISP:      out.ISP,
	}
}
