package handlers

import (
	"net/http"
	"strconv"
	"time"

	"backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type dailyStat struct {
	Date  string `gorm:"column:date"  json:"date"`
	Count int64  `gorm:"column:count" json:"count"`
}

type sourceStat struct {
	Source string `gorm:"column:source" json:"source"`
	Count  int64  `gorm:"column:count"  json:"count"`
}

type deviceCount struct {
	Device string `gorm:"column:device"`
	Count  int64  `gorm:"column:count"`
}

type platformStat struct {
	Platform string `gorm:"column:platform" json:"platform"`
	Count    int64  `gorm:"column:count"    json:"count"`
}

// GET /api/admin/stats/visitor — agregat sesi pengunjung 7 hari terakhir
func AdminVisitorStatsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		sevenDaysAgo := time.Now().AddDate(0, 0, -7)

		var totalSesi int64
		db.Model(&models.VisitorSession{}).
			Where("started_at >= ?", sevenDaysAgo).
			Count(&totalSesi)

		type avgResult struct {
			AvgHalaman float64 `gorm:"column:avg_halaman"`
			AvgDurasi  float64 `gorm:"column:avg_durasi"`
		}
		var avg avgResult
		db.Model(&models.VisitorSession{}).
			Select("AVG(pages_visited) as avg_halaman, AVG(duration_second) / 60.0 as avg_durasi").
			Where("started_at >= ?", sevenDaysAgo).
			Scan(&avg)

		var devStats []deviceCount
		db.Model(&models.VisitorSession{}).
			Select("device, COUNT(*) as count").
			Where("started_at >= ?", sevenDaysAgo).
			Group("device").
			Scan(&devStats)

		deviceBreakdown := map[string]int64{"Mobile": 0, "Desktop": 0}
		for _, d := range devStats {
			if d.Device != "" {
				deviceBreakdown[d.Device] = d.Count
			}
		}

		var sourceStats []sourceStat
		db.Model(&models.VisitorSession{}).
			Select("source, COUNT(*) as count").
			Where("started_at >= ?", sevenDaysAgo).
			Group("source").
			Order("count DESC").
			Limit(6).
			Scan(&sourceStats)
		if sourceStats == nil {
			sourceStats = []sourceStat{}
		}

		var dailyTrend []dailyStat
		db.Model(&models.VisitorSession{}).
			Select("DATE(started_at) as date, COUNT(*) as count").
			Where("started_at >= ?", sevenDaysAgo).
			Group("DATE(started_at)").
			Order("date").
			Scan(&dailyTrend)
		if dailyTrend == nil {
			dailyTrend = []dailyStat{}
		}

		c.JSON(http.StatusOK, gin.H{
			"success":                true,
			"total_sesi_minggu_ini":  totalSesi,
			"rata_rata_halaman":      roundFloat(avg.AvgHalaman),
			"rata_rata_durasi_menit": roundFloat(avg.AvgDurasi),
			"device":                 deviceBreakdown,
			"source":                 sourceStats,
			"daily_trend":            dailyTrend,
		})
	}
}

// GET /api/admin/stats/social-clicks — agregat klik ikon sosmed
func AdminSocialClickStatsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		sevenDaysAgo := time.Now().AddDate(0, 0, -7)

		var totalMingguIni int64
		db.Model(&models.SocialIconClick{}).
			Where("clicked_at >= ?", sevenDaysAgo).
			Count(&totalMingguIni)

		var perPlatformWeek []platformStat
		db.Model(&models.SocialIconClick{}).
			Select("platform, COUNT(*) as count").
			Where("clicked_at >= ?", sevenDaysAgo).
			Group("platform").
			Order("count DESC").
			Scan(&perPlatformWeek)
		if perPlatformWeek == nil {
			perPlatformWeek = []platformStat{}
		}

		var allTime []platformStat
		db.Model(&models.SocialIconClick{}).
			Select("platform, COUNT(*) as count").
			Group("platform").
			Order("count DESC").
			Scan(&allTime)
		if allTime == nil {
			allTime = []platformStat{}
		}

		c.JSON(http.StatusOK, gin.H{
			"success":          true,
			"total_minggu_ini": totalMingguIni,
			"per_platform":     perPlatformWeek,
			"all_time":         allTime,
		})
	}
}

// GET /api/admin/visitor-sessions — list sesi pengunjung dengan pagination dan filter
func AdminVisitorSessionsListHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "20"))
		if page < 1 {
			page = 1
		}
		if perPage < 1 || perPage > 100 {
			perPage = 20
		}
		offset := (page - 1) * perPage

		q := db.Model(&models.VisitorSession{})
		if device := c.Query("device"); device != "" {
			q = q.Where("device = ?", device)
		}
		if source := c.Query("source"); source != "" {
			q = q.Where("source = ?", source)
		}
		if browser := c.Query("browser"); browser != "" {
			q = q.Where("browser = ?", browser)
		}

		var total int64
		q.Count(&total)

		var sessions []models.VisitorSession
		q.Order("started_at DESC").Limit(perPage).Offset(offset).Find(&sessions)
		if sessions == nil {
			sessions = []models.VisitorSession{}
		}

		totalPages := (total + int64(perPage) - 1) / int64(perPage)

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    sessions,
			"pagination": gin.H{
				"page":        page,
				"per_page":    perPage,
				"total":       total,
				"total_pages": totalPages,
			},
		})
	}
}

func roundFloat(v float64) float64 {
	if v != v { // NaN check
		return 0
	}
	// Round ke 2 desimal tanpa import math
	s := strconv.FormatFloat(v, 'f', 2, 64)
	r, _ := strconv.ParseFloat(s, 64)
	return r
}
