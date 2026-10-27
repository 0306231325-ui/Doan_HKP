<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');

Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::middleware('admin')->group(function () {
        Route::get('/admin/me', [AuthController::class, 'me']);
        Route::get('/users', [UserController::class, 'index']);
    });
});



Route::get('/test', function () {
    return response()->json(['message' => 'Kết nối thành công từ Laravel 11!']);
});
