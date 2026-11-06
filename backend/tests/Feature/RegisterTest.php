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
            'ho_ten' => 'Nguyễn Văn A', 'ma_so' => 'SV0001', 'so_dien_thoai' => '0901234567',
            'email' => 'SINHVIEN@school.edu.vn', 'password' => 'MatKhau@123',
            'password_confirmation' => 'MatKhau@123',
        ];
    }

    public function test_registration_stores_plain_password_and_prevents_privilege_escalation(): void
    {
        $this->postJson('/api/register', array_merge($this->payload(), [
            'vai_tro' => 'quan_tri', 'da_xac_minh' => true, 'trang_thai' => 'bi_khoa',
        ]))->assertCreated()->assertJsonMissingPath('mat_khau')->assertJsonMissingPath('token');

        $user = NguoiDung::firstOrFail();
        $this->assertSame('sinhvien@school.edu.vn', $user->email);
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

    public function test_name_rejects_blank_numbers_emoji_symbols_and_excessive_length(): void
    {
        foreach (['   ', 'An123', 'An 😊', 'An@', str_repeat('A', 101)] as $name) {
            $this->postJson('/api/register', array_merge($this->payload(), ['ho_ten' => $name]))
                ->assertUnprocessable()->assertJsonValidationErrors('ho_ten');
        }
        $this->assertDatabaseCount('nguoi_dung', 0);
    }

    public function test_name_accepts_one_word_vietnamese_and_one_hundred_characters(): void
    {
        foreach (['An', 'Nguyễn Văn An', str_repeat('Á', 100)] as $index => $name) {
            $this->postJson('/api/register', array_merge($this->payload(), [
                'ho_ten' => $name, 'email' => "name{$index}@school.edu.vn", 'ma_so' => "SV000{$index}",
            ]))->assertCreated();
        }
        $this->assertDatabaseCount('nguoi_dung', 3);
    }

    public function test_school_id_rejects_invalid_values(): void
    {
        $this->withoutMiddleware(\Illuminate\Routing\Middleware\ThrottleRequests::class);
        foreach (['', '   ', 'SV001', 'SV 001', 'Đ00001', 'SV000😊', 'SV@001', str_repeat('A', 21)] as $code) {
            $this->postJson('/api/register', array_merge($this->payload(), ['ma_so' => $code]))
                ->assertUnprocessable()->assertJsonValidationErrors('ma_so');
        }
        $this->assertDatabaseCount('nguoi_dung', 0);
    }

    public function test_school_id_preserves_leading_zeros_and_accepts_twenty_characters(): void
    {
        foreach (['00123456', 'gv0001', str_repeat('A', 20)] as $index => $code) {
            $this->postJson('/api/register', array_merge($this->payload(), [
                'ma_so' => $code, 'email' => "code{$index}@school.edu.vn",
            ]))->assertCreated();
            $this->assertDatabaseHas('nguoi_dung', ['email' => "code{$index}@school.edu.vn", 'ma_so' => $code]);
        }
    }

    public function test_duplicate_school_id_is_rejected_even_for_deleted_accounts(): void
    {
        $this->postJson('/api/register', $this->payload())->assertCreated();
        $duplicate = array_merge($this->payload(), ['email' => 'other@school.edu.vn']);
        $this->postJson('/api/register', $duplicate)
            ->assertUnprocessable()->assertJsonValidationErrors('ma_so');
        NguoiDung::firstOrFail()->delete();
        $this->postJson('/api/register', $duplicate)
            ->assertUnprocessable()->assertJsonValidationErrors('ma_so');
    }

    public function test_phone_rejects_blank_wrong_prefix_non_digits_and_more_than_ten_digits(): void
    {
        $this->withoutMiddleware(\Illuminate\Routing\Middleware\ThrottleRequests::class);
        foreach (['', '   ', '1901234567', '+84901234567', '090 123456', '090abc1234', '09012345678'] as $phone) {
            $this->postJson('/api/register', array_merge($this->payload(), ['so_dien_thoai' => $phone]))
                ->assertUnprocessable()->assertJsonValidationErrors('so_dien_thoai');
        }
        $this->assertDatabaseCount('nguoi_dung', 0);
    }

    public function test_phone_accepts_up_to_ten_digits_starting_with_zero(): void
    {
        foreach (['0', '012345678', '0901234567'] as $index => $phone) {
            $this->postJson('/api/register', array_merge($this->payload(), [
                'so_dien_thoai' => $phone, 'email' => "phone{$index}@school.edu.vn", 'ma_so' => "PHONE{$index}",
            ]))->assertCreated();
            $this->assertDatabaseHas('nguoi_dung', ['email' => "phone{$index}@school.edu.vn", 'so_dien_thoai' => $phone]);
        }
    }

    public function test_email_rejects_blank_spaces_other_domains_and_special_characters(): void
    {
        $this->withoutMiddleware(\Illuminate\Routing\Middleware\ThrottleRequests::class);
        foreach (['', '   ', ' user@school.edu.vn', 'user@school.edu.vn ', 'user name@school.edu.vn',
            'user@gmail.com', 'user@edu.vn', 'user@school.edu.vn.evil', 'user@-school.edu.vn', 'user@example.com', 'user.name@school.edu.vn', 'user_name@school.edu.vn', 'user+1@school.edu.vn',
            'tên@school.edu.vn', '@school.edu.vn', 'user@school.edu.vn.evil'] as $email) {
            $this->postJson('/api/register', array_merge($this->payload(), ['email' => $email]))
                ->assertUnprocessable()->assertJsonValidationErrors('email');
        }
        $this->assertDatabaseCount('nguoi_dung', 0);
    }

    public function test_email_accepts_alphanumeric_educational_addresses(): void
    {
        foreach (['student123@school.edu.vn', 'student@student.school.edu.vn', '123456@my-school.edu.vn'] as $index => $email) {
            $this->postJson('/api/register', array_merge($this->payload(), [
                'email' => $email, 'ma_so' => "EMAIL{$index}",
            ]))->assertCreated();
        }
        $this->assertDatabaseCount('nguoi_dung', 3);
    }
}
