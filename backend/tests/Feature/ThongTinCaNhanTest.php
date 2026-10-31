<?php

namespace Tests\Feature;

use App\Models\NguoiDung;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ThongTinCaNhanTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Schema::create('nguoi_dung', function (Blueprint $table) {
            $table->id();
            $table->string('ho_ten');
            $table->string('email')->unique();
            $table->string('mat_khau');
            foreach (['ma_so', 'so_dien_thoai', 'khoa', 'lop', 'anh_dai_dien'] as $column) {
                $table->string($column)->nullable();
            }
            $table->string('vai_tro')->default('nguoi_dung');
            $table->string('trang_thai')->default('hoat_dong');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    private function taoTaiKhoan(string $email = 'hoso@example.test'): NguoiDung
    {
        return NguoiDung::create([
            'ho_ten' => 'Nguyễn Văn A', 'email' => $email, 'mat_khau' => Hash::make('Password@123'),
            'ma_so' => 'SV001', 'so_dien_thoai' => '0901234567', 'khoa' => 'CNTT', 'lop' => 'CTK46',
            'vai_tro' => 'nguoi_dung', 'trang_thai' => 'hoat_dong',
        ]);
    }

    private function duLieuHoSo(NguoiDung $user): array
    {
        return $user->only(['ho_ten', 'email', 'ma_so', 'so_dien_thoai', 'khoa', 'lop']);
    }

    public function test_doc_ho_so_day_du_va_khong_lo_mat_khau(): void
    {
        $this->actingAs($this->taoTaiKhoan())->getJson('/api/me')->assertOk()
            ->assertJsonPath('user.khoa', 'CNTT')->assertJsonPath('user.ma_so', 'SV001')
            ->assertJsonPath('user.so_dien_thoai', '0901234567')->assertJsonMissingPath('user.mat_khau');
    }

    public function test_chi_sua_ho_so_cua_minh_va_khong_nang_quyen(): void
    {
        $user = $this->taoTaiKhoan();
        $other = $this->taoTaiKhoan('khac@example.test');
        $hash = $user->mat_khau;
        $this->actingAs($user)->patchJson('/api/me', array_merge($this->duLieuHoSo($user), [
            'id' => $other->id, 'ho_ten' => 'Tên mới', 'khoa' => null,
            'vai_tro' => 'quan_tri', 'trang_thai' => 'bi_khoa', 'mat_khau' => 'ghi-de',
        ]))->assertOk()->assertJsonPath('updated', true)->assertJsonPath('user.ho_ten', 'Tên mới')->assertJsonPath('user.khoa', null)->assertJsonMissingPath('user.mat_khau');
        $this->assertSame('nguoi_dung', $user->fresh()->vai_tro);
        $this->assertSame('hoat_dong', $user->fresh()->trang_thai);
        $this->assertSame($hash, $user->fresh()->mat_khau);
        $this->assertSame('Nguyễn Văn A', $other->fresh()->ho_ten);
    }

    public function test_giu_nguyen_thong_tin_khong_bao_da_cap_nhat_va_khong_doi_updated_at(): void
    {
        $user = $this->taoTaiKhoan();
        $thoiDiemCu = $user->updated_at->toDateTimeString();
        $this->travelTo(now()->addHour());
        $duLieu = array_merge($this->duLieuHoSo($user), ['ho_ten' => '  Nguyễn Văn A  ', 'email' => ' HOSO@EXAMPLE.TEST ']);
        $this->actingAs($user)->patchJson('/api/me', $duLieu)->assertOk()
            ->assertJsonPath('updated', false)->assertJsonPath('message', 'Bạn chưa thay đổi thông tin nào.');
        $this->assertSame($thoiDiemCu, $user->fresh()->updated_at->toDateTimeString());
        $this->travelBack();
    }

    public function test_doi_email_can_dung_mat_khau_va_khong_duoc_trung(): void
    {
        $user = $this->taoTaiKhoan();
        $other = $this->taoTaiKhoan('trung@example.test');
        $payload = array_merge($this->duLieuHoSo($user), ['email' => ' MOI@EXAMPLE.TEST ']);
        $this->actingAs($user)->patchJson('/api/me', $payload)->assertUnprocessable()->assertJsonValidationErrors('current_password');
        $this->patchJson('/api/me', $payload + ['current_password' => 'Sai@1234'])->assertUnprocessable();
        $this->patchJson('/api/me', array_merge($payload, ['email' => $other->email, 'current_password' => 'Password@123']))
            ->assertUnprocessable()->assertJsonValidationErrors('email');
        $this->patchJson('/api/me', $payload + ['current_password' => 'Password@123'])->assertOk()->assertJsonPath('user.email', 'moi@example.test');
    }

    public function test_kiem_tra_du_lieu_va_chan_tai_khoan_bi_khoa(): void
    {
        $user = $this->taoTaiKhoan();
        $this->actingAs($user)->patchJson('/api/me', ['ho_ten' => ' ', 'email' => 'sai', 'so_dien_thoai' => 'abc', 'lop' => str_repeat('x', 51)])
            ->assertUnprocessable()->assertJsonValidationErrors(['ho_ten', 'email', 'so_dien_thoai', 'lop']);
        $user->update(['trang_thai' => 'bi_khoa']);
        $this->patchJson('/api/me', $this->duLieuHoSo($user))->assertForbidden();
        $this->putJson('/api/me/mat-khau', [])->assertForbidden();
        $this->postJson('/api/me/anh-dai-dien', [])->assertForbidden();
    }

    public function test_khach_khong_duoc_doi_thong_tin(): void
    {
        $this->patchJson('/api/me', [])->assertUnauthorized();
        $this->putJson('/api/me/mat-khau', [])->assertUnauthorized();
        $this->postJson('/api/me/anh-dai-dien', [])->assertUnauthorized();
    }

    public function test_doi_mat_khau_bam_va_dang_nhap_lai_giu_hash(): void
    {
        $user = $this->taoTaiKhoan();
        $this->actingAs($user)->putJson('/api/me/mat-khau', [
            'current_password' => 'Password@123', 'password' => 'Moi@123456', 'password_confirmation' => 'Moi@123456',
        ])->assertOk()->assertJsonMissingPath('mat_khau');
        $hash = $user->fresh()->mat_khau;
        $this->assertTrue(Hash::check('Moi@123456', $hash));
        $this->postJson('/logout')->assertOk();
        $this->app['auth']->forgetGuards();
        $this->postJson('/login', ['email' => $user->email, 'password' => 'Password@123'])->assertUnprocessable();
        $this->postJson('/login', ['email' => $user->email, 'password' => 'Moi@123456'])->assertOk();
        $this->assertSame($hash, $user->fresh()->mat_khau);
    }

    public function test_mat_khau_sai_xac_nhan_sai_va_qua_dai_khong_duoc_luu(): void
    {
        $user = $this->taoTaiKhoan();
        $hash = $user->mat_khau;
        $this->actingAs($user)->putJson('/api/me/mat-khau', [
            'current_password' => 'Sai@1234', 'password' => 'Moi@123456', 'password_confirmation' => 'Moi@123456',
        ])->assertUnprocessable()->assertJsonValidationErrors('current_password');
        $this->putJson('/api/me/mat-khau', [
            'current_password' => 'Password@123', 'password' => 'Moi@123456', 'password_confirmation' => 'khac',
        ])->assertUnprocessable()->assertJsonValidationErrors('password');
        $this->putJson('/api/me/mat-khau', [
            'current_password' => 'Password@123', 'password' => str_repeat('á', 40), 'password_confirmation' => str_repeat('á', 40),
        ])->assertUnprocessable()->assertJsonValidationErrors('password');
        $this->assertSame($hash, $user->fresh()->mat_khau);
    }

    public function test_mat_khau_cu_dang_ro_van_doi_duoc(): void
    {
        $user = $this->taoTaiKhoan();
        $user->update(['mat_khau' => 'Password@123']);
        $this->actingAs($user)->putJson('/api/me/mat-khau', [
            'current_password' => 'Password@123', 'password' => 'Moi@123456', 'password_confirmation' => 'Moi@123456',
        ])->assertOk();
        $this->assertTrue(Hash::check('Moi@123456', $user->fresh()->mat_khau));
    }

    public function test_anh_duoc_luu_hien_thi_va_xoa_anh_cu_khi_thay(): void
    {
        Storage::fake('public');
        $user = $this->taoTaiKhoan();
        $this->actingAs($user)->postJson('/api/me/anh-dai-dien', ['anh_dai_dien' => UploadedFile::fake()->image('anh.jpg')])->assertOk();
        $anhCu = $user->fresh()->anh_dai_dien;
        $this->get($anhCu)->assertOk()->assertHeader('X-Content-Type-Options', 'nosniff');
        $this->postJson('/api/me/anh-dai-dien', ['anh_dai_dien' => UploadedFile::fake()->image('anh.png')])->assertOk();
        Storage::disk('public')->assertMissing('anh-dai-dien/'.basename($anhCu));
        Storage::disk('public')->assertExists('anh-dai-dien/'.basename($user->fresh()->anh_dai_dien));
        $this->get($anhCu)->assertNotFound();
    }

    public function test_tu_choi_anh_gia_anh_lon_va_duong_dan_la(): void
    {
        Storage::fake('public');
        $user = $this->taoTaiKhoan();
        $this->actingAs($user)->postJson('/api/me/anh-dai-dien', ['anh_dai_dien' => UploadedFile::fake()->create('anh.jpg', 10, 'text/plain')])
            ->assertUnprocessable()->assertJsonValidationErrors('anh_dai_dien');
        $this->postJson('/api/me/anh-dai-dien', ['anh_dai_dien' => UploadedFile::fake()->image('anh.jpg')->size(2049)])
            ->assertUnprocessable()->assertJsonValidationErrors('anh_dai_dien');
        $this->get('/api/anh-dai-dien/.env')->assertNotFound();
        $this->assertNull($user->fresh()->anh_dai_dien);
        $this->assertSame([], Storage::disk('public')->allFiles());
    }
}
