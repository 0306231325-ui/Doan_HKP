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
            CREATE TABLE yeu_cau_nhan_do (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              tin_dang_id BIGINT UNSIGNED NOT NULL,
              nguoi_yeu_cau_id BIGINT UNSIGNED NOT NULL,
              loi_nhan TEXT NULL,
              thoi_gian_mat DATETIME NULL,
              dia_diem_mat_id BIGINT UNSIGNED NULL,
              dia_diem_mat_chi_tiet VARCHAR(255) NULL,
              trang_thai ENUM('cho_kiem_tra', 'can_bo_sung', 'da_xac_minh', 'tu_choi', 'da_huy') NOT NULL DEFAULT 'cho_kiem_tra',
              nguoi_xu_ly_id BIGINT UNSIGNED NULL,
              ghi_chu_admin TEXT NULL,
              thoi_gian_xu_ly DATETIME NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              tin_dang_dang_xu_ly_id BIGINT UNSIGNED GENERATED ALWAYS AS (
                CASE WHEN trang_thai IN ('cho_kiem_tra', 'can_bo_sung', 'da_xac_minh')
                  THEN tin_dang_id ELSE NULL END
              ) STORED,
              tin_dang_da_duyet_id BIGINT UNSIGNED GENERATED ALWAYS AS (
                CASE WHEN trang_thai = 'da_xac_minh'
                  THEN tin_dang_id ELSE NULL END
              ) STORED,
              CONSTRAINT fk_yeu_cau_tin FOREIGN KEY (tin_dang_id) REFERENCES tin_dang(id),
              CONSTRAINT fk_yeu_cau_nguoi_gui FOREIGN KEY (nguoi_yeu_cau_id) REFERENCES nguoi_dung(id),
              CONSTRAINT fk_yeu_cau_dia_diem_mat FOREIGN KEY (dia_diem_mat_id) REFERENCES dia_diem(id),
              CONSTRAINT fk_yeu_cau_admin FOREIGN KEY (nguoi_xu_ly_id) REFERENCES nguoi_dung(id),
              UNIQUE KEY uq_yeu_cau_id_tin (id, tin_dang_id),
              UNIQUE KEY uq_yeu_cau_dang_xu_ly (nguoi_yeu_cau_id, tin_dang_dang_xu_ly_id),
              UNIQUE KEY uq_mot_nguoi_nhan (tin_dang_da_duyet_id),
              INDEX idx_yeu_cau_tin_trang_thai (tin_dang_id, trang_thai),
              INDEX idx_yeu_cau_admin_queue (trang_thai, created_at),
              CONSTRAINT chk_yeu_cau_da_duyet CHECK (
                trang_thai <> 'da_xac_minh'
                OR (nguoi_xu_ly_id IS NOT NULL AND thoi_gian_xu_ly IS NOT NULL)
              )
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `yeu_cau_nhan_do`");
    }
};
