<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Models\NguoiDung;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email', 'max:191'],
            'password' => ['required', 'string', 'max:72'],
        ]);
        $data['email'] = mb_strtolower(trim($data['email']));
        $user = NguoiDung::where('email', $data['email'])->first();
        if (! $user || ! $user->kiemTraMatKhau($data['password'])) {
            throw ValidationException::withMessages(['email' => 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.']);
        }
        if ($user->trang_thai !== 'hoat_dong') {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json(['message' => 'Tài khoản đã bị khóa.'], 403);
        }
        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json(['message' => 'Đăng nhập thành công.', 'user' => $this->userData($request)]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->userData($request)]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Đã đăng xuất.']);
    }

    private function userData(Request $request): array
    {
        return $request->user()->thongTinCaNhan();
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            NguoiDung::create([
                'ho_ten' => $data['ho_ten'],
                'ma_so' => $data['ma_so'],
                'so_dien_thoai' => $data['so_dien_thoai'],
                'email' => $data['email'],
                'mat_khau' => $data['password'],
                'vai_tro' => 'nguoi_dung',
                'trang_thai' => 'hoat_dong',
            ]);
        } catch (UniqueConstraintViolationException $exception) {
            // Handle simultaneous registrations for the same email as validation errors.
            throw ValidationException::withMessages(['email' => 'Email này đã được đăng ký.']);
        }

        return response()->json(['message' => 'Đăng ký thành công. Bạn có thể chuyển sang đăng nhập.'], 201);
    }
}
