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
            $table->unsignedInteger('thu_tu')->nullable();
            $table->boolean('trang_thai')->default(true);
            $table->timestamps();
        });
        Schema::create('tin_dang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('danh_muc_id')->constrained('danh_muc_do_vat');
            $table->softDeletes();
        });
        Schema::create('cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('danh_muc_id')->nullable()->constrained('danh_muc_do_vat');
            $table->boolean('trang_thai')->default(true);
        });
        Schema::create('dia_diem', function (Blueprint $table) {
            $table->id();
            $table->string('ten_dia_diem');
            $table->boolean('trang_thai')->default(true);
        });

    }

    private function taiKhoan(string $vaiTro = 'quan_tri', string $trangThai = 'hoat_dong'): NguoiDung
    {
        return NguoiDung::create(['ho_ten' => 'Kiểm thử', 'email' => 'thu'.NguoiDung::count().'@example.test', 'mat_khau' => 'hash', 'vai_tro' => $vaiTro, 'trang_thai' => $trangThai]);
    }

    public function test_bao_ve_tat_ca_thao_tac_bang_quyen_quan_tri(): void
    {
        $cacYeuCau = [['GET', '/api/admin/danh-muc'], ['POST', '/api/admin/danh-muc'], ['PATCH', '/api/admin/danh-muc/1/trang-thai'], ['PATCH', '/api/admin/danh-muc/1/thu-tu'], ['DELETE', '/api/admin/danh-muc/1']];
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

    public function test_them_va_doc_lai_tu_db_khong_nhan_trang_thai_tu_client(): void
    {
        $this->actingAs($this->taiKhoan());
        $id = $this->postJson('/api/admin/danh-muc', ['tenDanhMuc' => '  Điện   thoại ', 'moTa' => ' Máy ', 'dangHoatDong' => false])->assertCreated()
            ->assertJsonPath('data.tenDanhMuc', 'Điện thoại')->assertJsonPath('data.moTa', 'Máy')->assertJsonPath('data.dangHoatDong', true)->json('data.id');
        $this->getJson('/api/admin/danh-muc')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $id)->assertJsonPath('data.0.tenDanhMuc', 'Điện thoại');
        $this->assertDatabaseHas('danh_muc_do_vat', ['id' => $id, 'ten_danh_muc' => 'Điện thoại', 'trang_thai' => true]);
        $this->getJson('/api/tra-cuu/bo-loc')->assertOk()->assertJsonPath('danhMuc.0.id', $id);
        $moi = $this->postJson('/api/admin/danh-muc', ['tenDanhMuc' => 'Sách'])->assertCreated()->assertJsonPath('data.moTa', '')->json('data.id');
        $this->getJson('/api/admin/danh-muc')->assertOk()->assertJsonPath('data.1.id', $moi);
    }

    public function test_hoan_doi_hai_danh_muc_giu_vi_tri_cac_muc_khac_va_dong_bo_bo_loc_cong_khai(): void
    {
        $this->actingAs($this->taiKhoan());
        $sach = DanhMucDoVat::create(['ten_danh_muc' => 'Sách']);
        $an = DanhMucDoVat::create(['ten_danh_muc' => 'Đã ẩn', 'trang_thai' => false]);
        $but = DanhMucDoVat::create(['ten_danh_muc' => 'Bút']);
        $vi = DanhMucDoVat::create(['ten_danh_muc' => 'Ví']);
        $url = '/api/admin/danh-muc/'.$but->id.'/thu-tu';
        $mau = ['viTri' => 1, 'danhSachHienTai' => [$sach->id, $an->id, $but->id, $vi->id]];
        $thuTuSauDoi = array_map('strval', [$but->id, $an->id, $sach->id, $vi->id]);

        $this->patchJson($url, [...$mau, 'viTri' => 5])->assertUnprocessable()->assertJsonValidationErrors('viTri');
        $this->patchJson($url, $mau)->assertOk()->assertJsonPath('data.*.id', $thuTuSauDoi);
        $this->assertDatabaseHas('danh_muc_do_vat', ['id' => $but->id, 'thu_tu' => 1]);
        $this->assertDatabaseHas('danh_muc_do_vat', ['id' => $an->id, 'thu_tu' => 2]);
        $this->assertDatabaseHas('danh_muc_do_vat', ['id' => $sach->id, 'thu_tu' => 3]);
        $this->assertDatabaseHas('danh_muc_do_vat', ['id' => $vi->id, 'thu_tu' => 4]);
        $this->getJson('/api/admin/danh-muc')->assertOk()->assertJsonPath('data.*.id', $thuTuSauDoi);
        $this->getJson('/api/tra-cuu/bo-loc')->assertOk()->assertJsonPath('danhMuc.*.id', array_map('strval', [$but->id, $sach->id, $vi->id]));
        $this->patchJson($url, $mau)->assertConflict();
        $this->patchJson($url, ['viTri' => 3, 'danhSachHienTai' => $thuTuSauDoi])->assertOk()
            ->assertJsonPath('data.*.id', array_map('strval', $mau['danhSachHienTai']));
    }

    public function test_them_chi_nhan_ten_va_mo_ta_hop_le_khong_trung(): void
    {
        $this->actingAs($this->taiKhoan());
        DanhMucDoVat::create(['ten_danh_muc' => 'Điện thoại', 'trang_thai' => false]);
        foreach (['  DIEN   THOAI ', 'Điện thoại'] as $ten) {
            $this->postJson('/api/admin/danh-muc', ['tenDanhMuc' => $ten])->assertUnprocessable()->assertJsonValidationErrors('tenDanhMuc');
        }
        $this->postJson('/api/admin/danh-muc', ['tenDanhMuc' => ' '])->assertUnprocessable()->assertJsonValidationErrors('tenDanhMuc');
        $this->postJson('/api/admin/danh-muc', ['tenDanhMuc' => str_repeat('a', 101), 'moTa' => str_repeat('b', 501)])->assertUnprocessable()->assertJsonValidationErrors(['tenDanhMuc', 'moTa']);
        $this->assertDatabaseCount('danh_muc_do_vat', 1);
    }

    public function test_khong_co_api_sua_ten_danh_muc(): void
    {
        $this->actingAs($this->taiKhoan());
        $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Sách', 'trang_thai' => true]);
        $this->putJson('/api/admin/danh-muc/'.$muc->id, ['tenDanhMuc' => 'Tên khác'])->assertStatus(405);
        $this->assertSame('Sách', $muc->fresh()->ten_danh_muc);
        $this->assertTrue($muc->fresh()->trang_thai);
    }

    public function test_an_mo_luu_db_dong_bo_bo_loc_va_khong_sua_ten_mo_ta(): void
    {
        $this->actingAs($this->taiKhoan());
        $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Sách', 'mo_ta' => 'Sách và vở', 'trang_thai' => true]);
        $url = '/api/admin/danh-muc/'.$muc->id.'/trang-thai';
        $this->patchJson($url, ['dangHoatDong' => false, 'trangThaiHienTai' => true, 'tenDanhMuc' => 'Ghi đè', 'moTa' => 'Sai'])->assertOk()
            ->assertJsonPath('data.id', (string) $muc->id)->assertJsonPath('data.dangHoatDong', false)->assertJsonPath('data.tenDanhMuc', 'Sách')->assertJsonPath('data.moTa', 'Sách và vở');
        $this->assertFalse($muc->fresh()->trang_thai);
        $this->patchJson($url, ['dangHoatDong' => false, 'trangThaiHienTai' => true])->assertOk()->assertJsonPath('data.dangHoatDong', false);
        $this->getJson('/api/admin/danh-muc')->assertOk()->assertJsonPath('data.0.dangHoatDong', false);
        $this->getJson('/api/tra-cuu/bo-loc')->assertOk()->assertJsonCount(0, 'danhMuc');
        $this->patchJson($url, ['dangHoatDong' => true, 'trangThaiHienTai' => false])->assertOk()->assertJsonPath('data.dangHoatDong', true);
        $this->assertTrue($muc->fresh()->trang_thai);
        $this->patchJson($url, ['dangHoatDong' => true, 'trangThaiHienTai' => false])->assertOk()->assertJsonPath('data.dangHoatDong', true);
        $this->getJson('/api/tra-cuu/bo-loc')->assertOk()->assertJsonPath('danhMuc.0.id', (string) $muc->id);
        $this->assertDatabaseCount('danh_muc_do_vat', 1);
    }

    public function test_an_mo_chan_du_lieu_sai_trang_thai_cu_va_id_khong_ton_tai(): void
    {
        $this->actingAs($this->taiKhoan());
        $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Sách', 'trang_thai' => false]);
        $url = '/api/admin/danh-muc/'.$muc->id.'/trang-thai';
        $this->patchJson($url, ['dangHoatDong' => true, 'trangThaiHienTai' => true])->assertConflict();
        $this->assertFalse($muc->fresh()->trang_thai);
        $this->patchJson($url, [])->assertUnprocessable()->assertJsonValidationErrors(['dangHoatDong', 'trangThaiHienTai']);
        $this->patchJson($url, ['dangHoatDong' => 'sai', 'trangThaiHienTai' => false])->assertUnprocessable();
        $this->patchJson('/api/admin/danh-muc/999/trang-thai', ['dangHoatDong' => true, 'trangThaiHienTai' => false])->assertNotFound();
    }

    public function test_xoa_danh_muc_chua_su_dung_khoi_db_va_bo_loc(): void
    {
        $this->actingAs($this->taiKhoan());
        $giuLai = DanhMucDoVat::create(['ten_danh_muc' => 'Giữ lại']);
        foreach ([true, false] as $trangThai) {
            $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Xóa '.(int) $trangThai, 'trang_thai' => $trangThai]);
            $this->deleteJson('/api/admin/danh-muc/'.$muc->id)->assertOk();
            $this->assertDatabaseMissing('danh_muc_do_vat', ['id' => $muc->id]);
        }
        $this->getJson('/api/admin/danh-muc')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', (string) $giuLai->id);
        $this->getJson('/api/tra-cuu/bo-loc')->assertOk()->assertJsonCount(1, 'danhMuc');
        $this->deleteJson('/api/admin/danh-muc/999')->assertNotFound();
    }

    public function test_khong_xoa_danh_muc_co_tin_ke_ca_tin_da_xoa_mem(): void
    {
        $this->actingAs($this->taiKhoan());
        foreach ([null, now()] as $deletedAt) {
            $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Có tin '.DanhMucDoVat::count()]);
            DB::table('tin_dang')->insert(['danh_muc_id' => $muc->id, 'deleted_at' => $deletedAt]);
            $this->deleteJson('/api/admin/danh-muc/'.$muc->id)->assertConflict();
            $this->assertDatabaseHas('danh_muc_do_vat', ['id' => $muc->id]);
            $this->assertDatabaseHas('tin_dang', ['danh_muc_id' => $muc->id]);
        }
    }

    public function test_khong_xoa_danh_muc_co_cau_hoi_ke_ca_da_an(): void
    {
        $this->actingAs($this->taiKhoan());
        foreach ([true, false] as $trangThai) {
            $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Có câu hỏi '.(int) $trangThai]);
            DB::table('cau_hoi')->insert(['danh_muc_id' => $muc->id, 'trang_thai' => $trangThai]);
            $this->deleteJson('/api/admin/danh-muc/'.$muc->id)->assertConflict();
            $this->assertDatabaseHas('danh_muc_do_vat', ['id' => $muc->id]);
            $this->assertDatabaseHas('cau_hoi', ['danh_muc_id' => $muc->id]);
        }
    }
}
