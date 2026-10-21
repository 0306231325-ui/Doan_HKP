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
            CREATE TABLE minh_chung_yeu_cau (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              yeu_cau_id BIGINT UNSIGNED NOT NULL,
              duong_dan VARCHAR(500) NOT NULL,
              mo_ta VARCHAR(255) NULL,
              thu_tu INT UNSIGNED NOT NULL DEFAULT 0,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT fk_minh_chung_yeu_cau FOREIGN KEY (yeu_cau_id) REFERENCES yeu_cau_nhan_do(id),
              INDEX idx_minh_chung_thu_tu (yeu_cau_id, thu_tu)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `minh_chung_yeu_cau`");
    }
};
