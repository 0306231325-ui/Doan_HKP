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
            CREATE TABLE loi_khai_tin_dang (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              tin_dang_id BIGINT UNSIGNED NOT NULL,
              cau_hoi_id BIGINT UNSIGNED NOT NULL,
              gia_tri_text TEXT NULL,
              gia_tri_so DECIMAL(18,4) NULL,
              gia_tri_lua_chon VARCHAR(100) NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              CONSTRAINT fk_loi_khai_tin FOREIGN KEY (tin_dang_id) REFERENCES tin_dang(id),
              CONSTRAINT fk_loi_khai_cau_hoi FOREIGN KEY (cau_hoi_id) REFERENCES cau_hoi(id),
              UNIQUE KEY uq_loi_khai_tin_cau_hoi (tin_dang_id, cau_hoi_id),
              UNIQUE KEY uq_loi_khai_tin_id_tin (id, tin_dang_id),
              INDEX idx_loi_khai_loc (cau_hoi_id, gia_tri_lua_chon, tin_dang_id),
              CONSTRAINT chk_loi_khai_tin_mot_gia_tri CHECK (
                (gia_tri_text IS NOT NULL) + (gia_tri_so IS NOT NULL) + (gia_tri_lua_chon IS NOT NULL) = 1
                AND (gia_tri_text IS NULL OR CHAR_LENGTH(TRIM(gia_tri_text)) > 0)
                AND (gia_tri_lua_chon IS NULL OR CHAR_LENGTH(TRIM(gia_tri_lua_chon)) > 0)
              )
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `loi_khai_tin_dang`");
    }
};
