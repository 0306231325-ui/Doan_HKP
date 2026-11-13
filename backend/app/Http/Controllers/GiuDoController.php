<?php

namespace App\Http\Controllers;

use App\Models\TinDang;
use App\Services\DuLieuTinDang;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GiuDoController extends Controller
{
    public function danhSach(Request $request, string $tin, DuLieuTinDang $duLieu): JsonResponse
    {
        $mau = $request->validate(['trang' => ['nullable', 'integer', 'min:1', 'max:1000000']]);
        $id = (string) $request->user()->id;
        $this->kiemTraTinBaoMat(TinDang::find($tin), $id);

        return response()->json($duLieu->phanTrang($this->tinCoTheGui($id)->latest()->orderByDesc('id'), (int) ($mau['trang'] ?? 1), $id))
            ->header('Cache-Control', 'private, no-store');
    }

    public function guiThongBao(Request $request, string $tin): JsonResponse
    {
        $mau = $request->validate(['tinNhatId' => ['required', 'integer', 'min:1']], [
            'tinNhatId.required' => 'Vui lòng chọn tin nhặt được của bạn.',
        ]);
        $id = (string) $request->user()->id;

        return DB::transaction(function () use ($tin, $mau, $id) {
            $cacTin = TinDang::whereKey([$tin, $mau['tinNhatId']])->orderBy('id')->lockForUpdate()->get()->keyBy('id');
            $tinMat = $cacTin->get(ltrim($tin, '0'));
            $this->kiemTraTinBaoMat($tinMat, $id);
            $tinNhat = $this->tinCoTheGui($id)->whereKey($mau['tinNhatId'])->first();
            abort_unless($tinNhat, 422, 'Hãy chọn tin nhặt được của bạn đang mở, công khai và có câu hỏi nhận diện.');

            abort_if($tinNhat->yeuCauNhanDo()->where('trang_thai', 'da_xac_minh')
                ->where('nguoi_yeu_cau_id', '!=', $tinMat->nguoi_dung_id)->exists(), 409, 'Đồ vật đã có người nhận.');
            $yeuCau = $tinNhat->yeuCauNhanDo()->firstOrCreate([
                'nguoi_yeu_cau_id' => $tinMat->nguoi_dung_id,
            ], ['trang_thai' => 'da_xac_minh', 'nguoi_xu_ly_id' => $id, 'thoi_gian_xu_ly' => now()]);
            if ($yeuCau->trang_thai !== 'da_xac_minh') {
                $yeuCau->update(['trang_thai' => 'da_xac_minh', 'nguoi_xu_ly_id' => $id, 'thoi_gian_xu_ly' => now()]);
            }
            if ($yeuCau->wasRecentlyCreated || $yeuCau->wasChanged('trang_thai')) {
                $yeuCau->lichSu()->create([
                    'nguoi_thuc_hien_id' => $id, 'hanh_dong' => 'xac_nhan_giu_do',
                    'trang_thai_moi' => 'da_xac_minh',
                    'noi_dung' => 'Người giữ đồ xác nhận trả đồ cho người đăng tin báo mất. Hai bên tự liên hệ và đặt lịch.',
                ]);
            }
            $tinNhat->update(['tin_bao_mat_lien_quan_id' => $tinMat->id]);

            $thongBao = $tinNhat->thongBao()->firstOrCreate([
                'nguoi_dung_id' => $tinMat->nguoi_dung_id,
                'loai_thong_bao' => 'tim_thay_do',
            ], [
                'tieu_de' => 'Đồ bạn báo mất có thể đã được tìm thấy',
                'noi_dung' => 'Người giữ đồ đã xác nhận. Hai bên có thể liên hệ và đặt lịch ngay, không cần admin duyệt.',
                'yeu_cau_id' => $yeuCau->id,
            ]);

            if ($thongBao->wasRecentlyCreated) {
                $tinNhat->tinBaoMatDaThongBao()->syncWithoutDetaching([$tinMat->id]);
            }

            return $thongBao->wasRecentlyCreated
                ? response()->json(['message' => 'Đã thông báo cho người mất đồ. Hai bên có thể tự liên hệ và đặt lịch.', 'yeuCauId' => $yeuCau->id], 201)
                : response()->json(['message' => 'Hai bên có thể tự liên hệ và đặt lịch.', 'yeuCauId' => $yeuCau->id]);
        }, 3);
    }

    private function kiemTraTinBaoMat(?TinDang $tin, string $nguoiGuiId): void
    {
        abort_unless($tin && $tin->trang_thai_kiem_duyet === 'hien_thi', 404, 'Không tìm thấy tin báo mất.');
        abort_if((string) $tin->nguoi_dung_id === $nguoiGuiId, 403, 'Bạn không thể gửi thông báo cho tin của mình.');
        abort_unless($tin->loai_tin === 'bao_mat' && $tin->trang_thai === 'dang_mo', 409, 'Tin này không còn nhận thông báo tìm thấy đồ.');
    }

    private function tinCoTheGui(string $nguoiGuiId): Builder
    {
        return TinDang::where('nguoi_dung_id', $nguoiGuiId)
            ->where('loai_tin', 'nhat_duoc')
            ->where('trang_thai', 'dang_mo')
            ->where('trang_thai_kiem_duyet', 'hien_thi')
            ->whereHas('loiKhai.phienBanCauHoi', fn (Builder $cauHoi) => $cauHoi->whereNotNull('du_lieu->danh_muc_id'));
    }
}
