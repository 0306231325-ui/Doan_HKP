<?php

namespace Tests\Feature;

use App\Models\DanhMucDoVat;
use App\Models\NguoiDung;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class QuanLyCauHoiTest extends TestCase
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
            $table->string('ten_danh_muc');
            $table->boolean('trang_thai')->default(true);
            $table->timestamps();
        });
        Schema::create('cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('danh_muc_id')->nullable()->constrained('danh_muc_do_vat');
            $table->string('noi_dung');
            $table->enum('kieu_nhap', ['van_ban', 'so'])->default('van_ban');
            $table->boolean('trang_thai');
            $table->integer('thu_tu');
            $table->timestamps();
        });
        Schema::create('lich_su_cau_hoi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $table->unsignedInteger('phien_ban');
            $table->json('du_lieu');
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['cau_hoi_id', 'phien_ban']);
        });
        Schema::create('loi_khai_tin_dang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cau_hoi_id')->constrained('cau_hoi');
            $table->foreignId('cau_hoi_phien_ban_id')->nullable()->constrained('lich_su_cau_hoi');
            $table->string('gia_tri_text');
        });
    }

    private function taiKhoan(string $vaiTro = 'quan_tri', string $trangThai = 'hoat_dong'): NguoiDung
    {
        return NguoiDung::create(['ho_ten' => 'Kiểm thử', 'email' => 'thu'.NguoiDung::count().'@example.test', 'mat_khau' => 'hash', 'vai_tro' => $vaiTro, 'trang_thai' => $trangThai]);
    }

    private function mau(?int $danhMucId = null): array
    {

        return ['danhMucId' => $danhMucId, 'nhanDangTin' => 'Đồ vật có màu gì?', 'kieuNhap' => 'van_ban', 'thuTu' => 1, 'dangHoatDong' => true];
    }

    public function test_bao_ve_doc_va_ghi_bang_quyen_quan_tri(): void
    {
        $cacYeuCau = [['GET', '/api/admin/cau-hoi'], ['POST', '/api/admin/cau-hoi'], ['PUT', '/api/admin/cau-hoi/1'], ['PATCH', '/api/admin/cau-hoi/1/trang-thai'], ['DELETE', '/api/admin/cau-hoi/1']];
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

    public function test_them_cau_chung_luu_db_ca_hai_loai_tin_khong_bat_buoc_va_doc_lai(): void
    {
        $this->actingAs($this->taiKhoan());
        $mau = $this->mau();
        $mau['apDung']['mat']['suDung'] = false;
        $mau['apDung']['nhat']['batBuoc'] = true;
        $mau['dangHoatDong'] = false;
        $mau['maCauHoi'] = 'gia';
        $mau['phienBan'] = 88;
        $cau = $this->postJson('/api/admin/cau-hoi', $mau)->assertCreated()->assertJsonPath('data.danhMucId', null)
            ->assertJsonPath('data.phienBan', 1)->assertJsonPath('data.dangHoatDong', true)
            ->assertJsonMissingPath('data.apDung')->json('data');
        $this->assertArrayNotHasKey('maCauHoi', $cau);
        $this->assertFalse(Schema::hasColumn('cau_hoi', 'ma_cau_hoi'));
        $this->assertDatabaseHas('cau_hoi', ['id' => $cau['id'], 'danh_muc_id' => null]);
        $this->getJson('/api/admin/cau-hoi')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $cau['id']);
    }

    public function test_sua_tao_phien_ban_moi_khong_doi_cau_tra_loi_va_chan_ban_cu(): void
    {
        $this->actingAs($this->taiKhoan());
        $danhMuc = DanhMucDoVat::create(['ten_danh_muc' => 'Điện tử']);
        $cu = $this->postJson('/api/admin/cau-hoi', $this->mau())->assertCreated()->json('data');
        $snapshotCu = DB::table('lich_su_cau_hoi')->where('id', $cu['lichSu'][0]['id'])->value('du_lieu');
        $snapshotCu = json_decode($snapshotCu, true);
        unset($snapshotCu['kieu_nhap']);
        DB::table('lich_su_cau_hoi')->where('id', $cu['lichSu'][0]['id'])->update(['du_lieu' => json_encode($snapshotCu)]);
        DB::table('loi_khai_tin_dang')->insert(['cau_hoi_id' => $cu['id'], 'cau_hoi_phien_ban_id' => $cu['lichSu'][0]['id'], 'gia_tri_text' => 'Đen']);
        $mau = $this->mau($danhMuc->id);
        $mau['nhanDangTin'] = 'Thiết bị có màu gì?';
        $mau['phienBan'] = 1;
        $mau['kieuNhap'] = 'so';
        $moi = $this->putJson('/api/admin/cau-hoi/'.$cu['id'], $mau)->assertOk()->assertJsonPath('data.phienBan', 2)->assertJsonMissingPath('data.maCauHoi')->json('data');
        $this->assertSame($cu['id'], $moi['id']);
        $this->assertSame($cu['nhanDangTin'], $moi['lichSu'][0]['nhanDangTin']);
        $this->assertSame('so', $moi['kieuNhap']);
        $this->assertSame('van_ban', $moi['lichSu'][0]['kieuNhap']);
        $this->assertSame('so', $moi['lichSu'][1]['kieuNhap']);
        $this->assertDatabaseHas('cau_hoi', ['id' => $cu['id'], 'noi_dung' => $mau['nhanDangTin'], 'danh_muc_id' => $danhMuc->id]);
        $this->assertDatabaseHas('loi_khai_tin_dang', ['cau_hoi_id' => $cu['id'], 'cau_hoi_phien_ban_id' => $cu['lichSu'][0]['id'], 'gia_tri_text' => 'Đen']);
        $this->getJson('/api/admin/cau-hoi')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.coCauTraLoi', true);
        $this->putJson('/api/admin/cau-hoi/'.$moi['id'], [...$mau, 'phienBan' => 2])->assertOk()->assertJsonPath('daThayDoi', false);
        $this->assertDatabaseCount('cau_hoi', 1);
        $this->assertDatabaseCount('lich_su_cau_hoi', 2);
        $this->putJson('/api/admin/cau-hoi/'.$cu['id'], $mau)->assertConflict();
        $this->patchJson('/api/admin/cau-hoi/'.$cu['id'].'/trang-thai', ['phienBan' => 1, 'dangHoatDong' => false, 'trangThaiHienTai' => true])->assertConflict();
        $this->deleteJson('/api/admin/cau-hoi/'.$moi['id'], ['phienBan' => 2])->assertConflict();
    }

    public function test_chan_ten_trung_trong_pham_vi_giao_nhau_ke_ca_cau_an(): void
    {
        $this->actingAs($this->taiKhoan());
        $a = DanhMucDoVat::create(['ten_danh_muc' => 'Điện tử']);
        $b = DanhMucDoVat::create(['ten_danh_muc' => 'Giấy tờ']);
        $cu = $this->postJson('/api/admin/cau-hoi', $this->mau($a->id))->assertCreated()->json('data');
        $this->postJson('/api/admin/cau-hoi', $this->mau($b->id))->assertCreated();
        $this->patchJson('/api/admin/cau-hoi/'.$cu['id'].'/trang-thai', ['phienBan' => 1, 'dangHoatDong' => false, 'trangThaiHienTai' => true])->assertOk();
        $mau = $this->mau($a->id);
        $mau['nhanDangTin'] = ' DO VAT CO MAU GI? ';
        $this->postJson('/api/admin/cau-hoi', $mau)->assertUnprocessable()->assertJsonValidationErrors('nhanDangTin');
        $this->postJson('/api/admin/cau-hoi', $this->mau())->assertUnprocessable()->assertJsonValidationErrors('nhanDangTin');
        $this->assertDatabaseCount('cau_hoi', 2);
    }

    public function test_cau_rieng_kiem_tra_danh_muc_va_cau_chung_chan_trung_cau_rieng(): void
    {
        $this->actingAs($this->taiKhoan());
        $ngung = DanhMucDoVat::create(['ten_danh_muc' => 'Ngừng', 'trang_thai' => false]);
        foreach ([999, $ngung->id] as $id) {
            $this->postJson('/api/admin/cau-hoi', $this->mau($id))->assertUnprocessable()->assertJsonValidationErrors('danhMucId');
        }
        $this->postJson('/api/admin/cau-hoi', $this->mau())->assertCreated();
        $ngung->update(['trang_thai' => true]);
        $this->postJson('/api/admin/cau-hoi', $this->mau($ngung->id))->assertUnprocessable()->assertJsonValidationErrors('nhanDangTin');
    }

    public function test_cau_rieng_luu_kieu_nhap_khong_nhan_cau_hinh_cu(): void
    {
        $this->actingAs($this->taiKhoan());
        $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Điện tử']);
        $mau = $this->mau($muc->id);
        $mau['apDung']['mat']['batBuoc'] = true;
        $mau['apDung']['nhat'] = ['suDung' => true, 'batBuoc' => false, 'congKhai' => false, 'dungXacMinh' => true, 'batBuocNhanLai' => true];
        $mau['nhanNhanLai'] = 'Đồ của bạn có màu gì?';
        $mau['kieuNhap'] = 'so';
        $mau['luaChon'] = [['id' => 'den', 'nhan' => 'Đen'], ['id' => 'trang', 'nhan' => 'Trắng']];
        $cau = $this->postJson('/api/admin/cau-hoi', $mau)->assertCreated()->json('data');
        $this->assertArrayNotHasKey('apDung', $cau);
        $this->assertArrayNotHasKey('apDung', $cau['lichSu'][0]);
        foreach (['luaChon', 'nhanNhanLai'] as $truong) {
            $this->assertArrayNotHasKey($truong, $cau);
        }
        foreach (['lua_chon', 'nhan_nhan_lai', 'phien_ban', 'cau_hinh_ap_dung', 'loai_tin', 'bat_buoc', 'cong_khai', 'dung_xac_minh'] as $cot) {
            $this->assertFalse(Schema::hasColumn('cau_hoi', $cot));
        }
        $this->assertDatabaseHas('cau_hoi', ['id' => $cau['id'], 'kieu_nhap' => 'so']);
        $this->assertSame('so', $cau['lichSu'][0]['kieuNhap']);
    }

    public function test_validate_noi_dung_va_khong_ghi_do_dang_khi_du_lieu_sai(): void
    {
        $this->actingAs($this->taiKhoan());
        $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Điện tử']);
        foreach ([['kieuNhap', 'chon_mot'], ['kieuNhap', 'doan_van'], ['kieuNhap', ''], ['nhanDangTin', ' '], ['thuTu', 0], ['nhanDangTin', str_repeat('a', 251)]] as [$ten, $giaTri]) {
            $mau = $this->mau($muc->id);
            $mau[$ten] = $giaTri;
            $this->postJson('/api/admin/cau-hoi', $mau)->assertUnprocessable()->assertJsonValidationErrors($ten);
        }
        $this->assertDatabaseCount('cau_hoi', 0);
    }

    public function test_an_mo_va_chan_mo_khi_danh_muc_ngung(): void
    {
        $this->actingAs($this->taiKhoan());
        $muc = DanhMucDoVat::create(['ten_danh_muc' => 'Điện tử']);
        $cau = $this->postJson('/api/admin/cau-hoi', $this->mau($muc->id))->assertCreated()->json('data');
        $url = '/api/admin/cau-hoi/'.$cau['id'].'/trang-thai';
        $this->patchJson($url, ['phienBan' => 1, 'dangHoatDong' => false, 'trangThaiHienTai' => true])->assertOk()->assertJsonPath('data.dangHoatDong', false);
        $this->patchJson($url, ['phienBan' => 1, 'dangHoatDong' => false, 'trangThaiHienTai' => true])->assertOk();
        $this->patchJson($url, ['phienBan' => 1, 'dangHoatDong' => true, 'trangThaiHienTai' => true])->assertConflict();
        $muc->update(['trang_thai' => false]);
        $this->patchJson($url, ['phienBan' => 1, 'dangHoatDong' => true, 'trangThaiHienTai' => false])->assertConflict();
        $muc->update(['trang_thai' => true]);
        $this->patchJson($url, ['phienBan' => 1, 'dangHoatDong' => true, 'trangThaiHienTai' => false])->assertOk()->assertJsonPath('data.dangHoatDong', true);
        $this->assertDatabaseCount('cau_hoi', 1);
    }

    public function test_xoa_chi_cau_chua_dung_va_khong_xoa_cau_tra_loi(): void
    {
        $this->actingAs($this->taiKhoan());
        $cau = $this->postJson('/api/admin/cau-hoi', $this->mau())->assertCreated()->json('data');
        DB::table('loi_khai_tin_dang')->insert(['cau_hoi_id' => $cau['id'], 'gia_tri_text' => 'Đen']);
        $this->deleteJson('/api/admin/cau-hoi/'.$cau['id'], ['phienBan' => 1])->assertConflict();
        $this->assertDatabaseCount('loi_khai_tin_dang', 1);
        $mau = $this->mau();
        $mau['nhanDangTin'] = 'Tên đồ vật?';
        $khac = $this->postJson('/api/admin/cau-hoi', $mau)->assertCreated()->json('data');
        $this->deleteJson('/api/admin/cau-hoi/'.$khac['id'], ['phienBan' => 1])->assertOk();
        $this->assertDatabaseMissing('cau_hoi', ['id' => $khac['id']]);
        $this->deleteJson('/api/admin/cau-hoi/999', ['phienBan' => 1])->assertNotFound();
        $this->putJson('/api/admin/cau-hoi/999', [...$mau, 'phienBan' => 1])->assertNotFound();
        $this->patchJson('/api/admin/cau-hoi/999/trang-thai', ['phienBan' => 1, 'dangHoatDong' => false, 'trangThaiHienTai' => true])->assertNotFound();
    }

    public function test_khong_con_api_nhap_cau_hoi_local_cu(): void
    {
        $this->actingAs($this->taiKhoan());
        $this->postJson('/api/admin/cau-hoi/nhap', ['danhSach' => []])->assertNotFound();
    }
}
