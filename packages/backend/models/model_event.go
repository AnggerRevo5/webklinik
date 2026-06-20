package models

import "time"

type Event struct {
	ID         uint64    `gorm:"column:id" json:"id"`
	SessionID  string    `gorm:"column:session_id" json:"session_id"`
	EventType  string    `gorm:"column:event_type" json:"event_type"`
	EventValue string    `gorm:"column:event_value" json:"event_value"`
	IPAddress  string    `gorm:"column:ip_address" json:"ip_address"`
	UserAgent  string    `gorm:"column:user_agent" json:"user_agent"`
	CreatedAt  time.Time `gorm:"column:created_at" json:"created_at"`
}

func (Event) TableName() string { return "event" }
