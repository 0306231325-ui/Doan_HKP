<?php

use Carbon\CarbonImmutable;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ban_giao', function (Blueprint $table) {
            $table->dropColumn('ma_het_han_luc');
        });
    }

    public function down(): void
    {
        Schema::table('ban_giao', function (Blueprint $table) {
            $table->dateTime('ma_het_han_luc')->nullable();
        });

        DB::table('ban_giao')->join('cuoc_hen', 'cuoc_hen.id', '=', 'ban_giao.cuoc_hen_id')
            ->where('cuoc_hen.trang_thai', 'cho_xac_nhan')
            ->whereNotNull('ban_giao.ma_ban_giao_hash')
            ->select('ban_giao.id', 'cuoc_hen.thoi_gian_hen_gap')
            ->eachById(function ($banGiao) {
                DB::table('ban_giao')->where('id', $banGiao->id)->update([
                    'ma_het_han_luc' => CarbonImmutable::parse($banGiao->thoi_gian_hen_gap)->addHours(24),
                ]);
            }, 500, 'ban_giao.id', 'id');
    }
};
