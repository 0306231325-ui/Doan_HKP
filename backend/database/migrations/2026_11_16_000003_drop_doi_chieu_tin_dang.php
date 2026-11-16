<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('doi_chieu_tin_dang')) {
            return;
        }

        DB::transaction(function () {
            DB::table('doi_chieu_tin_dang as doi_chieu')
                ->join('tin_dang as tin_nhat', 'tin_nhat.id', '=', 'doi_chieu.tin_nhat_id')
                ->join('tin_dang as tin_mat', 'tin_mat.id', '=', 'doi_chieu.tin_mat_id')
                ->leftJoin('yeu_cau_nhan_do as da_duyet', fn ($join) => $join
                    ->on('da_duyet.tin_dang_id', '=', 'tin_nhat.id')
                    ->where('da_duyet.trang_thai', 'da_xac_minh'))
                ->where('tin_nhat.loai_tin', 'nhat_duoc')
                ->where('tin_mat.loai_tin', 'bao_mat')
                ->whereNull('tin_nhat.tin_bao_mat_lien_quan_id')
                ->where(fn ($q) => $q->whereNull('da_duyet.id')
                    ->orWhereColumn('tin_mat.nguoi_dung_id', 'da_duyet.nguoi_yeu_cau_id'))
                ->selectRaw('doi_chieu.tin_nhat_id, MIN(doi_chieu.tin_mat_id) AS tin_mat_id')
                ->groupBy('doi_chieu.tin_nhat_id')
                ->havingRaw('COUNT(*) = 1')
                ->chunkById(200, function ($cacCap) {
                    foreach ($cacCap as $cap) {
                        DB::table('tin_dang')->where('id', $cap->tin_nhat_id)
                            ->whereNull('tin_bao_mat_lien_quan_id')
                            ->update(['tin_bao_mat_lien_quan_id' => $cap->tin_mat_id]);
                    }
                }, 'doi_chieu.tin_nhat_id', 'tin_nhat_id');
        });

        Schema::drop('doi_chieu_tin_dang');
    }

    public function down(): void
    {
        Schema::create('doi_chieu_tin_dang', function (Blueprint $table) {
            $table->foreignId('tin_nhat_id')->constrained('tin_dang')->cascadeOnDelete();
            $table->foreignId('tin_mat_id')->constrained('tin_dang')->cascadeOnDelete();
            $table->primary(['tin_nhat_id', 'tin_mat_id']);
        });

        DB::table('doi_chieu_tin_dang')->insertUsing(
            ['tin_nhat_id', 'tin_mat_id'],
            DB::table('tin_dang')->select('id', 'tin_bao_mat_lien_quan_id')->whereNotNull('tin_bao_mat_lien_quan_id'),
        );
    }
};
