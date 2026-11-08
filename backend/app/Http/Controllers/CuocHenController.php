<?php

namespace App\Http\Controllers;

use App\Models\DiaDiem;
use App\Models\YeuCauNhanDo;
use Illuminate\Http\Request;

class CuocHenController extends Controller
{
    public function danhSach(Request $request)
    {
        $userId = $request->user()->id;
        $rows = YeuCauNhanDo::where(function ($q) use ($userId) {
            $q->where('nguoi_yeu_cau_id', $userId)->orWhere(function ($q) use ($userId) {
                $q->where('trang_thai', 'da_xac_minh')->whereHas('tinDang', fn ($q) => $q->where('nguoi_dung_id', $userId));
            });
        })->with(['tinDang.nguoiDung', 'nguoiYeuCau', 'cuocHen.diaDiem', 'cuocHen.banGiao'])->latest('id')->paginate(20);
        $rows->through(fn ($yc) => $this->duLieu($yc, $userId));

        return response()->json(['data' => $rows])->header('Cache-Control', 'private, no-store');
    }

    public function chiTiet(Request $request, string $id)
    {
        return response()->json([
            'data' => $this->duLieu($this->thamGia($request, $id), $request->user()->id),
            'diaDiem' => DiaDiem::where('trang_thai', true)->orderBy('ten_dia_diem')->get(['id', 'ten_dia_diem']),
            'bayGio' => now()->toISOString(),
        ])->header('Cache-Control', 'private, no-store');
    }

    private function thamGia(Request $request, string $id, bool $lock = false): YeuCauNhanDo
    {
        $q = YeuCauNhanDo::with('tinDang');
        $yc = ($lock ? $q->lockForUpdate() : $q)->findOrFail($id);
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
            'cuoc_hen' => $approved ? $yc->cuocHen->map(fn ($h) => [
                ...$h->only(['id', 'trang_thai', 'thoi_gian_hen_gap', 'nguoi_giu_xac_nhan_luc', 'nguoi_nhan_xac_nhan_luc', 'ly_do_huy']),
                'laNguoiDeXuat' => (string) $h->nguoi_de_xuat_id === (string) $userId,
                'lichCu' => ! in_array((string) $h->nguoi_de_xuat_id, [(string) $yc->tinDang?->nguoi_dung_id, (string) $yc->nguoi_yeu_cau_id]),
                'dia_diem' => $h->diaDiem?->only(['id', 'ten_dia_diem']), 'ban_giao' => $h->banGiao?->only(['thoi_gian_ban_giao', 'ghi_chu_ban_giao']),
            ])->values() : [],
        ];
    }
}
