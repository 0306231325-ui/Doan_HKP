<?php

namespace Tests\Feature;

use App\Models\DiaDiem;
use App\Models\NguoiDung;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class QuanLyDiaDiemTest extends TestCase
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
            $table->string('ten_dia_diem')->unique();
            $table->text('mo_ta')->nullable();
            $table->timestamps();
            $table->boolean('trang_thai')->default(true);
        });

    }

    private function taiKhoan(string $vaiTro = 'quan_tri', string $trangThai = 'hoat_dong'): NguoiDung
    {
        return NguoiDung::create(['ho_ten' => 'Kiểm thử', 'email' => 'thu'.NguoiDung::count().'@example.test', 'mat_khau' => 'hash', 'vai_tro' => $vaiTro, 'trang_thai' => $trangThai]);
    }

    public function test_quyen_quan_tri(): void
    {
        foreach ([['GET', '/api/admin/dia-diem'], ['POST', '/api/admin/dia-diem'], ['PATCH', '/api/admin/dia-diem/1'], ['PATCH', '/api/admin/dia-diem/1/trang-thai']] as [$method, $url]) {
            $this->json($method, $url)->assertUnauthorized();
            $this->actingAs($this->taiKhoan('nguoi_dung'));
            $this->json($method, $url)->assertForbidden();
            $this->app['auth']->forgetGuards();
        }
    }

    public function test_them_sua_ngung_kich_hoat_dong_bo_bo_loc(): void
    {
        $this->actingAs($this->taiKhoan());
        $id = $this->postJson('/api/admin/dia-diem', ['tenDiaDiem' => '  Thư   viện ', 'moTa' => ' Tầng 1 ', 'dangHoatDong' => true])
            ->assertCreated()->assertJsonPath('data.tenDiaDiem', 'Thư viện')->assertJsonPath('data.moTa', 'Tầng 1')->json('data.id');
        $this->getJson('/api/admin/dia-diem')->assertOk()->assertJsonPath('data.0.id', $id);
        $this->getJson('/api/tra-cuu/bo-loc')->assertOk()->assertJsonPath('diaDiem.0.name', 'Thư viện');
        $this->patchJson("/api/admin/dia-diem/$id", ['tenDiaDiem' => 'Thư viện mới', 'moTa' => '', 'dangHoatDong' => true])->assertOk();
        $this->getJson('/api/tra-cuu/bo-loc')->assertOk()->assertJsonPath('diaDiem.0.name', 'Thư viện mới');
        $this->patchJson("/api/admin/dia-diem/$id/trang-thai", ['dangHoatDong' => false, 'trangThaiHienTai' => true])->assertOk();
        $this->getJson('/api/tra-cuu/bo-loc')->assertOk()->assertJsonCount(0, 'diaDiem');
        $this->assertDatabaseHas('dia_diem', ['id' => $id, 'trang_thai' => false]);
        $this->patchJson("/api/admin/dia-diem/$id/trang-thai", ['dangHoatDong' => true, 'trangThaiHienTai' => false])->assertOk();
        $this->getJson('/api/tra-cuu/bo-loc')->assertOk()->assertJsonPath('diaDiem.0.id', $id);
    }

    public function test_kiem_tra_du_lieu_va_ten_trung(): void
    {
        $this->actingAs($this->taiKhoan());
        $muc = DiaDiem::create(['ten_dia_diem' => 'Thư viện', 'trang_thai' => false]);
        $this->postJson('/api/admin/dia-diem', ['tenDiaDiem' => ' THU  VIEN ', 'dangHoatDong' => true])->assertUnprocessable()->assertJsonValidationErrors('tenDiaDiem');
        $this->postJson('/api/admin/dia-diem', ['tenDiaDiem' => ' ', 'moTa' => str_repeat('a', 501), 'dangHoatDong' => 'sai'])->assertUnprocessable()->assertJsonValidationErrors(['tenDiaDiem', 'moTa', 'dangHoatDong']);
        $this->patchJson("/api/admin/dia-diem/{$muc->id}", ['tenDiaDiem' => 'Thư viện', 'dangHoatDong' => false])->assertOk();
        $khac = DiaDiem::create(['ten_dia_diem' => 'Cổng trường', 'trang_thai' => true]);
        $this->patchJson("/api/admin/dia-diem/{$khac->id}", ['tenDiaDiem' => 'Thu vien', 'dangHoatDong' => true])->assertUnprocessable();
        $this->patchJson('/api/admin/dia-diem/999', ['tenDiaDiem' => 'A', 'dangHoatDong' => true])->assertNotFound();
        $this->patchJson("/api/admin/dia-diem/{$muc->id}/trang-thai", ['dangHoatDong' => true, 'trangThaiHienTai' => true])->assertStatus(409);
    }
}
