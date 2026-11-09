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

            $thongBao = $tinNhat->thongBao()->firstOrCreate([
                'nguoi_dung_id' => $tinMat->nguoi_dung_id,
                'loai_thong_bao' => 'tim_thay_do',
            ], [
                'tieu_de' => 'Đồ bạn báo mất có thể đã được tìm thấy',
                'noi_dung' => 'Bấm để xem tin nhặt được và gửi yêu cầu nhận lại đồ.',
            ]);

            return $thongBao->wasRecentlyCreated
                ? response()->json(['message' => 'Đã gửi thông báo cho người đăng tin báo mất.'], 201)
                : response()->json(['message' => 'Bạn đã gửi thông báo về tin nhặt được này cho người đăng.']);
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
