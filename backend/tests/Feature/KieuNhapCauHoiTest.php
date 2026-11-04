<?php

namespace Tests\Feature;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class KieuNhapCauHoiTest extends TestCase
{
    public function test_them_kieu_mac_dinh_khong_doi_cau_hoi_va_snapshot_cu(): void
    {
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Schema::create('cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->string('noi_dung');
        });
        Schema::create('lich_su_cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $table->json('du_lieu');
        });
        DB::table('cau_hoi')->insert(['id' => 1, 'noi_dung' => 'Màu gì?']);
        $snapshot = json_encode(['id' => 1, 'noi_dung' => 'Màu gì?']);
        DB::table('lich_su_cau_hoi')->insert(['id' => 2, 'cau_hoi_id' => 1, 'du_lieu' => $snapshot]);
        $migration = require database_path('migrations/2026_11_04_000004_add_kieu_nhap_to_cau_hoi_table.php');
        $migration->up();
        $this->assertDatabaseHas('cau_hoi', ['id' => 1, 'noi_dung' => 'Màu gì?', 'kieu_nhap' => 'van_ban']);
        DB::table('cau_hoi')->insert(['id' => 3, 'noi_dung' => 'Số lượng?', 'kieu_nhap' => 'so']);
        $this->assertDatabaseHas('cau_hoi', ['id' => 3, 'kieu_nhap' => 'so']);
        $this->assertDatabaseHas('lich_su_cau_hoi', ['id' => 2, 'cau_hoi_id' => 1, 'du_lieu' => $snapshot]);
        $migration->down();
        $this->assertFalse(Schema::hasColumn('cau_hoi', 'kieu_nhap'));
        $this->assertDatabaseHas('cau_hoi', ['id' => 1, 'noi_dung' => 'Màu gì?']);
    }
}
