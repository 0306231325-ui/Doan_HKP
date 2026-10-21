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
            CREATE TABLE cuoc_hen (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              yeu_cau_id BIGINT UNSIGNED NOT NULL,
              nguoi_giu_do_id BIGINT UNSIGNED NOT NULL,
              nguoi_de_xuat_id BIGINT UNSIGNED NOT NULL,
              nguoi_xac_nhan_id BIGINT UNSIGNED NULL,
              thoi_gian_xac_nhan DATETIME NULL,
              thoi_gian_hen_gap DATETIME NOT NULL,
              dia_diem_id BIGINT UNSIGNED NOT NULL,
              trang_thai ENUM('cho_xac_nhan', 'da_xac_nhan', 'tu_choi', 'da_huy', 'da_hoan_tat') NOT NULL DEFAULT 'cho_xac_nhan',
              ly_do_huy TEXT NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              yeu_cau_hieu_luc_id BIGINT UNSIGNED GENERATED ALWAYS AS (
                CASE WHEN trang_thai IN ('cho_xac_nhan', 'da_xac_nhan', 'da_hoan_tat')
                  THEN yeu_cau_id ELSE NULL END
              ) STORED,
              CONSTRAINT fk_cuoc_hen_yeu_cau FOREIGN KEY (yeu_cau_id) REFERENCES yeu_cau_nhan_do(id),
              CONSTRAINT fk_cuoc_hen_nguoi_giu FOREIGN KEY (nguoi_giu_do_id) REFERENCES nguoi_dung(id),
              CONSTRAINT fk_cuoc_hen_nguoi_de_xuat FOREIGN KEY (nguoi_de_xuat_id) REFERENCES nguoi_dung(id),
              CONSTRAINT fk_cuoc_hen_nguoi_xac_nhan FOREIGN KEY (nguoi_xac_nhan_id) REFERENCES nguoi_dung(id),
              CONSTRAINT fk_cuoc_hen_dia_diem FOREIGN KEY (dia_diem_id) REFERENCES dia_diem(id),
              UNIQUE KEY uq_cuoc_hen_hieu_luc (yeu_cau_hieu_luc_id),
              UNIQUE KEY uq_cuoc_hen_id_yeu_cau (id, yeu_cau_id),
              INDEX idx_cuoc_hen_yeu_cau (yeu_cau_id, created_at),
              INDEX idx_cuoc_hen_nguoi_giu (nguoi_giu_do_id, trang_thai, thoi_gian_hen_gap),
              CONSTRAINT chk_cuoc_hen_xac_nhan CHECK (
                (nguoi_xac_nhan_id IS NULL AND thoi_gian_xac_nhan IS NULL)
                OR (nguoi_xac_nhan_id IS NOT NULL AND thoi_gian_xac_nhan IS NOT NULL
                  AND nguoi_xac_nhan_id <> nguoi_de_xuat_id)
              ),
              CONSTRAINT chk_cuoc_hen_trang_thai CHECK (
                (trang_thai NOT IN ('da_xac_nhan', 'da_hoan_tat') OR nguoi_xac_nhan_id IS NOT NULL)
                AND (trang_thai <> 'cho_xac_nhan' OR nguoi_xac_nhan_id IS NULL)
              ),
              CONSTRAINT chk_cuoc_hen_ly_do_huy CHECK (
                trang_thai NOT IN ('tu_choi', 'da_huy')
                OR (ly_do_huy IS NOT NULL AND CHAR_LENGTH(TRIM(ly_do_huy)) > 0)
              )
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `cuoc_hen`");
    }
};
