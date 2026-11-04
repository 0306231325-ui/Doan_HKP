<?php

namespace Tests\Feature;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class BoCauHinhCauHoiTest extends TestCase
{
    public function test_bo_cac_cot_co_dinh_giu_cau_hoi_lich_su_va_lien_ket_tra_loi(): void
    {
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Schema::create('cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('danh_muc_id')->nullable();
            $table->string('noi_dung');
            $table->json('cau_hinh_ap_dung')->nullable();
            $table->string('loai_tin');
            $table->boolean('bat_buoc');
            $table->boolean('cong_khai');
            $table->boolean('dung_xac_minh');
            $table->boolean('trang_thai');
            $table->integer('thu_tu');
            $table->index(['danh_muc_id', 'trang_thai', 'loai_tin', 'thu_tu'], 'idx_cau_hoi_form');
        });
        Schema::create('lich_su_cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $table->integer('phien_ban');
            $table->json('du_lieu');
        });
        Schema::create('loi_khai_tin_dang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $table->foreignId('cau_hoi_phien_ban_id')->constrained('lich_su_cau_hoi');
            $table->text('gia_tri_text');
        });
        $cu = ['id' => 1, 'danh_muc_id' => 3, 'noi_dung' => 'Đặc điểm riêng?', 'cau_hinh_ap_dung' => json_encode(['mat' => ['suDung' => false]]), 'loai_tin' => 'nhat_duoc', 'bat_buoc' => true, 'cong_khai' => false, 'dung_xac_minh' => true, 'trang_thai' => false, 'thu_tu' => 2];
        DB::table('cau_hoi')->insert($cu);
        DB::table('lich_su_cau_hoi')->insert(['id' => 4, 'cau_hoi_id' => 1, 'phien_ban' => 1, 'du_lieu' => json_encode($cu)]);
        DB::table('loi_khai_tin_dang')->insert(['id' => 5, 'cau_hoi_id' => 1, 'cau_hoi_phien_ban_id' => 4, 'gia_tri_text' => 'Vết xước']);
        $migration = require database_path('migrations/2026_11_04_000001_drop_cau_hoi_configuration.php');
        $migration->up();
        foreach (['cau_hinh_ap_dung', 'loai_tin', 'bat_buoc', 'cong_khai', 'dung_xac_minh'] as $cot) {
            $this->assertFalse(Schema::hasColumn('cau_hoi', $cot));
        }
        $this->assertDatabaseHas('cau_hoi', ['id' => 1, 'danh_muc_id' => 3, 'noi_dung' => 'Đặc điểm riêng?', 'trang_thai' => false]);
        $this->assertDatabaseHas('loi_khai_tin_dang', ['id' => 5, 'cau_hoi_id' => 1, 'cau_hoi_phien_ban_id' => 4, 'gia_tri_text' => 'Vết xước']);
        $this->assertSame($cu, json_decode(DB::table('lich_su_cau_hoi')->value('du_lieu'), true));
        $migration->down();
        $this->assertDatabaseHas('cau_hoi', $cu);
    }
}
