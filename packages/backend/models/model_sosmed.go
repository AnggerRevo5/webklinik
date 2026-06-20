package models

import "time"

type SocialMediaEngagement struct {
	ID            uint64    `gorm:"column:id" json:"id"`
	Platform      string    `gorm:"column:platform" json:"platform"`
	LikesCount    uint64    `gorm:"column:likes_count" json:"likes_count"`
	CommentsCount uint64    `gorm:"column:comments_count" json:"comments_count"`
	SharesCount   uint64    `gorm:"column:shares_count" json:"shares_count"`
	SavesCount    uint64    `gorm:"column:saves_count" json:"saves_count"`
	RecordedAt    time.Time `gorm:"column:recorded_at" json:"recorded_at"`
}

func (SocialMediaEngagement) TableName() string { return "social_media_engagement" }

type SocialMediaStats struct {
	ID             uint64    `gorm:"column:id" json:"id"`
	Platform       string    `gorm:"column:platform" json:"platform"`
	FollowerCount  uint64    `gorm:"column:follower_count" json:"follower_count"`
	EngagementRate float64   `gorm:"column:engagement_rate" json:"engagement_rate"`
	RecordedAt     time.Time `gorm:"column:recorded_at" json:"recorded_at"`
}

func (SocialMediaStats) TableName() string { return "social_media_stats" }

type GBPInteraction struct {
	ID              uint64    `gorm:"column:id" json:"id"`
	InteractionType string    `gorm:"column:interaction_type" json:"interaction_type"`
	Count           uint64    `gorm:"column:count" json:"count"`
	RecordedAt      time.Time `gorm:"column:recorded_at" json:"recorded_at"`
}

func (GBPInteraction) TableName() string { return "gbp_interactions" }

type GoogleReview struct {
	ID            uint64    `gorm:"column:id" json:"id"`
	ReviewCount   uint64    `gorm:"column:review_count" json:"review_count"`
	AverageRating float64   `gorm:"column:average_rating" json:"average_rating"`
	RecordedAt    time.Time `gorm:"column:recorded_at" json:"recorded_at"`
}

func (GoogleReview) TableName() string { return "google_reviews" }
