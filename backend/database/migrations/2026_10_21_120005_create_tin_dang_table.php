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
            CREATE TABLE tin_dang (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              nguoi_dung_id BIGINT UNSIGNED NOT NULL,
              danh_muc_id BIGINT UNSIGNED NOT NULL,
              dia_diem_id BIGINT UNSIGNED NULL,
              loai_tin ENUM('bao_mat', 'nhat_duoc') NOT NULL,
              tin_bao_mat_lien_quan_id BIGINT UNSIGNED NULL,
              tieu_de VARCHAR(255) NOT NULL,
              slug VARCHAR(255) NOT NULL UNIQUE,
              mo_ta TEXT NOT NULL,
              thoi_gian_xay_ra DATETIME NULL,
              dia_diem_chi_tiet VARCHAR(255) NULL,
              thong_tin_lien_he VARCHAR(255) NULL,
              trang_thai ENUM('dang_mo', 'cho_ban_giao', 'da_hoan_tat', 'da_dong') NOT NULL DEFAULT 'dang_mo',
              trang_thai_kiem_duyet ENUM('hien_thi', 'da_an') NOT NULL DEFAULT 'hien_thi',
              ly_do_an TEXT NULL,
              deleted_at DATETIME NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              CONSTRAINT fk_tin_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
              CONSTRAINT fk_tin_danh_muc FOREIGN KEY (danh_muc_id) REFERENCES danh_muc_do_vat(id),
              CONSTRAINT fk_tin_dia_diem FOREIGN KEY (dia_diem_id) REFERENCES dia_diem(id),
              CONSTRAINT fk_tin_bao_mat_lien_quan FOREIGN KEY (tin_bao_mat_lien_quan_id) REFERENCES tin_dang(id),
              CONSTRAINT chk_tin_phan_hoi_bao_mat CHECK (tin_bao_mat_lien_quan_id IS NULL OR loai_tin = 'nhat_duoc'),
              INDEX idx_tin_phan_hoi_bao_mat (tin_bao_mat_lien_quan_id, nguoi_dung_id),
              INDEX idx_tin_loc (loai_tin, trang_thai, danh_muc_id, dia_diem_id),
              INDEX idx_tin_hien_thi (trang_thai_kiem_duyet, deleted_at, created_at),
              FULLTEXT INDEX ft_tin_tim_kiem (tieu_de, mo_ta)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `tin_dang`");
    }
};
