CREATE TABLE pasien (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nm_pasien VARCHAR(255) NOT NULL,
    no_ktp VARCHAR(50) UNIQUE,
    no_rm VARCHAR(30) UNIQUE,

    jk ENUM('L','P') NOT NULL,

    tmp_lahir VARCHAR(150),
    tgl_lahir DATE,

    nm_ibu VARCHAR(255),

    no_hp VARCHAR(20),
    email VARCHAR(255),

    alamat TEXT,

    gol_darah ENUM('A','B','AB','O'),

    alergi TEXT,

    status_pasien ENUM(
        'Aktif',
        'Tidak Aktif'
    ) DEFAULT 'Aktif',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);