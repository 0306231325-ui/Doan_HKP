<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $sai = DB::table('loi_khai_tin_dang as loi_khai')
            ->leftJoin('lich_su_cau_hoi as ban', 'ban.id', '=', 'loi_khai.cau_hoi_phien_ban_id')
            ->where(function ($truyVan) {
                $truyVan->whereNull('ban.id')->orWhereColumn('ban.cau_hoi_id', '<>', 'loi_khai.cau_hoi_id');
            })->exists();
        if ($sai) {
            throw new RuntimeException('Có lời khai chưa gắn đúng phiên bản câu hỏi. Cần đối chiếu dữ liệu trước khi ràng buộc, không tự gán phiên bản hiện tại.');
        }
        Schema::table('lich_su_cau_hoi', function (Blueprint $table) {
            $table->unique(['id', 'cau_hoi_id'], 'uq_lich_su_id_cau_hoi');
        });
        Schema::table('loi_khai_tin_dang', function (Blueprint $table) {
            $table->unsignedBigInteger('cau_hoi_phien_ban_id')->nullable(false)->change();
            $table->foreign(['cau_hoi_phien_ban_id', 'cau_hoi_id'], 'fk_loi_khai_phien_ban_cau_hoi')->references(['id', 'cau_hoi_id'])->on('lich_su_cau_hoi');
        });
    }

    public function down(): void
    {
        Schema::table('loi_khai_tin_dang', function (Blueprint $table) {
            $table->dropForeign(DB::getDriverName() === 'sqlite' ? ['cau_hoi_phien_ban_id', 'cau_hoi_id'] : 'fk_loi_khai_phien_ban_cau_hoi');
            $table->unsignedBigInteger('cau_hoi_phien_ban_id')->nullable()->change();
        });
        Schema::table('lich_su_cau_hoi', function (Blueprint $table) {
            $table->dropUnique('uq_lich_su_id_cau_hoi');
        });
    }
};
