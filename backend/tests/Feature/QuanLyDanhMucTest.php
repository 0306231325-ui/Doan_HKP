<?php

namespace Tests\Feature;

use App\Models\DanhMucDoVat;
use App\Models\NguoiDung;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class QuanLyDanhMucTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Schema::create('nguoi_dung', function (Blueprint $table) {
            $table->id();
            foreach (['ho_ten', 'email', 'mat_khau', 'vai_tro', 'trang_thai'] as $cot) {
                $table->string($cot);
            }
            $table->dateTime('khoa_den_ngay')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::create('danh_muc_do_vat', function (Blueprint $table) {
            $table->id();
            $table->string('ten_danh_muc')->unique();
            $table->text('mo_ta')->nullable();
            $table->boolean('trang_thai')->default(true);
            $table->timestamps();
        });
        Schema::create('dia_diem', function (Blueprint $table) {
            $table->id();
            $table->string('ten_dia_diem');
            $table->boolean('trang_thai')->default(true);
        });
        Schema::create('tin_dang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('danh_muc_id')->constrained('danh_muc_do_vat');
            $table->string('trang_thai_kiem_duyet')->default('hien_thi');
            $table->softDeletes();
        });
    }

    private function taiKhoan(string $vaiTro = 'quan_tri', string $trangThai = 'hoat_dong'): NguoiDung
    {
        return NguoiDung::create(['ho_ten' => 'Kiểm thử', 'email' => 'thu'.NguoiDung::count().'@example.test', 'mat_khau' => 'hash', 'vai_tro' => $vaiTro, 'trang_thai' => $trangThai]);
    }

    public function test_bao_ve_tat_ca_thao_tac_bang_quyen_quan_tri(): void
    {
        $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Sách']);
        $cacYeuCau = [['GET', '/api/admin/danh-muc'], ['POST', '/api/admin/danh-muc'], ['PUT', '/api/admin/danh-muc/'.$muc->id], ['PATCH', '/api/admin/danh-muc/'.$muc->id.'/trang-thai']];
        foreach ($cacYeuCau as [$method, $url]) {
            $this->json($method, $url)->assertUnauthorized();
        }
        foreach ([$this->taiKhoan('nguoi_dung'), $this->taiKhoan('quan_tri', 'bi_khoa')] as $user) {
            $this->actingAs($user);
            foreach ($cacYeuCau as [$method, $url]) {
                $this->json($method, $url)->assertForbidden();
            }
        }
    }

    public function test_them_sua_doc_lai_tu_db_va_khong_cho_ghi_trang_thai_qua_form(): void
    {
        $this->actingAs($this->taiKhoan());
        $id = $this->postJson('/api/admin/danh-muc', ['tenDanhMuc' => '  Điện   thoại ', 'moTa' => ' Máy ', 'dangHoatDong' => false])->assertCreated()
            ->assertJsonPath('data.tenDanhMuc', 'Điện thoại')->assertJsonPath('data.moTa', 'Máy')->assertJsonPath('data.dangHoatDong', true)->assertJsonPath('data.soTin', 0)->json('data.id');
        $this->putJson('/api/admin/danh-muc/'.$id, ['tenDanhMuc' => 'Thiết bị', 'moTa' => '', 'dangHoatDong' => false])->assertOk()->assertJsonPath('data.id', $id);
        $this->getJson('/api/admin/danh-muc')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.tenDanhMuc', 'Thiết bị')->assertJsonPath('data.0.dangHoatDong', true);
        $this->assertDatabaseHas('danh_muc_do_vat', ['id' => $id, 'ten_danh_muc' => 'Thiết bị', 'trang_thai' => true]);
    }

    public function test_validate_ten_trung_khong_dau_khoang_trang_ke_ca_danh_muc_da_ngung(): void
    {
        $this->actingAs($this->taiKhoan());
        $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Điện thoại', 'trang_thai' => false]);
        foreach (['  DIEN   THOAI ', 'Điện thoại'] as $ten) {
            $this->postJson('/api/admin/danh-muc', ['tenDanhMuc' => $ten])->assertUnprocessable()->assertJsonValidationErrors('tenDanhMuc');
        }
        $this->postJson('/api/admin/danh-muc', ['tenDanhMuc' => ' '])->assertUnprocessable();
        $this->postJson('/api/admin/danh-muc', ['tenDanhMuc' => str_repeat('a', 101), 'moTa' => str_repeat('b', 501)])->assertUnprocessable()->assertJsonValidationErrors(['tenDanhMuc', 'moTa']);
        $this->putJson('/api/admin/danh-muc/'.$muc->id, ['tenDanhMuc' => $muc->ten_danh_muc])->assertOk();
        $khac = DanhMucDoVat::create(['ten_danh_muc' => 'Sách']);
        $this->putJson('/api/admin/danh-muc/'.$khac->id, ['tenDanhMuc' => 'dien thoai'])->assertUnprocessable();
        $this->putJson('/api/admin/danh-muc/999', ['tenDanhMuc' => 'Mới'])->assertNotFound();
    }

    public function test_ngung_mo_lai_giu_tin_cu_dem_tin_chua_xoa_va_dong_bo_bo_loc_cong_khai(): void
    {
        $this->actingAs($this->taiKhoan());
        $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Chìa khóa']);
        DB::table('tin_dang')->insert([
            ['danh_muc_id' => $muc->id, 'trang_thai_kiem_duyet' => 'hien_thi', 'deleted_at' => null],
            ['danh_muc_id' => $muc->id, 'trang_thai_kiem_duyet' => 'da_an', 'deleted_at' => null],
            ['danh_muc_id' => $muc->id, 'trang_thai_kiem_duyet' => 'hien_thi', 'deleted_at' => now()],
        ]);
        $url = '/api/admin/danh-muc/'.$muc->id.'/trang-thai';
        $this->patchJson($url, ['dangHoatDong' => false, 'trangThaiHienTai' => true])->assertOk()->assertJsonPath('data.soTin', 2)->assertJsonPath('data.dangHoatDong', false);
        $this->getJson('/api/tra-cuu/bo-loc')->assertOk()->assertJsonCount(0, 'danhMuc');
        $this->assertDatabaseCount('tin_dang', 3);
        $this->patchJson($url, ['dangHoatDong' => true, 'trangThaiHienTai' => false])->assertOk()->assertJsonPath('data.soTin', 2);
        $this->getJson('/api/tra-cuu/bo-loc')->assertOk()->assertJsonPath('danhMuc.0.id', (string) $muc->id);
        $this->getJson('/api/admin/danh-muc')->assertOk()->assertJsonPath('data.0.soTin', 2);
    }

    public function test_chan_trang_thai_cu_sai_va_id_khong_ton_tai(): void
    {
        $this->actingAs($this->taiKhoan());
        $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Sách', 'trang_thai' => false]);
        $url = '/api/admin/danh-muc/'.$muc->id.'/trang-thai';
        $this->patchJson($url, ['dangHoatDong' => true, 'trangThaiHienTai' => true])->assertConflict();
        $this->assertFalse($muc->fresh()->trang_thai);
        $this->patchJson($url, ['dangHoatDong' => 'sai'])->assertUnprocessable();
        $this->patchJson('/api/admin/danh-muc/999/trang-thai', ['dangHoatDong' => true, 'trangThaiHienTai' => false])->assertNotFound();
    }
}
