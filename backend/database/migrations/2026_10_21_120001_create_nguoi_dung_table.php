<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            throw new RuntimeException('The lost-and-found schema requires MySQL 8.0.16+ or a compatible MariaDB release.');
        }

        DB::unprepared(<<<'SQL'
            CREATE TABLE nguoi_dung (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              ho_ten VARCHAR(150) NOT NULL,
              email VARCHAR(191) NOT NULL UNIQUE,
              mat_khau VARCHAR(255) NOT NULL,
              so_dien_thoai VARCHAR(20) NULL,
              ma_so VARCHAR(50) NULL,
              khoa VARCHAR(100) NULL,
              lop VARCHAR(50) NULL,
              vai_tro ENUM('nguoi_dung', 'quan_tri') NOT NULL DEFAULT 'nguoi_dung',
              trang_thai ENUM('hoat_dong', 'bi_khoa') NOT NULL DEFAULT 'hoat_dong',
              ly_do_khoa TEXT NULL,
              khoa_den_ngay DATETIME NULL,
              anh_dai_dien VARCHAR(500) NULL,
              deleted_at DATETIME NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX idx_nguoi_dung_ma_so (ma_so)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `nguoi_dung`");
    }
};
