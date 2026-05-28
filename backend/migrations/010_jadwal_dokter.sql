CREATE TABLE IF NOT EXISTS jadwaldokter (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    doctor_id BIGINT UNSIGNED,

    day_of_week ENUM(
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ) NOT NULL,

    start_time TIME,
    end_time TIME,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_jadwaldokter_dokter
    FOREIGN KEY (doctor_id)
    REFERENCES dokter(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,

    INDEX idx_jadwaldokter_day (day_of_week),
    INDEX idx_jadwaldokter_doctor (doctor_id)

)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;