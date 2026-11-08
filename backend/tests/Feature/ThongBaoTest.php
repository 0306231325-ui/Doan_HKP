<?php

namespace Tests\Feature;

use App\Models\NguoiDung;
use App\Models\ThongBao;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ThongBaoTest extends TestCase
{
    private NguoiDung $chu;

    private NguoiDung $khac;

    protected function setUp(): void
    {
        parent::setUp();

        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');

        Schema::create('nguoi_dung', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('trang_thai')->default('hoat_dong');
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::create('tin_dang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nguoi_dung_id');
            $table->string('trang_thai_kiem_duyet');
            $table->softDeletes();
        });
        Schema::create('thong_bao', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nguoi_dung_id');
            $table->foreignId('tin_dang_id')->nullable();
            $table->string('loai_thong_bao');
            $table->string('tieu_de');
            $table->text('noi_dung');
            $table->dateTime('thoi_gian_doc')->nullable();
            $table->dateTime('created_at');
        });

        $this->chu = NguoiDung::create(['email' => 'chu@example.test', 'trang_thai' => 'hoat_dong']);
        $this->khac = NguoiDung::create(['email' => 'khac@example.test', 'trang_thai' => 'hoat_dong']);
    }

    private function taoThongBao(NguoiDung $nguoiDung, ?int $tin = null): ThongBao
    {
        return $nguoiDung->thongBao()->create([
            'tin_dang_id' => $tin, 'loai_thong_bao' => 'kiem_thu',
            'tieu_de' => 'Thông báo thử', 'noi_dung' => 'Nội dung thử',
        ]);
    }

    public function test_hop_thu_chi_tra_thong_bao_cua_phien_va_link_tin_xem_duoc(): void
    {
        $tinAnCuaChu = DB::table('tin_dang')->insertGetId(['nguoi_dung_id' => $this->chu->id, 'trang_thai_kiem_duyet' => 'da_an']);
        $tinAnCuaKhac = DB::table('tin_dang')->insertGetId(['nguoi_dung_id' => $this->khac->id, 'trang_thai_kiem_duyet' => 'da_an']);
        $tinDaXoa = DB::table('tin_dang')->insertGetId(['nguoi_dung_id' => $this->chu->id, 'trang_thai_kiem_duyet' => 'hien_thi', 'deleted_at' => now()]);
        $muc = $this->taoThongBao($this->chu, $tinAnCuaChu);
        $this->taoThongBao($this->chu, $tinAnCuaKhac);
        $this->taoThongBao($this->chu, $tinDaXoa);
        $this->taoThongBao($this->khac, $tinAnCuaChu);

        $this->getJson('/api/thong-bao')->assertUnauthorized();
        $this->actingAs($this->chu)->getJson('/api/thong-bao')->assertOk()
            ->assertJsonCount(3, 'data')->assertJsonPath('soChuaDoc', 3)
            ->assertJsonPath('data.0.duongDan', null)->assertJsonPath('data.1.duongDan', null)
            ->assertJsonPath('data.2.id', (string) $muc->id)->assertJsonPath('data.2.daDoc', false)
            ->assertJsonPath('data.2.duongDan', '/chi-tiet-tin-dang?id='.$tinAnCuaChu)
            ->assertJsonMissingPath('data.2.nguoi_dung_id');
    }

    public function test_danh_dau_doc_gioi_han_theo_nguoi_nhan_va_giu_moc_doc_dau(): void
    {
        $muc = $this->taoThongBao($this->chu);
        $mucKhac = $this->taoThongBao($this->khac);

        $this->actingAs($this->chu);
        $this->patchJson('/api/thong-bao/'.$mucKhac->id.'/da-doc')->assertNotFound();
        $this->freezeSecond(function () use ($muc) {
            $this->patchJson('/api/thong-bao/'.$muc->id.'/da-doc')->assertNoContent();
            $this->assertTrue($muc->fresh()->thoi_gian_doc->equalTo(now()));
        });

        $lanDau = $muc->fresh()->thoi_gian_doc;
        $this->travel(1)->minute();
        $this->patchJson('/api/thong-bao/'.$muc->id.'/da-doc')->assertNoContent();
        $this->assertTrue($muc->fresh()->thoi_gian_doc->equalTo($lanDau));
        $this->assertNull($mucKhac->fresh()->thoi_gian_doc);
    }

    public function test_dem_va_danh_dau_tat_ca_gom_ca_thong_bao_ngoai_20_muc_moi(): void
    {
        for ($i = 0; $i < 21; $i++) {
            $this->taoThongBao($this->chu);
        }
        $mucKhac = $this->taoThongBao($this->khac);

        $this->actingAs($this->chu)->getJson('/api/thong-bao')->assertOk()
            ->assertJsonCount(20, 'data')->assertJsonPath('soChuaDoc', 21);
        $this->patchJson('/api/thong-bao/da-doc')->assertNoContent();
        $this->getJson('/api/thong-bao')->assertOk()->assertJsonPath('soChuaDoc', 0)->assertJsonPath('data.0.daDoc', true);
        $this->assertNull($mucKhac->fresh()->thoi_gian_doc);
    }
}
