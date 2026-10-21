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
            CREATE TABLE thong_bao (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              nguoi_dung_id BIGINT UNSIGNED NOT NULL,
              tin_dang_id BIGINT UNSIGNED NULL,
              yeu_cau_id BIGINT UNSIGNED NULL,
              cuoc_hen_id BIGINT UNSIGNED NULL,
              loai_thong_bao VARCHAR(50) NOT NULL,
              tieu_de VARCHAR(255) NOT NULL,
              noi_dung TEXT NOT NULL,
              thoi_gian_doc DATETIME NULL,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT fk_thong_bao_nguoi FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
              CONSTRAINT fk_thong_bao_tin FOREIGN KEY (tin_dang_id) REFERENCES tin_dang(id),
              CONSTRAINT fk_thong_bao_yeu_cau FOREIGN KEY (yeu_cau_id) REFERENCES yeu_cau_nhan_do(id),
              CONSTRAINT fk_thong_bao_cuoc_hen FOREIGN KEY (cuoc_hen_id, yeu_cau_id) REFERENCES cuoc_hen(id, yeu_cau_id),
              INDEX idx_thong_bao_hop_thu (nguoi_dung_id, thoi_gian_doc, created_at),
              CONSTRAINT chk_thong_bao_cuoc_hen CHECK (cuoc_hen_id IS NULL OR yeu_cau_id IS NOT NULL)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `thong_bao`");
    }
};
