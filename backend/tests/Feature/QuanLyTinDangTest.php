<?php

namespace Tests\Feature;

use App\Models\NguoiDung;
use App\Models\TinDang;
use App\Models\BaoCaoTinDang;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class QuanLyTinDangTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Schema::create('nguoi_dung', function (Blueprint $t) {
            $t->id();
            foreach (['ho_ten', 'email', 'mat_khau', 'vai_tro', 'trang_thai', 'ma_so'] as $c) $t->string($c)->nullable();
            $t->timestamps(); $t->softDeletes();
        });
        foreach (['danh_muc_do_vat' => 'ten_danh_muc', 'dia_diem' => 'ten_dia_diem'] as $bang => $cot) {
            Schema::create($bang, function (Blueprint $t) use ($cot) { $t->id(); $t->string($cot); $t->timestamps(); });
        }
        Schema::create('tin_dang', function (Blueprint $t) {
            $t->id();
            foreach (['nguoi_dung_id', 'danh_muc_id', 'dia_diem_id'] as $c) $t->unsignedBigInteger($c)->nullable();
            foreach (['tieu_de', 'slug', 'mo_ta', 'loai_tin', 'trang_thai', 'trang_thai_kiem_duyet', 'ly_do_an'] as $c) $t->string($c)->nullable();
            $t->timestamps(); $t->softDeletes();
        });
        Schema::create('hinh_anh_tin_dang', function (Blueprint $t) { $t->id(); $t->unsignedBigInteger('tin_dang_id'); $t->string('duong_dan'); $t->string('pham_vi'); $t->integer('thu_tu'); });
        Schema::create('bao_cao_tin_dang', function (Blueprint $t) {
            $t->id(); foreach (['tin_dang_id', 'nguoi_bao_cao_id', 'nguoi_xu_ly_id'] as $c) $t->unsignedBigInteger($c)->nullable();
            foreach (['ly_do', 'mo_ta', 'trang_thai', 'ghi_chu_admin'] as $c) $t->string($c)->nullable();
            $t->dateTime('thoi_gian_xu_ly')->nullable(); $t->timestamps();
        });
        Schema::create('lich_su_tin_dang', function (Blueprint $t) {
            $t->id(); $t->unsignedBigInteger('tin_dang_id'); $t->unsignedBigInteger('nguoi_thuc_hien_id');
            foreach (['hanh_dong', 'trang_thai_cu', 'trang_thai_moi', 'noi_dung', 'du_lieu_cu', 'du_lieu_moi'] as $c) $t->text($c)->nullable();
            $t->timestamp('created_at')->nullable();
        });
    }

    private function taiKhoan(string $vaiTro = 'quan_tri'): NguoiDung
    {
        return NguoiDung::create(['ho_ten' => 'Admin test', 'email' => uniqid().'@example.test', 'mat_khau' => 'secret', 'vai_tro' => $vaiTro, 'trang_thai' => 'hoat_dong']);
    }

    public function test_phan_quyen(): void
    {
        $this->getJson('/api/admin/tin-dang')->assertUnauthorized();
        $this->actingAs($this->taiKhoan('nguoi_dung'))->getJson('/api/admin/tin-dang')->assertForbidden();
        $admin = $this->taiKhoan(); $admin->update(['trang_thai' => 'bi_khoa']);
        $this->actingAs($admin)->getJson('/api/admin/tin-dang')->assertForbidden();
    }

    public function test_an_khoi_phuc_va_bao_cao_luu_dung_lich_su(): void
    {
        $admin = $this->taiKhoan();
        $tin = TinDang::create(['nguoi_dung_id' => $admin->id, 'tieu_de' => 'Ví đen', 'slug' => 'vi-den', 'loai_tin' => 'nhat_duoc', 'trang_thai' => 'dang_mo', 'trang_thai_kiem_duyet' => 'hien_thi']);
        $bc = BaoCaoTinDang::create(['tin_dang_id' => $tin->id, 'nguoi_bao_cao_id' => $admin->id, 'ly_do' => 'Trùng tin', 'trang_thai' => 'cho_xu_ly']);
        $this->actingAs($admin);
        $url = '/api/admin/tin-dang/'.$tin->id;
        $this->getJson('/api/admin/tin-dang')->assertOk()->assertJsonCount(1, 'data')->assertDontSee('secret');
        $this->patchJson($url, ['hanh_dong' => 'an_tin', 'ly_do' => 'Đang kiểm tra báo cáo'])->assertOk()->assertJsonPath('data.trangThai', 'da_an');
        $this->assertSame('dang_mo', $tin->fresh()->trang_thai);
        $this->assertSame('cho_xu_ly', $bc->fresh()->trang_thai);
        $this->patchJson($url, ['hanh_dong' => 'an_tin', 'ly_do' => 'Thao tác lặp'])->assertConflict();
        $this->patchJson($url, ['hanh_dong' => 'khoi_phuc'])->assertOk()->assertJsonPath('data.trangThai', 'hien_thi');
        $this->assertNull($tin->fresh()->ly_do_an);
        $this->patchJson($url, ['hanh_dong' => 'chap_nhan_bao_cao', 'bao_cao_id' => $bc->id, 'ly_do' => 'Báo cáo có căn cứ'])->assertOk();
        $this->assertSame('chap_nhan', $bc->fresh()->trang_thai);
        $this->assertSame('hien_thi', $tin->fresh()->trang_thai_kiem_duyet);
        $this->assertDatabaseCount('lich_su_tin_dang', 3);
        $this->assertDatabaseHas('lich_su_tin_dang', ['nguoi_thuc_hien_id' => $admin->id, 'hanh_dong' => 'an_tin']);
        $this->patchJson($url, ['hanh_dong' => 'tu_choi_bao_cao', 'bao_cao_id' => $bc->id, 'ly_do' => 'Xử lý lần hai'])->assertConflict();
        $this->patchJson($url, ['hanh_dong' => 'an_tin', 'ly_do' => '   '])->assertUnprocessable();
        $this->getJson($url)->assertOk()->assertJsonCount(3, 'data.lichSu');
    }

    public function test_nguoi_dung_gui_bao_cao_va_khong_the_gia_mao_nguoi_gui(): void
    {
        $chuTin = $this->taiKhoan('nguoi_dung');
        $nguoiGui = $this->taiKhoan('nguoi_dung');
        $tin = TinDang::create(['nguoi_dung_id' => $chuTin->id, 'tieu_de' => 'Ví đen', 'slug' => 'vi-den', 'trang_thai_kiem_duyet' => 'hien_thi']);
        $url = '/api/tin-dang/'.$tin->id.'/bao-cao';
        $this->getJson('/api/admin/tin-dang')->assertUnauthorized();
        $this->postJson($url, ['ly_do' => 'Nghi lừa đảo'])->assertUnauthorized();
        $this->actingAs($nguoiGui)->postJson($url, [
            'ly_do' => 'Nghi lừa đảo', 'mo_ta' => '  Nội dung cần đối chiếu  ',
            'nguoi_bao_cao_id' => $chuTin->id, 'trang_thai' => 'chap_nhan', 'nguoi_xu_ly_id' => $chuTin->id,
        ])->assertCreated()->assertJsonPath('data.trang_thai', 'cho_xu_ly')->assertJsonMissingPath('data.nguoi_bao_cao_id');
        $this->assertDatabaseHas('bao_cao_tin_dang', [
            'tin_dang_id' => $tin->id, 'nguoi_bao_cao_id' => $nguoiGui->id,
            'trang_thai' => 'cho_xu_ly', 'nguoi_xu_ly_id' => null, 'mo_ta' => 'Nội dung cần đối chiếu',
        ]);
        $this->assertSame('hien_thi', $tin->fresh()->trang_thai_kiem_duyet);
        $this->postJson($url, ['ly_do' => 'Spam / trùng lặp'])->assertConflict();
        $this->assertDatabaseCount('bao_cao_tin_dang', 1);
        $this->actingAs($chuTin)->postJson($url, ['ly_do' => 'Nghi lừa đảo'])->assertForbidden();
        $this->actingAs($this->taiKhoan())->getJson('/api/admin/tin-dang/'.$tin->id)
            ->assertOk()->assertJsonCount(1, 'data.baoCao')->assertJsonPath('data.baoCao.0.lyDo', 'Nghi lừa đảo');
    }

    public function test_bao_cao_kiem_tra_du_lieu_va_tin_khong_con_hien_thi(): void
    {
        $this->withoutMiddleware(\Illuminate\Routing\Middleware\ThrottleRequests::class);
        $chuTin = $this->taiKhoan('nguoi_dung');
        $tin = TinDang::create(['nguoi_dung_id' => $chuTin->id, 'trang_thai_kiem_duyet' => 'hien_thi']);
        $url = '/api/tin-dang/'.$tin->id.'/bao-cao';
        $this->actingAs($this->taiKhoan('nguoi_dung'));
        foreach ([[], ['ly_do' => 'khong-hop-le']] as $data) {
            $this->postJson($url, $data)->assertUnprocessable()->assertJsonValidationErrors('ly_do');
        }
        foreach ([null, '   ', 'ngắn', str_repeat('a', 2001), ['sai']] as $moTa) {
            $this->postJson($url, ['ly_do' => 'Khác', 'mo_ta' => $moTa])->assertUnprocessable()->assertJsonValidationErrors('mo_ta');
        }
        $this->assertDatabaseCount('bao_cao_tin_dang', 0);
        $tin->update(['trang_thai_kiem_duyet' => 'da_an']);
        $this->postJson($url, ['ly_do' => 'Nghi lừa đảo'])->assertNotFound();
        $tin->delete();
        $this->postJson($url, ['ly_do' => 'Nghi lừa đảo'])->assertNotFound();
        $this->postJson('/api/tin-dang/999999/bao-cao', ['ly_do' => 'Nghi lừa đảo'])->assertNotFound();
    }

    public function test_bao_cao_chan_tai_khoan_khoa_va_gioi_han_tan_suat(): void
    {
        $nguoiGui = $this->taiKhoan('nguoi_dung');
        $tin = TinDang::create(['nguoi_dung_id' => $this->taiKhoan()->id, 'trang_thai_kiem_duyet' => 'hien_thi']);
        $url = '/api/tin-dang/'.$tin->id.'/bao-cao';
        $nguoiGui->update(['trang_thai' => 'bi_khoa']);
        $this->actingAs($nguoiGui)->postJson($url, ['ly_do' => 'Nghi lừa đảo'])->assertForbidden();
        $this->actingAs($this->taiKhoan('nguoi_dung'));
        for ($i = 0; $i < 5; $i++) {
            $this->postJson($url, [])->assertUnprocessable();
        }
        $this->postJson($url, [])->assertStatus(429);
    }
}
