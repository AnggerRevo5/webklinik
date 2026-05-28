CREATE TABLE kamar (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    kd_bangsal VARCHAR(255) NOT NULL UNIQUE,
    nm_bangsal VARCHAR(255),

    thumbnail_url TEXT,

    room_desc LONGTEXT,
    facilities LONGTEXT,

    total_bed INT NOT NULL DEFAULT 0,
    available_bed INT NOT NULL DEFAULT 0,

    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    show_on_website BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_kamar_kd_bangsal (kd_bangsal)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;