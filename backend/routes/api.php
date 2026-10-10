<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\UserController;

Route::get('/users', [UserController::class, 'index']);

Route::get('/test', function () {
    return response()->json(['message' => 'Kết nối thành công từ Laravel 11!']);
});
