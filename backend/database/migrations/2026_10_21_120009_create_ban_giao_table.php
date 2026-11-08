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
            CREATE TABLE ban_giao (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              cuoc_hen_id BIGINT UNSIGNED NOT NULL UNIQUE,
              ma_ban_giao_hash VARCHAR(255) NULL,
              ma_het_han_luc DATETIME NULL,
              so_lan_nhap_sai TINYINT UNSIGNED NOT NULL DEFAULT 0,
              phuong_thuc_ban_giao ENUM('ma_xac_nhan', 'admin_xac_nhan') NULL,
              nguoi_xac_nhan_ban_giao_id BIGINT UNSIGNED NULL,
              thoi_gian_ban_giao DATETIME NULL,
              ghi_chu_ban_giao TEXT NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              CONSTRAINT fk_ban_giao_cuoc_hen FOREIGN KEY (cuoc_hen_id) REFERENCES cuoc_hen(id),
              CONSTRAINT fk_ban_giao_nguoi_xac_nhan FOREIGN KEY (nguoi_xac_nhan_ban_giao_id) REFERENCES nguoi_dung(id),
              CONSTRAINT chk_ban_giao_ma CHECK (
                (ma_ban_giao_hash IS NULL AND ma_het_han_luc IS NULL)
                OR (phuong_thuc_ban_giao IS NULL AND ma_ban_giao_hash IS NOT NULL
                  AND CHAR_LENGTH(TRIM(ma_ban_giao_hash)) > 0 AND ma_het_han_luc IS NOT NULL)
              ),
              CONSTRAINT chk_ban_giao_so_lan_sai CHECK (so_lan_nhap_sai BETWEEN 0 AND 5),
              CONSTRAINT chk_ban_giao_ket_qua CHECK (
                (phuong_thuc_ban_giao IS NOT NULL
                  AND nguoi_xac_nhan_ban_giao_id IS NOT NULL AND thoi_gian_ban_giao IS NOT NULL
                  AND (phuong_thuc_ban_giao = 'ma_xac_nhan'
                    OR (phuong_thuc_ban_giao = 'admin_xac_nhan' AND ghi_chu_ban_giao IS NOT NULL
                      AND CHAR_LENGTH(TRIM(ghi_chu_ban_giao)) > 0)))
                OR (phuong_thuc_ban_giao IS NULL
                  AND nguoi_xac_nhan_ban_giao_id IS NULL AND thoi_gian_ban_giao IS NULL AND ghi_chu_ban_giao IS NULL)
              )
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `ban_giao`");
    }
};
