CREATE TABLE IF NOT EXISTS kontak (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    email VARCHAR(255) NOT NULL,

    subject VARCHAR(255) NOT NULL,

    message LONGTEXT,

    status ENUM(
        'new',
        'read',
        'replied',
        'closed'
    ) NOT NULL DEFAULT 'new',

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_kontak_status (status),
    INDEX idx_kontak_email (email)

)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;