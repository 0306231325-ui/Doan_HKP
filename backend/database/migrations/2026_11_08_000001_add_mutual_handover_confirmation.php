<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cuoc_hen', function (Blueprint $table) {
            $table->dateTime('nguoi_giu_xac_nhan_luc')->nullable();
            $table->dateTime('nguoi_nhan_xac_nhan_luc')->nullable();
        });
        if (DB::getDriverName() === 'mysql') {
            $drop = str_contains(strtolower(DB::selectOne('select version() as v')->v), 'mariadb') ? 'DROP CONSTRAINT' : 'DROP CHECK';
            DB::statement("ALTER TABLE ban_giao $drop chk_ban_giao_ket_qua");
            DB::statement("ALTER TABLE ban_giao MODIFY phuong_thuc_ban_giao ENUM('ma_xac_nhan','admin_xac_nhan','hai_ben_xac_nhan') NULL");
            DB::statement("ALTER TABLE ban_giao ADD CONSTRAINT chk_ban_giao_ket_qua CHECK (
                (phuong_thuc_ban_giao IS NOT NULL AND nguoi_xac_nhan_ban_giao_id IS NOT NULL AND thoi_gian_ban_giao IS NOT NULL
                  AND (phuong_thuc_ban_giao IN ('ma_xac_nhan','hai_ben_xac_nhan') OR (phuong_thuc_ban_giao = 'admin_xac_nhan' AND ghi_chu_ban_giao IS NOT NULL AND CHAR_LENGTH(TRIM(ghi_chu_ban_giao)) > 0)))
                OR (phuong_thuc_ban_giao IS NULL AND nguoi_xac_nhan_ban_giao_id IS NULL AND thoi_gian_ban_giao IS NULL AND ghi_chu_ban_giao IS NULL))");
        }
    }

    public function down(): void
    {
        // Keep the expanded method enum so historical mutual confirmations remain readable.
        Schema::table('cuoc_hen', function (Blueprint $table) {
            $table->dropColumn(['nguoi_giu_xac_nhan_luc', 'nguoi_nhan_xac_nhan_luc']);
        });
    }
};
