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
            CREATE TABLE hinh_anh_tin_dang (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              tin_dang_id BIGINT UNSIGNED NOT NULL,
              nguoi_tai_len_id BIGINT UNSIGNED NOT NULL,
              duong_dan VARCHAR(500) NOT NULL,
              mo_ta VARCHAR(255) NULL,
              pham_vi ENUM('cong_khai', 'rieng_tu') NOT NULL DEFAULT 'cong_khai',
              thu_tu INT UNSIGNED NOT NULL DEFAULT 0,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT fk_anh_tin FOREIGN KEY (tin_dang_id) REFERENCES tin_dang(id),
              CONSTRAINT fk_anh_nguoi_tai FOREIGN KEY (nguoi_tai_len_id) REFERENCES nguoi_dung(id),
              INDEX idx_anh_tin_thu_tu (tin_dang_id, thu_tu)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `hinh_anh_tin_dang`");
    }
};
