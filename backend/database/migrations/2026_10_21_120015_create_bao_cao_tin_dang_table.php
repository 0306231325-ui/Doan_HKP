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
            CREATE TABLE bao_cao_tin_dang (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              tin_dang_id BIGINT UNSIGNED NOT NULL,
              nguoi_bao_cao_id BIGINT UNSIGNED NOT NULL,
              ly_do VARCHAR(255) NOT NULL,
              mo_ta TEXT NULL,
              trang_thai ENUM('cho_xu_ly', 'chap_nhan', 'tu_choi') NOT NULL DEFAULT 'cho_xu_ly',
              nguoi_xu_ly_id BIGINT UNSIGNED NULL,
              ghi_chu_admin TEXT NULL,
              thoi_gian_xu_ly DATETIME NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              CONSTRAINT fk_bao_cao_tin FOREIGN KEY (tin_dang_id) REFERENCES tin_dang(id),
              CONSTRAINT fk_bao_cao_nguoi_gui FOREIGN KEY (nguoi_bao_cao_id) REFERENCES nguoi_dung(id),
              CONSTRAINT fk_bao_cao_admin FOREIGN KEY (nguoi_xu_ly_id) REFERENCES nguoi_dung(id),
              INDEX idx_bao_cao_queue (trang_thai, created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `bao_cao_tin_dang`");
    }
};
