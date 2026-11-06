<?php

namespace App\Http\Controllers;

use App\Models\DiaDiem;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class DiaDiemController extends Controller
{
    public function danhSach(): JsonResponse
    {
        return response()->json(['data' => DiaDiem::orderByDesc('id')->get()->map(fn ($muc) => $this->duLieuDiaDiem($muc))]);
    }

    public function them(Request $request): JsonResponse
    {
        $duLieu = $this->kiemTraDuLieu($request);
        $muc = $this->ghiDiaDiem(fn () => DiaDiem::create($duLieu));

        return response()->json(['data' => $this->duLieuDiaDiem($muc)], 201);
    }

    public function doiTrangThai(Request $request, string $id): JsonResponse
    {
        $duLieu = $request->validate([
            'dangHoatDong' => ['required', 'boolean'],
            'trangThaiHienTai' => ['required', 'boolean'],
        ]);

        return DB::transaction(function () use ($id, $duLieu) {
            $muc = DiaDiem::lockForUpdate()->findOrFail($id);
            if ($muc->trang_thai !== (bool) $duLieu['dangHoatDong']) {
                abort_if($muc->trang_thai !== (bool) $duLieu['trangThaiHienTai'], 409, 'Trạng thái địa điểm đã thay đổi. Vui lòng thử lại sau khi danh sách được tải lại.');
                $muc->update(['trang_thai' => (bool) $duLieu['dangHoatDong']]);
            }

            return response()->json(['data' => $this->duLieuDiaDiem($muc)]);
        });
    }

    public function sua(Request $request, string $id): JsonResponse
    {
        $muc = DiaDiem::findOrFail($id);
        $duLieu = $this->kiemTraDuLieu($request, $id);
        $muc = $this->ghiDiaDiem(function () use ($muc, $duLieu) {
            $muc->update($duLieu);
            return $muc->refresh();
        });
        return response()->json(['data' => $this->duLieuDiaDiem($muc)]);
    }

    private function kiemTraDuLieu(Request $request, ?string $id = null): array
    {
        if (is_string($request->input('tenDiaDiem'))) {
            $request->merge(['tenDiaDiem' => Str::squish($request->input('tenDiaDiem'))]);
        }
        $duLieu = $request->validate(['tenDiaDiem' => ['required', 'string', 'max:150'], 'moTa' => ['nullable', 'string', 'max:500'], 'dangHoatDong' => $id === null ? ['exclude'] : ['required', 'boolean']], [
            'tenDiaDiem.required' => 'Vui lòng nhập tên địa điểm.', 'tenDiaDiem.max' => 'Tên địa điểm tối đa 150 ký tự.', 'moTa.max' => 'Mô tả tối đa 500 ký tự.',
        ]);
        $tenChuan = Str::lower(Str::ascii($duLieu['tenDiaDiem']));
        $trung = DiaDiem::when($id !== null, fn ($query) => $query->where('id', '!=', $id))->pluck('ten_dia_diem')
            ->contains(fn ($ten) => Str::lower(Str::ascii(Str::squish($ten))) === $tenChuan);
        if ($trung) {
            throw ValidationException::withMessages(['tenDiaDiem' => 'Tên địa điểm đã tồn tại, kể cả trong danh sách ngừng sử dụng.']);
        }

        return ['ten_dia_diem' => $duLieu['tenDiaDiem'], 'mo_ta' => trim($duLieu['moTa'] ?? ''), 'trang_thai' => $id === null ? true : (bool) $duLieu['dangHoatDong']];
    }

    private function ghiDiaDiem(callable $ghi): DiaDiem
    {
        try {
            return $ghi();
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages(['tenDiaDiem' => 'Tên địa điểm đã tồn tại.']);
        }
    }

    private function duLieuDiaDiem(DiaDiem $muc): array
    {
        return ['id' => (string) $muc->id, 'tenDiaDiem' => $muc->ten_dia_diem, 'moTa' => $muc->mo_ta ?? '', 'dangHoatDong' => $muc->trang_thai];
    }
}
