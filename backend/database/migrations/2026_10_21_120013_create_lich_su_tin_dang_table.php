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
            CREATE TABLE lich_su_tin_dang (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              tin_dang_id BIGINT UNSIGNED NOT NULL,
              nguoi_thuc_hien_id BIGINT UNSIGNED NULL,
              hanh_dong VARCHAR(64) NOT NULL,
              trang_thai_cu VARCHAR(32) NULL,
              trang_thai_moi VARCHAR(32) NULL,
              noi_dung TEXT NULL,
              du_lieu_cu JSON NULL,
              du_lieu_moi JSON NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT fk_ls_tin_dang FOREIGN KEY (tin_dang_id) REFERENCES tin_dang(id),
              CONSTRAINT fk_ls_tin_nguoi FOREIGN KEY (nguoi_thuc_hien_id) REFERENCES nguoi_dung(id),
              INDEX idx_ls_tin_thoi_gian (tin_dang_id, created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `lich_su_tin_dang`");
    }
};
