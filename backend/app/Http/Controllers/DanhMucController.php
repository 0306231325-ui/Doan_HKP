<?php

namespace App\Http\Controllers;

use App\Models\DanhMucDoVat;
use Illuminate\Database\QueryException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class DanhMucController extends Controller
{
    public function danhSach(): JsonResponse
    {
        return response()->json(['data' => DanhMucDoVat::theoThuTu()->get()->map(fn ($muc) => $this->duLieuDanhMuc($muc))]);
    }

    public function them(Request $request): JsonResponse
    {
        $duLieu = $this->kiemTraDuLieu($request);
        $muc = $this->ghiDanhMuc(fn () => DanhMucDoVat::create([...$duLieu, 'trang_thai' => true]));

        return response()->json(['data' => $this->duLieuDanhMuc($muc)], 201);
    }

    public function doiTrangThai(Request $request, string $id): JsonResponse
    {
        $duLieu = $request->validate([
            'dangHoatDong' => ['required', 'boolean'],
            'trangThaiHienTai' => ['required', 'boolean'],
        ]);

        return DB::transaction(function () use ($id, $duLieu) {
            $muc = DanhMucDoVat::lockForUpdate()->findOrFail($id);
            if ($muc->trang_thai !== (bool) $duLieu['dangHoatDong']) {
                abort_if($muc->trang_thai !== (bool) $duLieu['trangThaiHienTai'], 409, 'Trạng thái danh mục đã thay đổi. Vui lòng thử lại sau khi danh sách được tải lại.');
                $muc->update(['trang_thai' => (bool) $duLieu['dangHoatDong']]);
            }

            return response()->json(['data' => $this->duLieuDanhMuc($muc)]);
        });
    }

    public function doiThuTu(Request $request, string $id): JsonResponse
    {
        $duLieu = $request->validate([
            'viTri' => ['required', 'integer', 'min:1'],
            'danhSachHienTai' => ['required', 'array', 'list'],
            'danhSachHienTai.*' => ['required', 'integer', 'min:1', 'distinct'],
        ]);

        return DB::transaction(function () use ($id, $duLieu) {
            $cacMuc = DanhMucDoVat::theoThuTu()->lockForUpdate()->get();
            $cacId = $cacMuc->map(fn ($muc) => (string) $muc->id)->all();
            $viTriCu = array_search($id, $cacId, true);
            abort_if($viTriCu === false, 404, 'Không tìm thấy danh mục.');
            abort_if($cacId !== array_map('strval', $duLieu['danhSachHienTai']), 409, 'Thứ tự danh mục đã thay đổi. Vui lòng thử lại sau khi danh sách được tải lại.');

            $viTriMoi = (int) $duLieu['viTri'] - 1;
            if ($viTriMoi >= $cacMuc->count()) {
                throw ValidationException::withMessages(['viTri' => 'Vị trí vượt quá số danh mục hiện có.']);
            }

            if ($viTriCu !== $viTriMoi) {
                $muc = $cacMuc->splice($viTriCu, 1)->first();
                $cacMuc->splice($viTriMoi, 0, [$muc]);
                foreach ($cacMuc as $viTri => $muc) {
                    if ((int) $muc->thu_tu !== $viTri + 1) {
                        $muc->thu_tu = $viTri + 1;
                        $muc->save();
                    }
                }
            }

            return response()->json(['data' => $cacMuc->map(fn ($muc) => $this->duLieuDanhMuc($muc))->values()]);
        }, 3);
    }

    public function xoa(string $id): JsonResponse
    {
        try {
            return DB::transaction(function () use ($id) {
                $muc = DanhMucDoVat::lockForUpdate()->findOrFail($id);
                abort_if($muc->tinDang()->withTrashed()->exists() || $muc->cauHoi()->exists(), 409, 'Danh mục đang có tin đăng hoặc câu hỏi nên không thể xóa. Bạn có thể ẩn danh mục này.');
                $muc->delete();

                return response()->json(['message' => 'Đã xóa danh mục.']);
            });
        } catch (QueryException $loi) {
            if (in_array((int) ($loi->errorInfo[1] ?? 0), [1451, 787], true)) {
                abort(409, 'Danh mục đang được sử dụng nên không thể xóa. Bạn có thể ẩn danh mục này.');
            }
            throw $loi;
        }
    }

    private function kiemTraDuLieu(Request $request): array
    {
        if (is_string($request->input('tenDanhMuc'))) {
            $request->merge(['tenDanhMuc' => Str::squish($request->input('tenDanhMuc'))]);
        }
        $duLieu = $request->validate(['tenDanhMuc' => ['required', 'string', 'max:100'], 'moTa' => ['nullable', 'string', 'max:500']], [
            'tenDanhMuc.required' => 'Vui lòng nhập tên danh mục.', 'tenDanhMuc.max' => 'Tên danh mục tối đa 100 ký tự.', 'moTa.max' => 'Mô tả tối đa 500 ký tự.',
        ]);
        $tenChuan = Str::lower(Str::ascii($duLieu['tenDanhMuc']));
        $trung = DanhMucDoVat::pluck('ten_danh_muc')
            ->contains(fn ($ten) => Str::lower(Str::ascii(Str::squish($ten))) === $tenChuan);
        if ($trung) {
            throw ValidationException::withMessages(['tenDanhMuc' => 'Tên danh mục đã tồn tại, kể cả trong danh sách ngừng sử dụng.']);
        }

        return ['ten_danh_muc' => $duLieu['tenDanhMuc'], 'mo_ta' => trim($duLieu['moTa'] ?? '')];
    }

    private function ghiDanhMuc(callable $ghi): DanhMucDoVat
    {
        try {
            return $ghi();
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages(['tenDanhMuc' => 'Tên danh mục đã tồn tại.']);
        }
    }

    private function duLieuDanhMuc(DanhMucDoVat $muc): array
    {
        return ['id' => (string) $muc->id, 'tenDanhMuc' => $muc->ten_danh_muc, 'moTa' => $muc->mo_ta ?? '', 'dangHoatDong' => $muc->trang_thai];
    }
}
