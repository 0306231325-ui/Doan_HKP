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
            CREATE TABLE lich_su_yeu_cau (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              yeu_cau_id BIGINT UNSIGNED NOT NULL,
              cuoc_hen_id BIGINT UNSIGNED NULL,
              nguoi_thuc_hien_id BIGINT UNSIGNED NULL,
              hanh_dong VARCHAR(64) NOT NULL,
              trang_thai_cu VARCHAR(32) NULL,
              trang_thai_moi VARCHAR(32) NULL,
              noi_dung TEXT NULL,
              du_lieu_cu JSON NULL,
              du_lieu_moi JSON NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT fk_ls_yeu_cau FOREIGN KEY (yeu_cau_id) REFERENCES yeu_cau_nhan_do(id),
              CONSTRAINT fk_ls_yc_cuoc_hen FOREIGN KEY (cuoc_hen_id, yeu_cau_id) REFERENCES cuoc_hen(id, yeu_cau_id),
              CONSTRAINT fk_ls_yc_nguoi FOREIGN KEY (nguoi_thuc_hien_id) REFERENCES nguoi_dung(id),
              INDEX idx_ls_yc_thoi_gian (yeu_cau_id, created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `lich_su_yeu_cau`");
    }
};
