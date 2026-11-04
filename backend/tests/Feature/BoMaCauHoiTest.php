<?php

namespace Tests\Feature;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class BoMaCauHoiTest extends TestCase
{
    public function test_bo_ma_giu_id_noi_dung_lich_su_va_cac_cau_tra_loi(): void
    {
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Schema::create('cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->string('ma_cau_hoi', 64);
            $table->string('noi_dung');
            $table->unique('ma_cau_hoi', 'uq_cau_hoi_ma');
        });
        Schema::create('lich_su_cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $table->json('du_lieu');
        });
        Schema::create('loi_khai_tin_dang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $table->foreignId('cau_hoi_phien_ban_id')->constrained('lich_su_cau_hoi');
            $table->text('gia_tri_text');
        });
        Schema::create('tra_loi_yeu_cau', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loi_khai_tin_dang_id')->constrained('loi_khai_tin_dang');
            $table->text('gia_tri_text');
        });
        DB::table('cau_hoi')->insert([['id' => 1, 'ma_cau_hoi' => 'cu-a', 'noi_dung' => 'Màu sắc?'], ['id' => 2, 'ma_cau_hoi' => 'cu-b', 'noi_dung' => 'Đặc điểm?']]);
        $snapshot = json_encode(['id' => 1, 'ma_cau_hoi' => 'cu-a', 'noi_dung' => 'Màu sắc?']);
        DB::table('lich_su_cau_hoi')->insert(['id' => 3, 'cau_hoi_id' => 1, 'du_lieu' => $snapshot]);
        DB::table('loi_khai_tin_dang')->insert(['id' => 4, 'cau_hoi_id' => 1, 'cau_hoi_phien_ban_id' => 3, 'gia_tri_text' => 'Đen']);
        DB::table('tra_loi_yeu_cau')->insert(['id' => 5, 'loi_khai_tin_dang_id' => 4, 'gia_tri_text' => 'Đen nhám']);
        $migration = require database_path('migrations/2026_11_04_000003_drop_ma_cau_hoi.php');
        $migration->up();
        $this->assertFalse(Schema::hasColumn('cau_hoi', 'ma_cau_hoi'));
        $this->assertFalse(Schema::hasIndex('cau_hoi', 'uq_cau_hoi_ma'));
        $this->assertDatabaseCount('cau_hoi', 2);
        $this->assertDatabaseHas('cau_hoi', ['id' => 1, 'noi_dung' => 'Màu sắc?']);
        $this->assertDatabaseHas('cau_hoi', ['id' => 2, 'noi_dung' => 'Đặc điểm?']);
        $this->assertDatabaseHas('lich_su_cau_hoi', ['id' => 3, 'cau_hoi_id' => 1, 'du_lieu' => $snapshot]);
        $this->assertDatabaseHas('loi_khai_tin_dang', ['id' => 4, 'cau_hoi_id' => 1, 'cau_hoi_phien_ban_id' => 3, 'gia_tri_text' => 'Đen']);
        $this->assertDatabaseHas('tra_loi_yeu_cau', ['id' => 5, 'loi_khai_tin_dang_id' => 4, 'gia_tri_text' => 'Đen nhám']);
        $migration->down();
        $this->assertTrue(Schema::hasIndex('cau_hoi', 'uq_cau_hoi_ma'));
        $this->assertDatabaseHas('cau_hoi', ['id' => 1, 'ma_cau_hoi' => 'cau-hoi-1', 'noi_dung' => 'Màu sắc?']);
        $this->assertDatabaseHas('cau_hoi', ['id' => 2, 'ma_cau_hoi' => 'cau-hoi-2', 'noi_dung' => 'Đặc điểm?']);
    }
}
