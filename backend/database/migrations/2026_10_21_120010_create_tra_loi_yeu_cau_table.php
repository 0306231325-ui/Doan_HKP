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
            CREATE TABLE tra_loi_yeu_cau (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              yeu_cau_id BIGINT UNSIGNED NOT NULL,
              tin_dang_id BIGINT UNSIGNED NOT NULL,
              loi_khai_tin_dang_id BIGINT UNSIGNED NOT NULL,
              gia_tri_text TEXT NULL,
              gia_tri_so DECIMAL(18,4) NULL,
              gia_tri_lua_chon VARCHAR(100) NULL,
              ket_qua_doi_chieu ENUM('chua_danh_gia', 'khop', 'khong_khop', 'chua_du_can_cu') NOT NULL DEFAULT 'chua_danh_gia',
              nhan_xet_admin TEXT NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              CONSTRAINT fk_tra_loi_yc_yeu_cau FOREIGN KEY (yeu_cau_id, tin_dang_id) REFERENCES yeu_cau_nhan_do(id, tin_dang_id),
              CONSTRAINT fk_tra_loi_yc_dap_an_goc FOREIGN KEY (loi_khai_tin_dang_id, tin_dang_id) REFERENCES loi_khai_tin_dang(id, tin_dang_id),
              UNIQUE KEY uq_tra_loi_yc_cau_hoi (yeu_cau_id, loi_khai_tin_dang_id),
              CONSTRAINT chk_tra_loi_yc_mot_gia_tri CHECK (
                (gia_tri_text IS NOT NULL) + (gia_tri_so IS NOT NULL) + (gia_tri_lua_chon IS NOT NULL) = 1
                AND (gia_tri_text IS NULL OR CHAR_LENGTH(TRIM(gia_tri_text)) > 0)
                AND (gia_tri_lua_chon IS NULL OR CHAR_LENGTH(TRIM(gia_tri_lua_chon)) > 0)
              )
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `tra_loi_yeu_cau`");
    }
};
