<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function () {
            DB::table('yeu_cau_nhan_do')->where('trang_thai', 'can_bo_sung')->orderBy('id')->lockForUpdate()->get()->each(function ($yc) {
                DB::table('lich_su_yeu_cau')->insert([
                    'yeu_cau_id' => $yc->id, 'hanh_dong' => 'chuyen_cho_duyet',
                    'trang_thai_cu' => 'can_bo_sung', 'trang_thai_moi' => 'cho_kiem_tra',
                    'noi_dung' => 'Chuyển về chờ duyệt do bỏ bước yêu cầu bổ sung.'.($yc->ghi_chu_admin ? "\nPhản hồi cũ: ".$yc->ghi_chu_admin : ''), 'created_at' => now(),
                ]);
                DB::table('yeu_cau_nhan_do')->where('id', $yc->id)->update([
                    'trang_thai' => 'cho_kiem_tra', 'ghi_chu_admin' => null,
                    'nguoi_xu_ly_id' => null, 'thoi_gian_xu_ly' => null, 'updated_at' => now(),
                ]);
            });
        });
    }

    public function down(): void
    {
        // Keep subsequent review decisions intact when rolling back code.
    }
};
