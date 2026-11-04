<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            $mariaDb = str_contains(strtolower(DB::selectOne('SELECT VERSION() AS v')->v), 'mariadb');
            foreach (['chk_cau_hoi_co', 'chk_cau_hoi_xac_minh'] as $ten) {
                DB::statement('ALTER TABLE cau_hoi DROP '.($mariaDb ? 'CONSTRAINT ' : 'CHECK ').$ten);
            }
        }
        Schema::table('cau_hoi', function (Blueprint $table) {
            $table->index(['danh_muc_id', 'trang_thai', 'thu_tu'], 'idx_cau_hoi_danh_muc');
        });
        Schema::table('cau_hoi', function (Blueprint $table) {
            $table->dropIndex('idx_cau_hoi_form');
            $table->dropColumn(['cau_hinh_ap_dung', 'loai_tin', 'bat_buoc', 'cong_khai', 'dung_xac_minh']);
        });
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE cau_hoi ADD CONSTRAINT chk_cau_hoi_trang_thai CHECK (trang_thai IN (0,1))');
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            $mariaDb = str_contains(strtolower(DB::selectOne('SELECT VERSION() AS v')->v), 'mariadb');
            DB::statement('ALTER TABLE cau_hoi DROP '.($mariaDb ? 'CONSTRAINT ' : 'CHECK ').'chk_cau_hoi_trang_thai');
        }
        Schema::table('cau_hoi', function (Blueprint $table) {
            $table->json('cau_hinh_ap_dung')->nullable();
            $table->string('loai_tin')->default('ca_hai');
            $table->boolean('bat_buoc')->default(false);
            $table->boolean('cong_khai')->default(false);
            $table->boolean('dung_xac_minh')->default(true);
            $table->index(['danh_muc_id', 'trang_thai', 'loai_tin', 'thu_tu'], 'idx_cau_hoi_form');
        });
        Schema::table('cau_hoi', function (Blueprint $table) {
            $table->dropIndex('idx_cau_hoi_danh_muc');
        });
        DB::table('cau_hoi')->whereNull('danh_muc_id')->update(['bat_buoc' => false, 'cong_khai' => true, 'dung_xac_minh' => false]);
        DB::table('cau_hoi')->whereNotNull('danh_muc_id')->update(['bat_buoc' => true, 'cong_khai' => false, 'dung_xac_minh' => true]);
        foreach (DB::table('cau_hoi')->orderBy('id')->get() as $cau) {
            $ban = DB::table('lich_su_cau_hoi')->where('cau_hoi_id', $cau->id)->orderByDesc('phien_ban')->first();
            $duLieu = $ban ? json_decode($ban->du_lieu, true, 512, JSON_THROW_ON_ERROR) : [];
            $cacCot = array_intersect_key($duLieu, array_flip(['cau_hinh_ap_dung', 'loai_tin', 'bat_buoc', 'cong_khai', 'dung_xac_minh']));
            if (is_array($cacCot['cau_hinh_ap_dung'] ?? null)) {
                $cacCot['cau_hinh_ap_dung'] = json_encode($cacCot['cau_hinh_ap_dung'], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
            }
            if ($cacCot) {
                DB::table('cau_hoi')->where('id', $cau->id)->update($cacCot);
            }
        }
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE cau_hoi ADD CONSTRAINT chk_cau_hoi_co CHECK (bat_buoc IN (0,1) AND cong_khai IN (0,1) AND dung_xac_minh IN (0,1) AND trang_thai IN (0,1))');
            DB::statement("ALTER TABLE cau_hoi ADD CONSTRAINT chk_cau_hoi_xac_minh CHECK (dung_xac_minh = 0 OR loai_tin <> 'bao_mat')");
        }
    }
};
