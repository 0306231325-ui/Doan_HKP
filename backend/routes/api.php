<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\DiaDiemController;
use App\Http\Controllers\ThongTinCaNhanController;
use App\Http\Controllers\TraCuuController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/tra-cuu/bo-loc', [TraCuuController::class, 'boLoc']);
Route::get('/tra-cuu', [TraCuuController::class, 'danhSach'])->middleware('throttle:120,1');

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');

Route::get('/anh-dai-dien/{tenAnh}', [ThongTinCaNhanController::class, 'anhDaiDien'])
    ->where('tenAnh', '[a-zA-Z0-9]{40}\\.(jpg|jpeg|png|webp)');

Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/me', [ThongTinCaNhanController::class, 'capNhat'])->middleware('throttle:20,1');
    Route::put('/me/mat-khau', [ThongTinCaNhanController::class, 'doiMatKhau'])->middleware('throttle:5,1');
    Route::post('/me/anh-dai-dien', [ThongTinCaNhanController::class, 'doiAnhDaiDien'])->middleware('throttle:10,1');
    Route::get('/user', [AuthController::class, 'me']);
    Route::middleware('admin')->group(function () {
        Route::get('/admin/me', [AuthController::class, 'me']);
        Route::get('/admin/tin-dang', [\App\Http\Controllers\QuanLyTinDangController::class, 'danhSach']);
        Route::get('/admin/tin-dang/{tin}', [\App\Http\Controllers\QuanLyTinDangController::class, 'chiTiet'])->whereNumber('tin');
        Route::patch('/admin/tin-dang/{tin}', [\App\Http\Controllers\QuanLyTinDangController::class, 'xuLy'])->whereNumber('tin')->middleware('throttle:30,1');
        Route::get('/admin/dia-diem', [DiaDiemController::class, 'danhSach']);
        Route::post('/admin/dia-diem', [DiaDiemController::class, 'them'])->middleware('throttle:30,1');
        Route::patch('/admin/dia-diem/{id}', [DiaDiemController::class, 'sua'])->whereNumber('id')->middleware('throttle:30,1');
        Route::patch('/admin/dia-diem/{id}/trang-thai', [DiaDiemController::class, 'doiTrangThai'])->whereNumber('id')->middleware('throttle:30,1');
        Route::get('/admin/danh-muc', [DanhMucController::class, 'danhSach']);
        Route::post('/admin/danh-muc', [DanhMucController::class, 'them'])->middleware('throttle:30,1');
        Route::patch('/admin/danh-muc/{id}/trang-thai', [DanhMucController::class, 'doiTrangThai'])->whereNumber('id')->middleware('throttle:30,1');
        Route::delete('/admin/danh-muc/{id}', [DanhMucController::class, 'xoa'])->whereNumber('id')->middleware('throttle:30,1');
        Route::get('/admin/nguoi-dung', [UserController::class, 'index']);
        Route::patch('/admin/nguoi-dung/{id}/trang-thai', [UserController::class, 'doiTrangThai'])->whereNumber('id')->middleware('throttle:20,1');
        Route::get('/users', [UserController::class, 'index']);
    });
});

Route::get('/test', function () {
    return response()->json(['message' => 'Kết nối thành công từ Laravel 11!']);
});
