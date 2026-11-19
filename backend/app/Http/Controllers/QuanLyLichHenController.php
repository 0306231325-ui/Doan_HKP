<?php

namespace App\Http\Controllers;

use App\Models\CuocHen;
use Illuminate\Http\Request;

class QuanLyLichHenController extends Controller
{
    public function danhSach(Request $request)
    {
        $loc = $request->validate([
            'tuKhoa' => 'nullable|string|max:150',
            'ngay' => 'nullable|date_format:Y-m-d',
            'trangThai' => 'nullable|in:cho_xac_nhan,da_xac_nhan,da_huy,da_hoan_tat',
            'yeuCau' => 'nullable|integer|min:1',
            'page' => 'nullable|integer|min:1',
        ]);
        $rows = CuocHen::query()
            ->when($loc['trangThai'] ?? null, fn ($q, $value) => $q->where('trang_thai', $value))
            ->when($loc['yeuCau'] ?? null, fn ($q, $value) => $q->where('yeu_cau_id', $value))
            ->when($loc['ngay'] ?? null, function ($q, $value) {
                $start = \Carbon\Carbon::parse($value, 'Asia/Ho_Chi_Minh')->startOfDay()->setTimezone(config('app.timezone'));
                $end = $start->copy()->addDay();
                $q->where('thoi_gian_hen_gap', '>=', $start)->where('thoi_gian_hen_gap', '<', $end);
            })
            ->when(trim($loc['tuKhoa'] ?? ''), fn ($q, $value) => $q->where(function ($q) use ($value) {
                $q->whereHas('yeuCauNhanDo.tinDang', fn ($q) => $q->where('tieu_de', 'like', "%{$value}%"))
                    ->orWhereHas('nguoiGiuDo', fn ($q) => $q->where('ho_ten', 'like', "%{$value}%"))
                    ->orWhereHas('yeuCauNhanDo.nguoiYeuCau', fn ($q) => $q->where('ho_ten', 'like', "%{$value}%"));
            }))
            ->with(['yeuCauNhanDo.tinDang', 'yeuCauNhanDo.nguoiYeuCau', 'nguoiGiuDo', 'diaDiem', 'banGiao'])
            ->orderByDesc('thoi_gian_hen_gap')->orderByDesc('id')->paginate(5);
        $rows->through(function ($hen) {
            $nguoi = fn ($n) => $n?->only(['id', 'ho_ten', 'so_dien_thoai', 'email']);
            return [
                ...$hen->only(['id', 'yeu_cau_id', 'trang_thai', 'thoi_gian_hen_gap', 'ly_do_huy', 'nguoi_giu_xac_nhan_luc', 'nguoi_nhan_xac_nhan_luc']),
                'tin_dang' => $hen->yeuCauNhanDo?->tinDang?->only(['id', 'tieu_de']),
                'nguoi_giu' => $nguoi($hen->nguoiGiuDo),
                'nguoi_nhan' => $nguoi($hen->yeuCauNhanDo?->nguoiYeuCau),
                'dia_diem' => $hen->diaDiem?->only(['id', 'ten_dia_diem']),
                'ban_giao' => $hen->banGiao?->only(['thoi_gian_ban_giao', 'ghi_chu_ban_giao']),
            ];
        });
        return response()->json(['data' => $rows])->header('Cache-Control', 'private, no-store');
    }
}
