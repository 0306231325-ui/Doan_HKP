<?php

namespace Tests\Feature;

use Illuminate\Database\QueryException;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use Tests\TestCase;

class PhienBanLoiKhaiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Schema::create('cau_hoi', function (Blueprint $table) {
            $table->id();
        });
        Schema::create('lich_su_cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
        });
        Schema::create('loi_khai_tin_dang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $table->foreignId('cau_hoi_phien_ban_id')->nullable()->constrained('lich_su_cau_hoi');
            $table->text('gia_tri_text');
        });
        foreach ([1, 2] as $id) {
            DB::table('cau_hoi')->insert(['id' => $id]);
            DB::table('lich_su_cau_hoi')->insert(['id' => $id, 'cau_hoi_id' => $id]);
        }
        DB::table('loi_khai_tin_dang')->insert(['id' => 1, 'cau_hoi_id' => 1, 'cau_hoi_phien_ban_id' => 1, 'gia_tri_text' => 'Đen']);
    }

    public function test_bat_buoc_dung_phien_ban_cua_dung_cau_hoi_va_giu_du_lieu_cu(): void
    {
        $migration = require database_path('migrations/2026_11_04_000002_pin_loi_khai_question_version.php');
        $migration->up();
        foreach ([null, 2, 999] as $idBan) {
            try {
                DB::table('loi_khai_tin_dang')->insert(['cau_hoi_id' => 1, 'cau_hoi_phien_ban_id' => $idBan, 'gia_tri_text' => 'Sai']);
                $this->fail('Phải từ chối phiên bản trống, không tồn tại hoặc thuộc câu khác.');
            } catch (QueryException $loi) {
                $this->assertNotEmpty($loi->getMessage());
            }
        }
        DB::table('loi_khai_tin_dang')->insert(['cau_hoi_id' => 2, 'cau_hoi_phien_ban_id' => 2, 'gia_tri_text' => 'Đúng']);
        $this->assertDatabaseCount('loi_khai_tin_dang', 2);
        $this->assertDatabaseHas('loi_khai_tin_dang', ['id' => 1, 'cau_hoi_id' => 1, 'cau_hoi_phien_ban_id' => 1, 'gia_tri_text' => 'Đen']);
        $migration->down();
        DB::table('loi_khai_tin_dang')->insert(['cau_hoi_id' => 1, 'cau_hoi_phien_ban_id' => null, 'gia_tri_text' => 'Sau rollback']);
        $this->assertDatabaseCount('loi_khai_tin_dang', 3);
    }

    public function test_du_lieu_cu_chua_ro_phien_ban_phai_chan_truoc_khi_doi_schema(): void
    {
        DB::table('loi_khai_tin_dang')->where('id', 1)->update(['cau_hoi_phien_ban_id' => null]);
        $migration = require database_path('migrations/2026_11_04_000002_pin_loi_khai_question_version.php');
        try {
            $migration->up();
            $this->fail('Không tự gán phiên bản cho lời khai cũ.');
        } catch (RuntimeException $loi) {
            $this->assertStringContainsString('đối chiếu dữ liệu', $loi->getMessage());
        }
        $this->assertDatabaseHas('loi_khai_tin_dang', ['id' => 1, 'cau_hoi_phien_ban_id' => null, 'gia_tri_text' => 'Đen']);
        $this->assertFalse(Schema::hasIndex('lich_su_cau_hoi', 'uq_lich_su_id_cau_hoi'));
    }
}
