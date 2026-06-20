package models

import "time"

type VisitorSession struct {
	ID             uint64     `gorm:"column:id" json:"id"`
	SessionID      string     `gorm:"column:session_id" json:"session_id"`
	IPAddress      string     `gorm:"column:ip_address" json:"ip_address"`
	Device         string     `gorm:"column:device" json:"device"`
	Browser        string     `gorm:"column:browser" json:"browser"`
	PagesVisited   int        `gorm:"column:pages_visited" json:"pages_visited"`
	DurationSecond int        `gorm:"column:duration_second" json:"duration_second"`
	Source         string     `gorm:"column:source" json:"source"`
	StartedAt      time.Time  `gorm:"column:started_at" json:"started_at"`
	EndedAt        *time.Time `gorm:"column:ended_at" json:"ended_at,omitempty"`
}

func (VisitorSession) TableName() string { return "visitor_sessions" }

type SocialIconClick struct {
	ID        uint64    `gorm:"column:id;primaryKey" json:"id"`
	Platform  string    `gorm:"column:platform"      json:"platform"`
	SessionID string    `gorm:"column:session_id"    json:"session_id,omitempty"`
	IPAddress string    `gorm:"column:ip_address"    json:"ip_address"`
	ClickedAt time.Time `gorm:"column:clicked_at"    json:"clicked_at"`
}

func (SocialIconClick) TableName() string { return "social_icon_clicks" }
