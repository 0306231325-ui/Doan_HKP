<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('ban_giao', 'ma_tra_cuu_hash')) {
            return;
        }

        DB::statement(<<<'SQL'
            INSERT INTO lich_su_yeu_cau
                (yeu_cau_id, cuoc_hen_id, nguoi_thuc_hien_id, hanh_dong, trang_thai_moi, noi_dung, du_lieu_moi, created_at)
            SELECT c.yeu_cau_id, c.id, b.nguoi_xac_nhan_ban_giao_id, 'xac_nhan_ban_giao', 'da_hoan_tat',
                   COALESCE(b.ghi_chu_ban_giao, 'Đã xác nhận bàn giao.'),
                   JSON_OBJECT('phuong_thuc_ban_giao', b.phuong_thuc_ban_giao), b.thoi_gian_ban_giao
            FROM ban_giao b JOIN cuoc_hen c ON c.id = b.cuoc_hen_id
            WHERE b.thoi_gian_ban_giao IS NOT NULL
              AND NOT EXISTS (
                SELECT 1 FROM lich_su_yeu_cau ls
                WHERE ls.cuoc_hen_id = c.id AND ls.hanh_dong = 'xac_nhan_ban_giao'
                  AND ls.nguoi_thuc_hien_id = b.nguoi_xac_nhan_ban_giao_id
                  AND (ls.du_lieu_moi IS NOT NULL OR (b.phuong_thuc_ban_giao = 'ma_xac_nhan' AND b.ghi_chu_ban_giao IS NULL))
              )
            SQL);

        $boRangBuoc = str_contains(strtolower(DB::selectOne('SELECT VERSION() AS phien_ban')->phien_ban), 'mariadb')
            ? 'DROP CONSTRAINT' : 'DROP CHECK';

        DB::statement(<<<SQL
            ALTER TABLE ban_giao
                $boRangBuoc chk_ban_giao_ma,
                $boRangBuoc chk_ban_giao_so_lan_sai,
                $boRangBuoc chk_ban_giao_ket_qua,
                DROP FOREIGN KEY fk_ban_giao_nguoi_xac_nhan,
                DROP COLUMN ma_ban_giao_hash,
                DROP COLUMN so_lan_nhap_sai,
                DROP COLUMN phuong_thuc_ban_giao,
                DROP COLUMN nguoi_xac_nhan_ban_giao_id,
                DROP COLUMN ghi_chu_ban_giao,
                DROP COLUMN created_at,
                DROP COLUMN updated_at,
                DROP INDEX ban_giao_ma_tra_cuu_hash_unique,
                CHANGE COLUMN ma_tra_cuu_hash ma_ban_giao_hash CHAR(64) NULL,
                ADD UNIQUE INDEX ban_giao_ma_ban_giao_hash_unique (ma_ban_giao_hash)
            SQL);

        DB::table('ban_giao')->whereNull('ma_ban_giao_hash')->update(['ma_het_han_luc' => null]);
    }

    public function down(): void
    {
        throw new RuntimeException('Cần khôi phục bản sao lưu để quay lại cách lưu mã bàn giao cũ.');
    }
};
