<?php

namespace App\Http\Controllers;

use App\Models\TinDang;
use App\Services\CauTraLoiTinDang;
use App\Services\DuLieuTinDang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class YeuCauNhanDoController extends Controller
{
    public function bieuMau(Request $request, string $tin, CauTraLoiTinDang $traLoi, DuLieuTinDang $duLieu): JsonResponse
    {
        $banTin = $this->timTin($tin);
        $this->kiemTraNhan($banTin, $request);
        $cacLoi = $this->cacLoiKhai($banTin);
        abort_if($cacLoi->isEmpty(), 409, 'Tin này chưa có bộ câu hỏi nhận diện để gửi yêu cầu.');

        return response()->json([
            'tin' => $duLieu->congKhai($banTin->load(['danhMuc', 'diaDiem', 'nguoiDung', 'hinhAnh' => fn ($q) => $q->where('pham_vi', 'cong_khai')->orderBy('thu_tu')])),
            'data' => $cacLoi->map(fn ($loi) => $traLoi->cauHoi($loi->phienBanCauHoi, (string) $loi->id))->values(),
            'daGui' => $this->daGui($banTin, $request),
        ])->header('Cache-Control', 'no-store');
    }

    public function them(Request $request, string $tin, CauTraLoiTinDang $traLoi): JsonResponse
    {
        $mau = $request->validate([
            'loiNhan' => ['nullable', 'string', 'max:2000'],
            'xacNhan' => ['accepted'], 'cauTraLoi' => ['required', 'array', 'max:500'],
            'cauTraLoi.*' => ['required', 'array:id,giaTri'],
            'cauTraLoi.*.id' => ['required', 'integer', 'distinct', 'min:1'],
            'cauTraLoi.*.giaTri' => ['present', 'nullable'],
        ]);

        return DB::transaction(function () use ($request, $tin, $mau, $traLoi) {
            $banTin = $this->timTin($tin, true);
            $this->kiemTraNhan($banTin, $request);
            if ($this->daGui($banTin, $request)) {
                return response()->json(['message' => 'Bạn đã gửi yêu cầu cho tin này.', 'daGui' => true]);
            }
            $cacLoi = $this->cacLoiKhai($banTin);
            $dapAn = collect($mau['cauTraLoi'])->keyBy('id');
            abort_unless($cacLoi->isNotEmpty() && $cacLoi->count() === $dapAn->count() && $cacLoi->every(fn ($loi) => $dapAn->has($loi->id)), 422, 'Vui lòng trả lời đúng bộ câu hỏi của tin đăng.');
            $cotTraLoi = $cacLoi->map(fn ($loi) => [
                'tin_dang_id' => $banTin->id, 'loi_khai_tin_dang_id' => $loi->id,
                ...$traLoi->giaTri($traLoi->cauHoi($loi->phienBanCauHoi, (string) $loi->id), $dapAn[$loi->id]['giaTri'], 'cauTraLoi.'.$loi->id),
            ]);
            $yeuCau = $banTin->yeuCauNhanDo()->create([
                'nguoi_yeu_cau_id' => $request->user()->id, 'loi_nhan' => $mau['loiNhan'] ?? null, 'trang_thai' => 'cho_kiem_tra',
            ]);
            $yeuCau->traLoi()->createMany($cotTraLoi);
            $yeuCau->lichSu()->create(['nguoi_thuc_hien_id' => $request->user()->id, 'hanh_dong' => 'gui_yeu_cau', 'trang_thai_moi' => 'cho_kiem_tra']);

            return response()->json(['message' => 'Đã gửi yêu cầu. Vui lòng chờ quản trị viên xác minh.', 'daGui' => true], 201);
        });
    }

    public function lienHe(Request $request, string $tin): JsonResponse
    {
        $banTin = $this->timTin($tin);
        $user = $request->user();
        abort_unless($user->id === $banTin->nguoi_dung_id || $user->vai_tro === 'quan_tri' || $this->daGui($banTin, $request), 403, 'Gửi yêu cầu nhận đồ để xem liên hệ.');

        return response()->json(['data' => ['soDienThoai' => $banTin->thong_tin_lien_he, 'email' => $banTin->email_lien_he, 'laChuTin' => $user->id === $banTin->nguoi_dung_id, 'daGui' => $this->daGui($banTin, $request)]])->header('Cache-Control', 'private, no-store');
    }

    private function timTin(string $id, bool $khoa = false): TinDang
    {
        $q = TinDang::where('trang_thai_kiem_duyet', 'hien_thi');
        if ($khoa) {
            $q->lockForUpdate();
        }

        return $q->findOrFail($id);
    }

    private function kiemTraNhan(TinDang $tin, Request $request): void
    {
        abort_if($tin->nguoi_dung_id === $request->user()->id, 403, 'Bạn không thể xin nhận đồ từ tin của mình.');
        abort_unless($tin->loai_tin === 'nhat_duoc' && $tin->trang_thai === 'dang_mo', 409, 'Tin này không còn nhận yêu cầu.');
    }

    private function cacLoiKhai(TinDang $tin): Collection
    {
        return $tin->loiKhai()->with('phienBanCauHoi')->orderBy('id')->get()->filter(fn ($loi) => $loi->phienBanCauHoi && isset($loi->phienBanCauHoi->du_lieu['danh_muc_id']));
    }

    private function daGui(TinDang $tin, Request $request): bool
    {
        return $tin->yeuCauNhanDo()->where('nguoi_yeu_cau_id', $request->user()->id)->whereIn('trang_thai', ['cho_kiem_tra', 'can_bo_sung', 'da_xac_minh'])->exists();
    }
}
