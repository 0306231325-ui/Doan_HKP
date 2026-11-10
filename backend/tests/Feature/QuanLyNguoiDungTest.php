<?php

namespace Tests\Feature;

use App\Models\NguoiDung;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class QuanLyNguoiDungTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Schema::create('nguoi_dung', function (Blueprint $table) {
            $table->id();
            foreach (['ho_ten', 'email', 'mat_khau', 'ma_so', 'so_dien_thoai', 'anh_dai_dien', 'ly_do_khoa'] as $cot) {
                $table->string($cot)->nullable();
            }
            $table->string('vai_tro')->default('nguoi_dung');
            $table->string('trang_thai')->default('hoat_dong');
            $table->dateTime('khoa_den_ngay')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    private function taiKhoan(string $vaiTro = 'nguoi_dung'): NguoiDung
    {
        return NguoiDung::create(['ho_ten' => 'Tai khoan', 'email' => 'thu'.NguoiDung::withTrashed()->count().'@example.test', 'mat_khau' => 'SECRET-HASH', 'vai_tro' => $vaiTro, 'trang_thai' => 'hoat_dong']);
    }

    public function test_chi_quan_tri_hoat_dong_duoc_doc_va_doi_trang_thai(): void
    {
        $user = $this->taiKhoan();
        $url = '/api/admin/nguoi-dung/'.$user->id.'/trang-thai';
        $this->getJson('/api/admin/nguoi-dung')->assertUnauthorized();
        $this->patchJson($url, [])->assertUnauthorized();
        $this->actingAs($user)->getJson('/api/admin/nguoi-dung')->assertForbidden();
        $this->patchJson($url, [])->assertForbidden();
        $admin = $this->taiKhoan('quan_tri');
        $admin->update(['trang_thai' => 'bi_khoa']);
        $this->actingAs($admin)->getJson('/api/admin/nguoi-dung')->assertForbidden();
        $this->patchJson($url, [])->assertForbidden();
    }

    public function test_danh_sach_day_du_ho_so_khong_mat_khau_khong_tai_khoan_da_xoa(): void
    {
        $admin = $this->taiKhoan('quan_tri');
        $quanTriKhac = $this->taiKhoan('quan_tri');
        $user = $this->taiKhoan();
        $user->update(['ma_so' => 'SV001', 'trang_thai' => 'bi_khoa', 'ly_do_khoa' => 'Vi pham']);
        $this->taiKhoan()->delete();
        $response = $this->actingAs($admin)->getJson('/api/admin/nguoi-dung')->assertOk()->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.ma_so', 'SV001')->assertJsonPath('data.0.ly_do_khoa', 'Vi pham')
            ->assertJsonPath('data.0.co_the_doi_trang_thai', true)->assertJsonPath('data.1.co_the_doi_trang_thai', true)
            ->assertJsonPath('data.1.id', $quanTriKhac->id);
        $this->assertNotContains($admin->id, array_column($response->json('data'), 'id'));
        $this->assertStringNotContainsString('mat_khau', $response->getContent());
        $this->assertStringNotContainsString('SECRET-HASH', $response->getContent());
    }

    public function test_khoa_mo_khoa_luu_db_chan_truy_cap_va_khong_sua_quyen_mat_khau(): void
    {
        $admin = $this->taiKhoan('quan_tri');
        $user = $this->taiKhoan();
        $url = '/api/admin/nguoi-dung/'.$user->id.'/trang-thai';
        $this->actingAs($admin)->patchJson($url, ['trang_thai' => 'bi_khoa', 'trang_thai_hien_tai' => 'hoat_dong', 'ly_do_khoa' => ' Vi pham ', 'vai_tro' => 'quan_tri', 'mat_khau' => 'overwrite'])
            ->assertOk()->assertJsonPath('updated', true)->assertJsonPath('user.trang_thai', 'bi_khoa')->assertJsonPath('user.ly_do_khoa', 'Vi pham');
        $this->assertSame('nguoi_dung', $user->fresh()->vai_tro);
        $this->assertSame($user->mat_khau, $user->fresh()->mat_khau);
        $this->actingAs($user->fresh())->getJson('/api/me')->assertForbidden();
        $this->actingAs($admin)->patchJson($url, ['trang_thai' => 'hoat_dong', 'trang_thai_hien_tai' => 'bi_khoa'])->assertOk()->assertJsonPath('user.ly_do_khoa', null)->assertJsonPath('user.khoa_den_ngay', null);
        $this->actingAs($user->fresh())->getJson('/api/me')->assertOk();
    }

    public function test_chan_tu_khoa_validate_va_khong_ghi_de_trang_thai_cu(): void
    {
        $admin = $this->taiKhoan('quan_tri');
        $user = $this->taiKhoan();
        $this->actingAs($admin);
        $duLieu = ['trang_thai' => 'bi_khoa', 'trang_thai_hien_tai' => 'hoat_dong', 'ly_do_khoa' => 'Ly do'];
        $this->patchJson('/api/admin/nguoi-dung/'.$admin->id.'/trang-thai', $duLieu)->assertForbidden();
        $url = '/api/admin/nguoi-dung/'.$user->id.'/trang-thai';
        $this->patchJson($url, array_merge($duLieu, ['ly_do_khoa' => ' ']))->assertUnprocessable()->assertJsonValidationErrors('ly_do_khoa');
        $this->patchJson($url, array_merge($duLieu, ['ly_do_khoa' => str_repeat('a', 1001)]))->assertUnprocessable();
        $this->patchJson($url, array_merge($duLieu, ['trang_thai' => 'sai']))->assertUnprocessable();
        $user->update(['trang_thai' => 'bi_khoa', 'ly_do_khoa' => 'Da khoa truoc']);
        $this->patchJson($url, $duLieu)->assertConflict();
        $this->assertSame('Da khoa truoc', $user->fresh()->ly_do_khoa);
        $user->delete();
        $this->patchJson($url, $duLieu)->assertNotFound();
        $this->patchJson('/api/admin/nguoi-dung/999/trang-thai', $duLieu)->assertNotFound();
    }

    public function test_gui_cung_trang_thai_khong_bao_thay_doi(): void
    {
        $admin = $this->taiKhoan('quan_tri');
        $user = $this->taiKhoan('quan_tri');
        $this->actingAs($admin)->patchJson('/api/admin/nguoi-dung/'.$user->id.'/trang-thai', ['trang_thai' => 'hoat_dong', 'trang_thai_hien_tai' => 'hoat_dong'])
            ->assertOk()->assertJsonPath('updated', false)->assertJsonPath('user.vai_tro', 'quan_tri');
        $url = '/api/admin/nguoi-dung/'.$user->id.'/trang-thai';
        $this->patchJson($url, ['trang_thai' => 'bi_khoa', 'trang_thai_hien_tai' => 'hoat_dong', 'ly_do_khoa' => 'Khoa tai khoan quan tri khac'])->assertOk()->assertJsonPath('user.trang_thai', 'bi_khoa');
        $this->patchJson($url, ['trang_thai' => 'hoat_dong', 'trang_thai_hien_tai' => 'bi_khoa'])->assertOk()->assertJsonPath('user.trang_thai', 'hoat_dong');
    }
}
