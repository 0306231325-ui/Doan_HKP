<?php

namespace Tests\Feature;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use Tests\TestCase;

class TachLichSuCauHoiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Schema::create('cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('danh_muc_id')->nullable();
            $table->string('ma_cau_hoi');
            $table->unsignedInteger('phien_ban');
            $table->string('noi_dung');
            $table->string('kieu_nhap');
            $table->json('lua_chon')->nullable();
            $table->string('nhan_nhan_lai')->nullable();
            $table->json('cau_hinh_ap_dung')->nullable();
            $table->string('loai_tin')->default('ca_hai');
            $table->boolean('bat_buoc')->default(false);
            $table->boolean('cong_khai')->default(true);
            $table->boolean('dung_xac_minh')->default(false);
            $table->boolean('trang_thai')->default(true);
            $table->unsignedInteger('thu_tu')->default(1);
            $table->timestamps();
            $table->unique(['ma_cau_hoi', 'phien_ban'], 'uq_cau_hoi_phien_ban');
        });
        Schema::create('loi_khai_tin_dang', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tin_dang_id');
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $table->text('gia_tri_text');
            $table->unique(['tin_dang_id', 'cau_hoi_id'], 'uq_loi_khai_tin_cau_hoi');
        });
        foreach ([1, 2] as $phienBan) {
            DB::table('cau_hoi')->insert([
                'id' => $phienBan, 'ma_cau_hoi' => 'mau-sac', 'phien_ban' => $phienBan,
                'noi_dung' => $phienBan === 1 ? 'Màu gì?' : 'Đặc điểm gì?',
                'kieu_nhap' => $phienBan === 1 ? 'chon_mot' : 'van_ban',
                'lua_chon' => $phienBan === 1 ? json_encode(['Đen', 'Trắng']) : null,
                'created_at' => '2026-11-01 10:00:00', 'updated_at' => '2026-11-01 10:00:00',
            ]);
            DB::table('loi_khai_tin_dang')->insert(['id' => $phienBan, 'tin_dang_id' => 7, 'cau_hoi_id' => $phienBan, 'gia_tri_text' => 'Đáp án '.$phienBan]);
        }
    }

    public function test_tach_lich_su_giu_dung_phien_ban_cho_tung_cau_tra_loi_va_rollback(): void
    {
        $migration = require database_path('migrations/2026_11_03_000003_separate_cau_hoi_history.php');
        $migration->up();
        $this->assertDatabaseCount('cau_hoi', 1);
        $this->assertDatabaseCount('lich_su_cau_hoi', 2);
        $this->assertDatabaseHas('cau_hoi', ['id' => 2, 'noi_dung' => 'Đặc điểm gì?']);
        foreach (['phien_ban', 'kieu_nhap', 'lua_chon', 'nhan_nhan_lai'] as $cot) {
            $this->assertFalse(Schema::hasColumn('cau_hoi', $cot));
        }
        foreach ([1, 2] as $id) {
            $loiKhai = DB::table('loi_khai_tin_dang')->find($id);
            $ban = DB::table('lich_su_cau_hoi')->find($loiKhai->cau_hoi_phien_ban_id);
            $this->assertEquals(2, $loiKhai->cau_hoi_id);
            $this->assertEquals($id, $ban->phien_ban);
            $this->assertSame('Đáp án '.$id, $loiKhai->gia_tri_text);
        }
        $cu = json_decode(DB::table('lich_su_cau_hoi')->where('phien_ban', 1)->value('du_lieu'), true);
        $this->assertSame(['Đen', 'Trắng'], $cu['lua_chon']);
        $migration->down();
        $this->assertFalse(Schema::hasTable('lich_su_cau_hoi'));
        $this->assertDatabaseCount('cau_hoi', 2);
        $this->assertDatabaseHas('cau_hoi', ['id' => 1, 'kieu_nhap' => 'chon_mot']);
        foreach ([1, 2] as $id) {
            $this->assertDatabaseHas('loi_khai_tin_dang', ['id' => $id, 'cau_hoi_id' => $id, 'gia_tri_text' => 'Đáp án '.$id]);
        }
    }

    public function test_khong_rollback_mat_du_lieu_khi_da_co_lich_su_theo_cau_truc_moi(): void
    {
        $migration = require database_path('migrations/2026_11_03_000003_separate_cau_hoi_history.php');
        $migration->up();
        DB::table('lich_su_cau_hoi')->insert(['cau_hoi_id' => 2, 'phien_ban' => 3, 'du_lieu' => json_encode(['noi_dung' => 'Câu mới'])]);
        try {
            $migration->down();
            $this->fail('Phải chặn rollback làm mất lịch sử mới.');
        } catch (RuntimeException $loi) {
            $this->assertStringContainsString('bản sao lưu', $loi->getMessage());
        }
        $this->assertDatabaseCount('lich_su_cau_hoi', 3);
        $this->assertFalse(Schema::hasColumn('cau_hoi', 'kieu_nhap'));
    }
}
