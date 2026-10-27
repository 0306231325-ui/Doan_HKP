<?php

namespace Tests\Feature;

use App\Models\NguoiDung;

class LoginTest extends RegisterTest
{
    private function account(string $role = 'nguoi_dung', string $status = 'hoat_dong'): NguoiDung
    {
        return NguoiDung::create([
            'ho_ten' => 'Test', 'email' => 'login@example.test', 'mat_khau' => 'Password@123',
            'ma_so' => 'TEST', 'so_dien_thoai' => '0901234567', 'vai_tro' => $role, 'trang_thai' => $status,
        ]);
    }

    public function test_login_restores_user_and_logout_removes_access(): void
    {
        $user = $this->account();
        $this->postJson('/login', ['email' => 'LOGIN@example.test', 'password' => 'Password@123'])
            ->assertOk()->assertJsonPath('user.vai_tro', 'nguoi_dung')->assertJsonMissingPath('user.mat_khau');
        $this->assertAuthenticatedAs($user);
        $this->getJson('/api/me')->assertOk()->assertJsonPath('user.id', $user->id);
        $this->postJson('/logout')->assertOk();
        $this->assertGuest('web');
        $this->app['auth']->forgetGuards();
        $this->getJson('/api/me')->assertUnauthorized();
    }

    public function test_wrong_password_and_deleted_accounts_cannot_login(): void
    {
        $user = $this->account();
        $this->postJson('/login', ['email' => $user->email, 'password' => 'Wrong'])
            ->assertUnprocessable()->assertJsonValidationErrors('email');
        $this->assertGuest();
        $user->delete();
        $this->postJson('/login', ['email' => $user->email, 'password' => 'Password@123'])->assertUnprocessable();
        $this->assertGuest();
    }

    public function test_locked_account_cannot_login(): void
    {
        $this->account('nguoi_dung', 'bi_khoa');
        $this->postJson('/login', ['email' => 'login@example.test', 'password' => 'Password@123'])->assertForbidden();
        $this->assertGuest();
    }

    public function test_guest_and_normal_user_cannot_access_admin_api(): void
    {
        $this->getJson('/api/admin/me')->assertUnauthorized();
        $this->actingAs($this->account());
        $this->getJson('/api/admin/me')->assertForbidden();
        $this->getJson('/api/users')->assertForbidden();
    }

    public function test_admin_access_and_lock_after_login(): void
    {
        $user = $this->account('quan_tri');
        $this->actingAs($user);
        $this->getJson('/api/admin/me')->assertOk();
        $user->update(['trang_thai' => 'bi_khoa']);
        $this->getJson('/api/me')->assertForbidden();
        $this->getJson('/api/admin/me')->assertForbidden();
        $this->postJson('/logout')->assertOk();
    }

    public function test_login_is_rate_limited(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/login', ['email' => 'none@example.test', 'password' => 'wrong'])->assertUnprocessable();
        }
        $this->postJson('/login', ['email' => 'none@example.test', 'password' => 'wrong'])->assertStatus(429);
    }

    public function test_old_hash_requires_original_password_and_converts_after_login(): void
    {
        $user = $this->account();
        $hash = password_hash('Password@123', PASSWORD_BCRYPT, ['cost' => 4]);
        $user->update(['mat_khau' => $hash]);
        $this->postJson('/login', ['email' => $user->email, 'password' => $hash])->assertUnprocessable();
        $this->assertSame($hash, $user->fresh()->mat_khau);
        $this->postJson('/login', ['email' => $user->email, 'password' => 'Password@123'])->assertOk();
        $this->assertSame('Password@123', $user->fresh()->mat_khau);
    }
}
