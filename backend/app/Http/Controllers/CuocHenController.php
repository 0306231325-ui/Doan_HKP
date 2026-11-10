<?php

namespace App\Http\Controllers;

use App\Models\CuocHen;
use App\Models\DiaDiem;
use App\Models\YeuCauNhanDo;
use App\Services\DuLieuTinDang;
use App\Services\XuLyCuocHen;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CuocHenController extends Controller
{
    public function danhSachQuanTri(Request $request)
    {
        $loc = $request->validate([
            'tuKhoa' => 'nullable|string|max:150',
            'ngay' => 'nullable|date_format:Y-m-d',
            'trangThai' => 'nullable|in:cho_xac_nhan,da_xac_nhan,da_hoan_tat,da_huy',
            'yeuCau' => 'nullable|integer|min:1',
        ]);
        $truyVan = CuocHen::with(['yeuCauNhanDo.tinDang', 'yeuCauNhanDo.nguoiYeuCau', 'nguoiGiuDo', 'diaDiem', 'banGiao']);
        if (! empty($loc['trangThai'])) {
            $truyVan->where('trang_thai', $loc['trangThai']);
        }
        if (! empty($loc['yeuCau'])) {
            $truyVan->where('yeu_cau_id', $loc['yeuCau']);
        }
        if (! empty($loc['ngay'])) {
            $ngay = CarbonImmutable::parse($loc['ngay'], 'Asia/Ho_Chi_Minh')->startOfDay();
            $truyVan->where('thoi_gian_hen_gap', '>=', $ngay->setTimezone(config('app.timezone')))
                ->where('thoi_gian_hen_gap', '<', $ngay->addDay()->setTimezone(config('app.timezone')));
        }
        $tuKhoa = trim($loc['tuKhoa'] ?? '');
        if ($tuKhoa !== '') {
            $mau = '%'.str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $tuKhoa).'%';
            $truyVan->where(fn ($q) => $q
                ->whereHas('yeuCauNhanDo.tinDang', fn ($tin) => $tin->whereRaw("tieu_de LIKE ? ESCAPE '!'", [$mau]))
                ->orWhereHas('nguoiGiuDo', fn ($nguoi) => $nguoi->whereRaw("ho_ten LIKE ? ESCAPE '!'", [$mau]))
                ->orWhereHas('yeuCauNhanDo.nguoiYeuCau', fn ($nguoi) => $nguoi->whereRaw("ho_ten LIKE ? ESCAPE '!'", [$mau])));
        }
        $rows = $truyVan->latest('thoi_gian_hen_gap')->latest('id')->paginate(20);
        $rows->through(fn (CuocHen $hen) => [
            ...$hen->only(['id', 'yeu_cau_id', 'trang_thai', 'thoi_gian_hen_gap', 'ly_do_huy', 'nguoi_giu_xac_nhan_luc', 'nguoi_nhan_xac_nhan_luc']),
            'tin_dang' => $hen->yeuCauNhanDo?->tinDang?->only(['id', 'tieu_de']),
            'nguoi_giu' => $hen->nguoiGiuDo?->only(['ho_ten', 'so_dien_thoai', 'email']),
            'nguoi_nhan' => $hen->yeuCauNhanDo?->nguoiYeuCau?->only(['ho_ten', 'so_dien_thoai', 'email']),
            'dia_diem' => $hen->diaDiem?->only(['id', 'ten_dia_diem']),
            'ban_giao' => $hen->banGiao?->only(['thoi_gian_ban_giao']),
        ]);

        return response()->json(['data' => $rows])->header('Cache-Control', 'private, no-store');
    }

    public function danhSach(Request $request, XuLyCuocHen $xuLy)
    {
        $userId = $request->user()->id;
        $rows = YeuCauNhanDo::where(function ($q) use ($userId) {
            $q->where('nguoi_yeu_cau_id', $userId)->orWhere(function ($q) use ($userId) {
                $q->where('trang_thai', 'da_xac_minh')->whereHas('tinDang', fn ($q) => $q->where('nguoi_dung_id', $userId));
            });
        })->when($request->query('loai') === 'lich_hen', fn ($q) => $q->where('trang_thai', 'da_xac_minh')->whereHas('cuocHen'))
            ->with(['tinDang.nguoiDung', 'nguoiYeuCau'])->latest('id')->paginate(20);
        $xuLy->capNhatLichHetHan($rows->getCollection()->modelKeys());
        $rows->getCollection()->load(['cuocHen.diaDiem', 'cuocHen.banGiao']);
        $rows->through(fn ($yc) => $this->duLieu($yc, $userId));

        return response()->json(['data' => $rows])->header('Cache-Control', 'private, no-store');
    }

    public function chiTiet(Request $request, string $id, XuLyCuocHen $xuLy, DuLieuTinDang $duLieuTin)
    {
        $yeuCau = $this->thamGia($request, $id);
        $xuLy->capNhatLichHetHan([$yeuCau->id]);
        $duLieu = $this->duLieu($yeuCau, $request->user()->id);
        $tin = $yeuCau->tinDang;
        $chiTiet = null;
        if ($tin && $tin->trang_thai_kiem_duyet !== 'da_an') {
            $tin->loadMissing($duLieuTin->quanHe());
            $chiTiet = [
                'loaiTin' => $tin->loai_tin, 'danhMuc' => $tin->danhMuc?->ten_danh_muc,
                'thoiGianXayRa' => $tin->thoi_gian_xay_ra?->format('Y-m-d'), 'gioXayRa' => $tin->gioXayRa(),
                'diaDiem' => $tin->diaDiem?->ten_dia_diem, 'viTriChiTiet' => $tin->dia_diem_chi_tiet,
                'anh' => $tin->hinhAnh->map(fn ($anh) => ['url' => $anh->duongDanHienThi(), 'moTa' => $anh->mo_ta])->values(),
            ];
        }

        return response()->json([
            'data' => [...$duLieu, 'chi_tiet' => $chiTiet],
            'diaDiem' => DiaDiem::where('trang_thai', true)->orderBy('ten_dia_diem')->get(['id', 'ten_dia_diem']),
            'bayGio' => now()->toISOString(),
        ])->header('Cache-Control', 'private, no-store');
    }

    public function taoLich(Request $request, XuLyCuocHen $xuLy): JsonResponse
    {
        $duLieu = $request->validate([
            'yeuCauId' => ['required', 'integer', 'min:1'],
            'diaDiemId' => ['required', 'integer', 'min:1'],
            'thoiGianHen' => ['required', 'date_format:Y-m-d H:i'],
        ], ['thoiGianHen.date_format' => 'Ngày giờ hẹn không hợp lệ.']);

        return response()->json(['data' => $xuLy->taoLich($duLieu, (int) $request->user()->id)], 201)
            ->header('Cache-Control', 'private, no-store');
    }

    public function xacNhanBanGiao(Request $request, XuLyCuocHen $xuLy): JsonResponse
    {
        $duLieu = $request->validate(['ma' => ['required', 'string', 'regex:/\A[0-9]{6}\z/']], [
            'ma.required' => 'Vui lòng nhập mã bàn giao gồm 6 số.',
            'ma.string' => 'Vui lòng nhập mã bàn giao gồm 6 số.',
            'ma.regex' => 'Vui lòng nhập mã bàn giao gồm 6 số.',
        ]);
        $ketQua = $xuLy->xacNhan($duLieu['ma'], (int) $request->user()->id);

        return response()->json($ketQua, isset($ketQua['hetHan']) ? 409 : 200)->header('Cache-Control', 'private, no-store');
    }

    private function thamGia(Request $request, string $id): YeuCauNhanDo
    {
        $yc = YeuCauNhanDo::with('tinDang')->findOrFail($id);
        $userId = (string) $request->user()->id;
        abort_unless($userId === (string) $yc->nguoi_yeu_cau_id || ($yc->trang_thai === 'da_xac_minh' && $userId === (string) $yc->tinDang?->nguoi_dung_id), 404);

        return $yc;
    }

    private function duLieu(YeuCauNhanDo $yc, $userId): array
    {
        $yc->loadMissing(['tinDang.nguoiDung', 'nguoiYeuCau', 'cuocHen.diaDiem', 'cuocHen.banGiao']);
        $approved = $yc->trang_thai === 'da_xac_minh';
        $holder = (string) $yc->tinDang?->nguoi_dung_id === (string) $userId;
        $contact = $holder ? $yc->nguoiYeuCau : $yc->tinDang?->nguoiDung;

        return [
            ...$yc->only(['id', 'tin_dang_id', 'trang_thai', 'created_at', 'ghi_chu_admin']), 'laNguoiGiu' => $holder,
            'tin_dang' => $yc->tinDang?->only(['id', 'tieu_de', 'trang_thai']),
            'lienHe' => $approved ? ['hoTen' => $contact?->ho_ten, 'soDienThoai' => $holder ? $contact?->so_dien_thoai : ($yc->tinDang?->thong_tin_lien_he ?: $contact?->so_dien_thoai), 'email' => $holder ? $contact?->email : ($yc->tinDang?->email_lien_he ?: $contact?->email)] : null,
            'coTheDatLich' => $approved && in_array($yc->tinDang?->trang_thai, XuLyCuocHen::TIN_DUOC_DAT_LICH, true)
                && ! $yc->cuocHen->contains(fn ($h) => in_array($h->trang_thai, XuLyCuocHen::LICH_DANG_HIEU_LUC, true)),
            'cuoc_hen' => $approved ? $yc->cuocHen->sortByDesc('id')->map(fn ($h) => [
                ...$h->only(['id', 'trang_thai', 'thoi_gian_hen_gap', 'nguoi_giu_xac_nhan_luc', 'nguoi_nhan_xac_nhan_luc', 'ly_do_huy']),
                'laNguoiDeXuat' => (string) $h->nguoi_de_xuat_id === (string) $userId,
                'dungMaBanGiao' => $h->banGiao?->ma_ban_giao_hash !== null,
                'lichCu' => ! in_array((string) $h->nguoi_de_xuat_id, [(string) $yc->tinDang?->nguoi_dung_id, (string) $yc->nguoi_yeu_cau_id]),
                'dia_diem' => $h->diaDiem?->only(['id', 'ten_dia_diem']), 'ban_giao' => $h->banGiao?->only(['thoi_gian_ban_giao']),
            ])->values() : [],
        ];
    }
}
