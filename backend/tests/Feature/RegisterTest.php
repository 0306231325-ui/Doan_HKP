<?php

namespace Tests\Feature;

use App\Models\NguoiDung;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Schema::create('nguoi_dung', function (Blueprint $table) {
            $table->id();
            foreach (['ho_ten', 'mat_khau', 'ma_so', 'so_dien_thoai', 'vai_tro', 'trang_thai'] as $column) {
                $table->string($column);
            }
            $table->string('email')->unique();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    private function payload(): array
    {
        return [
            'ho_ten' => 'Nguyễn Văn A', 'ma_so' => 'SV001', 'so_dien_thoai' => '0901234567',
            'email' => '  SINHVIEN@example.com ', 'password' => 'MatKhau@123',
            'password_confirmation' => 'MatKhau@123',
        ];
    }

    public function test_registration_stores_plain_password_and_prevents_privilege_escalation(): void
    {
        $this->postJson('/api/register', array_merge($this->payload(), [
            'vai_tro' => 'quan_tri', 'da_xac_minh' => true, 'trang_thai' => 'bi_khoa',
        ]))->assertCreated()->assertJsonMissingPath('mat_khau')->assertJsonMissingPath('token');

        $user = NguoiDung::firstOrFail();
        $this->assertSame('sinhvien@example.com', $user->email);
        $this->assertSame('nguoi_dung', $user->vai_tro);
        $this->assertSame('hoat_dong', $user->trang_thai);
        $this->assertArrayNotHasKey('da_xac_minh', $user->getAttributes());
        $this->assertSame('MatKhau@123', $user->mat_khau);
        $this->assertGuest();
    }

    public function test_duplicate_email_is_rejected_even_for_deleted_accounts(): void
    {
        $this->postJson('/api/register', $this->payload())->assertCreated();
        NguoiDung::firstOrFail()->delete();
        $this->postJson('/api/register', $this->payload())
            ->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_invalid_fields_and_password_confirmation_are_rejected(): void
    {
        $this->postJson('/api/register', array_merge($this->payload(), [
            'ho_ten' => ' ', 'email' => 'invalid', 'so_dien_thoai' => 'abc',
            'password_confirmation' => 'khong-khop',
        ]))->assertUnprocessable()->assertJsonValidationErrors(['ho_ten', 'email', 'so_dien_thoai', 'password']);
        $this->assertDatabaseCount('nguoi_dung', 0);
    }

    public function test_registration_is_rate_limited(): void
    {
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/register', [])->assertUnprocessable();
        }
        $this->postJson('/api/register', [])->assertStatus(429);
    }
}
