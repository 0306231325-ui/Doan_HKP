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
            CREATE TABLE cau_hoi (
              id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              danh_muc_id BIGINT UNSIGNED NULL,
              noi_dung VARCHAR(255) NOT NULL,
              kieu_nhap ENUM('van_ban', 'so') NOT NULL DEFAULT 'van_ban',
              thu_tu INT UNSIGNED NOT NULL DEFAULT 0,
              trang_thai TINYINT(1) NOT NULL DEFAULT 1,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              CONSTRAINT fk_cau_hoi_danh_muc FOREIGN KEY (danh_muc_id) REFERENCES danh_muc_do_vat(id),
              INDEX idx_cau_hoi_danh_muc (danh_muc_id, trang_thai, thu_tu),
              CONSTRAINT chk_cau_hoi_trang_thai CHECK (trang_thai IN (0,1))
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `cau_hoi`");
    }
};
