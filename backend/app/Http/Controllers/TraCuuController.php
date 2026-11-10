<?php

namespace App\Http\Controllers;

use App\Models\DanhMucDoVat;
use App\Models\DiaDiem;
use App\Models\TinDang;
use App\Services\DuLieuTinDang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class TraCuuController extends Controller
{
    public function boLoc(): JsonResponse
    {
        return response()->json([
            'danhMuc' => DanhMucDoVat::where('trang_thai', true)->theoThuTu()->get(['id', 'ten_danh_muc'])
                ->map(fn ($muc) => ['id' => (string) $muc->id, 'name' => $muc->ten_danh_muc]),
            'diaDiem' => DiaDiem::where('trang_thai', true)->orderBy('ten_dia_diem')->get(['id', 'ten_dia_diem'])
                ->map(fn ($muc) => ['id' => (string) $muc->id, 'name' => $muc->ten_dia_diem]),
        ]);
    }

    public function danhSach(Request $request, DuLieuTinDang $duLieu): JsonResponse
    {
        $boLoc = $request->validate([
            'tuKhoa' => ['nullable', 'string', 'max:200'],
            'loaiTin' => ['nullable', Rule::in(['all', 'lost', 'found'])],
            'danhMuc' => ['nullable', 'integer', 'min:1'],
            'diaDiem' => ['nullable', 'integer', 'min:1'],
            'tuNgay' => ['nullable', 'date_format:Y-m-d'],
            'denNgay' => ['nullable', 'date_format:Y-m-d'],
            'sapXep' => ['nullable', Rule::in(['moi_nhat', 'cu_nhat'])],
            'trang' => ['nullable', 'integer', 'min:1', 'max:1000000'],
        ], [
            'date_format' => 'Vui lòng chọn ngày hợp lệ.',
            'integer' => 'Bộ lọc hoặc số trang không hợp lệ.',
            'in' => 'Lựa chọn bộ lọc không hợp lệ.',
            'tuKhoa.max' => 'Từ khóa không được vượt quá 200 ký tự.',
        ]);
        if (! empty($boLoc['tuNgay']) && ! empty($boLoc['denNgay']) && $boLoc['tuNgay'] > $boLoc['denNgay']) {
            throw ValidationException::withMessages(['denNgay' => 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.']);
        }
        $truyVan = TinDang::query()->where('trang_thai_kiem_duyet', 'hien_thi');
        if (in_array($boLoc['loaiTin'] ?? null, ['lost', 'found'], true)) {
            $truyVan->where('loai_tin', $boLoc['loaiTin'] === 'lost' ? 'bao_mat' : 'nhat_duoc');
        }
        foreach (['danhMuc' => 'danh_muc_id', 'diaDiem' => 'dia_diem_id'] as $ten => $cot) {
            if (! empty($boLoc[$ten])) {
                $truyVan->where($cot, $boLoc[$ten]);
            }
        }
        if (! empty($boLoc['tuNgay'])) {
            $truyVan->whereRaw('DATE(COALESCE(thoi_gian_xay_ra, created_at)) >= ?', [$boLoc['tuNgay']]);
        }
        if (! empty($boLoc['denNgay'])) {
            $truyVan->whereRaw('DATE(COALESCE(thoi_gian_xay_ra, created_at)) <= ?', [$boLoc['denNgay']]);
        }
        $duLieu->locTuKhoa($truyVan, trim($boLoc['tuKhoa'] ?? ''));
        $chieu = ($boLoc['sapXep'] ?? 'moi_nhat') === 'cu_nhat' ? 'asc' : 'desc';
        $truyVan->orderByRaw('COALESCE(thoi_gian_xay_ra, created_at) '.$chieu)->orderBy('id', $chieu);
        $nguoiXem = $request->user('web');

        return response()->json($duLieu->phanTrang($truyVan, (int) ($boLoc['trang'] ?? 1), $nguoiXem ? (string) $nguoiXem->id : null))
            ->header('Cache-Control', 'private, no-store');
    }

    public function chiTiet(Request $request, string $tin, DuLieuTinDang $duLieu): JsonResponse
    {
        $nguoiXem = $request->user('web');
        $banTin = TinDang::xemDuoc($nguoiXem)->with($duLieu->quanHe())->findOrFail($tin);
        $laChuTin = $nguoiXem !== null && (string) $banTin->nguoi_dung_id === (string) $nguoiXem->id;
        $coTheLienHe = $nguoiXem?->trang_thai === 'hoat_dong' && ($laChuTin || $banTin->daDuyetYeuCau($nguoiXem->id));
        $duLieuTin = $duLieu->congKhai($banTin, true);

        return response()->json(['data' => [
            ...$duLieuTin,
            'laChuTin' => $laChuTin,
            'coTheLienHe' => $coTheLienHe,
            ...($coTheLienHe ? ['contactPhone' => $banTin->thong_tin_lien_he, 'contactEmail' => $banTin->email_lien_he] : []),
            'hasClaim' => $duLieuTin['canClaim'] && ! $laChuTin && $nguoiXem?->trang_thai === 'hoat_dong'
                && $banTin->daGuiYeuCau($nguoiXem->id),
        ]])->header('Cache-Control', 'private, no-store');
    }
}
