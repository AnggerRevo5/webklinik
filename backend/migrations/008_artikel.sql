CREATE TABLE IF NOT EXISTS artikel (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    slug VARCHAR(255) NOT NULL UNIQUE,

    thumbnail_url TEXT NOT NULL,

    short_desc TEXT,

    content LONGTEXT,

    kategori_id BIGINT UNSIGNED DEFAULT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    published_at TIMESTAMP NULL DEFAULT NULL,

    created_at TIMESTAMP NOT NULL
    DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
    DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_artikel_kategori
    FOREIGN KEY (kategori_id)
    REFERENCES artikel_kategori(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,

    INDEX idx_artikel_slug (slug),

    INDEX idx_artikel_is_active (is_active),

    INDEX idx_artikel_kategori (kategori_id)

)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;