<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CauHoiController;
use App\Http\Controllers\DangTinController;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\DiaDiemController;
use App\Http\Controllers\QuanLyTinDangController;
use App\Http\Controllers\ThongBaoController;
use App\Http\Controllers\ThongTinCaNhanController;
use App\Http\Controllers\TraCuuController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\YeuCauNhanDoController;
use App\Models\HinhAnhTinDang;
use Illuminate\Support\Facades\Route;

Route::get('/tra-cuu/bo-loc', [TraCuuController::class, 'boLoc']);
Route::get('/tra-cuu', [TraCuuController::class, 'danhSach'])->middleware('throttle:120,1');
Route::get('/tra-cuu/{tin}', [TraCuuController::class, 'chiTiet'])->whereNumber('tin')->middleware('throttle:120,1');
Route::get('/tin-dang/anh/{tenAnh}', [DangTinController::class, 'anh'])->where('tenAnh', HinhAnhTinDang::MAU_TEN_ANH);

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');

Route::get('/anh-dai-dien/{tenAnh}', [ThongTinCaNhanController::class, 'anhDaiDien'])
    ->where('tenAnh', ThongTinCaNhanController::MAU_TEN_ANH);

Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::post('/tin-dang/{tin}/bao-cao', [\App\Http\Controllers\BaoCaoTinDangController::class, 'store'])->whereNumber('tin')->middleware('throttle:5,1');
    Route::get('/dang-tin/cau-hoi', [DangTinController::class, 'bieuMau'])->middleware('throttle:120,1');
    Route::post('/tin-dang', [DangTinController::class, 'them'])->middleware('throttle:10,1');
    Route::get('/tin-dang/{tin}/chinh-sua', [DangTinController::class, 'duLieuSua'])->whereNumber('tin');
    Route::patch('/tin-dang/{tin}', [DangTinController::class, 'sua'])->whereNumber('tin')->middleware('throttle:30,1');
    Route::delete('/tin-dang/{tin}', [DangTinController::class, 'xoa'])->whereNumber('tin')->middleware('throttle:30,1');
    Route::get('/tin-dang/{tin}/nhan-lai', [YeuCauNhanDoController::class, 'bieuMau'])->whereNumber('tin');
    Route::post('/tin-dang/{tin}/nhan-lai', [YeuCauNhanDoController::class, 'them'])->whereNumber('tin')->middleware('throttle:10,1');
    Route::get('/tin-dang/{tin}/lien-he', [YeuCauNhanDoController::class, 'lienHe'])->whereNumber('tin')->middleware('throttle:60,1');
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/thong-bao', [ThongBaoController::class, 'danhSach'])->middleware('throttle:120,1');
    Route::patch('/thong-bao/da-doc', [ThongBaoController::class, 'danhDauTatCaDaDoc'])->middleware('throttle:30,1');
    Route::patch('/thong-bao/{id}/da-doc', [ThongBaoController::class, 'danhDauDaDoc'])->whereNumber('id')->middleware('throttle:30,1');
    Route::get('/me/tin-dang', [DangTinController::class, 'tinCuaToi'])->middleware('throttle:120,1');
    Route::patch('/me', [ThongTinCaNhanController::class, 'capNhat'])->middleware('throttle:20,1');
    Route::put('/me/mat-khau', [ThongTinCaNhanController::class, 'doiMatKhau'])->middleware('throttle:5,1');
    Route::post('/me/anh-dai-dien', [ThongTinCaNhanController::class, 'doiAnhDaiDien'])->middleware('throttle:10,1');
    Route::delete('/me/anh-dai-dien', [ThongTinCaNhanController::class, 'goAnhDaiDien'])->middleware('throttle:10,1');
    Route::get('/user', [AuthController::class, 'me']);
    Route::middleware('admin')->group(function () {
        Route::get('/admin/me', [AuthController::class, 'me']);
        Route::get('/admin/cau-hoi', [CauHoiController::class, 'danhSach']);
        Route::post('/admin/cau-hoi', [CauHoiController::class, 'them'])->middleware('throttle:30,1');
        Route::put('/admin/cau-hoi/{id}', [CauHoiController::class, 'sua'])->whereNumber('id')->middleware('throttle:30,1');
        Route::patch('/admin/cau-hoi/{id}/trang-thai', [CauHoiController::class, 'doiTrangThai'])->whereNumber('id')->middleware('throttle:30,1');
        Route::delete('/admin/cau-hoi/{id}', [CauHoiController::class, 'xoa'])->whereNumber('id')->middleware('throttle:30,1');
        Route::get('/admin/dia-diem', [DiaDiemController::class, 'danhSach']);
        Route::post('/admin/dia-diem', [DiaDiemController::class, 'them'])->middleware('throttle:30,1');
        Route::patch('/admin/dia-diem/{id}', [DiaDiemController::class, 'sua'])->whereNumber('id')->middleware('throttle:30,1');
        Route::patch('/admin/dia-diem/{id}/trang-thai', [DiaDiemController::class, 'doiTrangThai'])->whereNumber('id')->middleware('throttle:30,1');
        Route::get('/admin/danh-muc', [DanhMucController::class, 'danhSach']);
        Route::post('/admin/danh-muc', [DanhMucController::class, 'them'])->middleware('throttle:30,1');
        Route::patch('/admin/danh-muc/{id}/trang-thai', [DanhMucController::class, 'doiTrangThai'])->whereNumber('id')->middleware('throttle:30,1');
        Route::patch('/admin/danh-muc/{id}/thu-tu', [DanhMucController::class, 'doiThuTu'])->whereNumber('id')->middleware('throttle:30,1');
        Route::delete('/admin/danh-muc/{id}', [DanhMucController::class, 'xoa'])->whereNumber('id')->middleware('throttle:30,1');
        Route::get('/admin/nguoi-dung', [UserController::class, 'index']);
        Route::patch('/admin/nguoi-dung/{id}/trang-thai', [UserController::class, 'doiTrangThai'])->whereNumber('id')->middleware('throttle:20,1');
        Route::get('/admin/tin-dang', [QuanLyTinDangController::class, 'danhSach']);
        Route::get('/admin/tin-dang/{tin}', [QuanLyTinDangController::class, 'chiTiet'])->whereNumber('tin');
        Route::patch('/admin/tin-dang/{tin}', [QuanLyTinDangController::class, 'xuLy'])->whereNumber('tin')->middleware('throttle:30,1');
        Route::get('/users', [UserController::class, 'index']);
    });
});

Route::get('/test', function () {
    return response()->json(['message' => 'Kết nối thành công từ Laravel 11!']);
});
