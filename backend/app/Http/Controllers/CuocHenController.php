<?php

namespace App\Http\Controllers;

use App\Models\DiaDiem;
use App\Models\YeuCauNhanDo;
use App\Services\XuLyCuocHen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CuocHenController extends Controller
{
    public function danhSach(Request $request, XuLyCuocHen $xuLy)
    {
        $userId = $request->user()->id;
        $rows = YeuCauNhanDo::where(function ($q) use ($userId) {
            $q->where('nguoi_yeu_cau_id', $userId)->orWhere(function ($q) use ($userId) {
                $q->where('trang_thai', 'da_xac_minh')->whereHas('tinDang', fn ($q) => $q->where('nguoi_dung_id', $userId));
            });
        })->with(['tinDang.nguoiDung', 'nguoiYeuCau'])->latest('id')->paginate(20);
        $xuLy->capNhatLichHetHan($rows->getCollection()->modelKeys());
        $rows->getCollection()->load(['cuocHen.diaDiem', 'cuocHen.banGiao']);
        $rows->through(fn ($yc) => $this->duLieu($yc, $userId));

        return response()->json(['data' => $rows])->header('Cache-Control', 'private, no-store');
    }

    public function chiTiet(Request $request, string $id, XuLyCuocHen $xuLy)
    {
        $yeuCau = $this->thamGia($request, $id);
        $xuLy->capNhatLichHetHan([$yeuCau->id]);

        return response()->json([
            'data' => $this->duLieu($yeuCau, $request->user()->id),
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
