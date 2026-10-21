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
              ma_cau_hoi VARCHAR(64) NOT NULL,
              phien_ban INT UNSIGNED NOT NULL DEFAULT 1,
              noi_dung VARCHAR(255) NOT NULL,
              kieu_nhap ENUM('van_ban', 'so', 'chon_mot') NOT NULL DEFAULT 'van_ban',
              lua_chon JSON NULL,
              loai_tin ENUM('ca_hai', 'bao_mat', 'nhat_duoc') NOT NULL DEFAULT 'ca_hai',
              bat_buoc TINYINT(1) NOT NULL DEFAULT 1,
              cong_khai TINYINT(1) NOT NULL DEFAULT 1,
              dung_xac_minh TINYINT(1) NOT NULL DEFAULT 0,
              thu_tu INT UNSIGNED NOT NULL DEFAULT 0,
              trang_thai TINYINT(1) NOT NULL DEFAULT 1,
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              CONSTRAINT fk_cau_hoi_danh_muc FOREIGN KEY (danh_muc_id) REFERENCES danh_muc_do_vat(id),
              UNIQUE KEY uq_cau_hoi_phien_ban (ma_cau_hoi, phien_ban),
              INDEX idx_cau_hoi_form (danh_muc_id, trang_thai, loai_tin, thu_tu),
              CONSTRAINT chk_cau_hoi_phien_ban CHECK (phien_ban >= 1),
              CONSTRAINT chk_cau_hoi_co CHECK (
                bat_buoc IN (0,1) AND cong_khai IN (0,1) AND dung_xac_minh IN (0,1) AND trang_thai IN (0,1)
              ),
              CONSTRAINT chk_cau_hoi_xac_minh CHECK (
                dung_xac_minh = 0 OR loai_tin <> 'bao_mat'
              ),
              CONSTRAINT chk_cau_hoi_lua_chon CHECK (
                (kieu_nhap = 'chon_mot' AND lua_chon IS NOT NULL
                  AND JSON_TYPE(lua_chon) = 'ARRAY' AND JSON_LENGTH(lua_chon) > 0)
                OR (kieu_nhap <> 'chon_mot' AND lua_chon IS NULL)
              )
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            SQL);
    }

    public function down(): void
    {
        DB::statement("DROP TABLE IF EXISTS `cau_hoi`");
    }
};
