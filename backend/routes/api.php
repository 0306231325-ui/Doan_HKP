<?php

use App\Http\Controllers\AuthController;
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
        Route::get('/users', [UserController::class, 'index']);
    });
});

Route::get('/test', function () {
    return response()->json(['message' => 'Kết nối thành công từ Laravel 11!']);
});
