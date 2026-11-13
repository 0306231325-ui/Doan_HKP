<?php

namespace App\Http\Controllers;

use App\Models\TinDang;
use App\Services\CauTraLoiTinDang;
use App\Services\DuLieuTinDang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

class YeuCauNhanDoController extends Controller
{
    public function bieuMau(Request $request, string $tin, CauTraLoiTinDang $traLoi, DuLieuTinDang $duLieu): JsonResponse
    {
        $banTin = $this->timTin($tin);
        $this->kiemTraNhan($banTin, $request);
        $cacLoi = $this->cacLoiKhai($banTin);
        abort_if($cacLoi->isEmpty(), 409, 'Tin này chưa có bộ câu hỏi nhận diện để gửi yêu cầu.');
        $yeuCauId = $banTin->yeuCauDangXuLyId($request->user()->id);

        return response()->json([
            'tin' => $duLieu->congKhai($banTin->load(['danhMuc', 'diaDiem', 'nguoiDung', 'hinhAnh' => fn ($q) => $q->where('pham_vi', 'cong_khai')->orderBy('thu_tu')])),
            'data' => $cacLoi->map(fn ($loi) => $traLoi->cauHoi($loi->phienBanCauHoi, (string) $loi->id))->values(),
            'daGui' => $yeuCauId !== null,
            'yeuCauId' => $yeuCauId,
        ])->header('Cache-Control', 'no-store');
    }

    public function them(Request $request, string $tin, CauTraLoiTinDang $traLoi): JsonResponse
    {
        if (! $request->isJson() && is_string($request->input('cauTraLoi'))) {
            $request->merge(['cauTraLoi' => json_decode($request->input('cauTraLoi'), true)]);
        }
        $mau = $request->validate([
            'loiNhan' => ['nullable', 'string', 'max:2000'],
            'xacNhan' => ['accepted'], 'cauTraLoi' => ['required', 'array', 'max:500'],
            'cauTraLoi.*' => ['required', 'array:id,giaTri'],
            'cauTraLoi.*.id' => ['required', 'integer', 'distinct', 'min:1'],
            'cauTraLoi.*.giaTri' => ['present', 'nullable'],
            'anh' => ['nullable', 'array', 'max:3'],
            'anh.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120', 'dimensions:max_width=8192,max_height=8192'],
        ], [
            'anh.max' => 'Mỗi yêu cầu tối đa 3 ảnh xác minh.',
            'anh.*.uploaded' => 'Không tải được ảnh. Hãy kiểm tra dung lượng và thử lại.',
            'anh.*.image' => 'Tệp xác minh tải lên phải là hình ảnh.',
            'anh.*.mimes' => 'Chỉ nhận ảnh JPG, PNG hoặc WebP.',
            'anh.*.max' => 'Mỗi ảnh tối đa 5 MB.',
            'anh.*.dimensions' => 'Ảnh xác minh tối đa 8192 pixel mỗi chiều.',
        ]);

        $tepDaLuu = [];
        try {
            return DB::transaction(function () use ($request, $tin, $mau, $traLoi, &$tepDaLuu) {
                $banTin = $this->timTin($tin, true);
                $this->kiemTraNhan($banTin, $request);
                $yeuCauId = $banTin->yeuCauDangXuLyId($request->user()->id);
                if ($yeuCauId !== null) {
                    return response()->json(['message' => 'Bạn đã gửi yêu cầu cho tin này.', 'daGui' => true, 'yeuCauId' => $yeuCauId]);
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
                $thuMuc = (string) $yeuCau->id;
                $maYeuCau = 'YC-'.str_pad($thuMuc, 4, '0', STR_PAD_LEFT);
                foreach (array_values($mau['anh'] ?? []) as $thuTu => $tep) {
                    $tenAnh = $maYeuCau.'-'.($thuTu + 1).'.'.$tep->guessExtension();
                    $tepDaLuu[] = $thuMuc.'/'.$tenAnh;
                    $duongDan = $tep->storeAs($thuMuc, $tenAnh, 'minh-chung-yeu-cau');
                    if (! $duongDan) {
                        throw new RuntimeException('Không lưu được ảnh xác minh.');
                    }
                    $yeuCau->minhChung()->create(['duong_dan' => 'minh-chung-yeu-cau/'.$duongDan, 'thu_tu' => $thuTu]);
                }
                $yeuCau->lichSu()->create(['nguoi_thuc_hien_id' => $request->user()->id, 'hanh_dong' => 'gui_yeu_cau', 'trang_thai_moi' => 'cho_kiem_tra']);
                $yeuCau->thongBao()->create([
                    'nguoi_dung_id' => $yeuCau->nguoi_yeu_cau_id,
                    'tin_dang_id' => $banTin->id,
                    'loai_thong_bao' => 'gui_yeu_cau',
                    'tieu_de' => 'Đã gửi yêu cầu nhận đồ',
                    'noi_dung' => 'Vui lòng chờ xét duyệt. Bấm để xem trạng thái.',
                ]);

                return response()->json(['message' => 'Đã gửi yêu cầu nhận đồ. Vui lòng chờ xét duyệt.', 'daGui' => true, 'yeuCauId' => $yeuCau->id], 201);
            });
        } catch (Throwable $loi) {
            if ($tepDaLuu) {
                Storage::disk('minh-chung-yeu-cau')->delete($tepDaLuu);
            }
            throw $loi;
        }
    }

    public function lienHe(Request $request, string $tin): JsonResponse
    {
        $user = $request->user();
        $banTin = TinDang::xemDuoc($user)->findOrFail($tin);
        $laChuTin = (string) $user->id === (string) $banTin->nguoi_dung_id;
        $daDuyet = $banTin->daDuyetYeuCau($user->id);
        abort_unless($banTin->loai_tin === 'bao_mat' || $laChuTin || $daDuyet, 403, 'Liên hệ chỉ mở cho người đăng và người có yêu cầu đã được duyệt.');
        return response()->json(['data' => ['soDienThoai' => $banTin->thong_tin_lien_he, 'email' => $banTin->email_lien_he, 'laChuTin' => $laChuTin, 'daGui' => $daDuyet]])->header('Cache-Control', 'private, no-store');
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
        return $tin->loiKhai()->with('phienBanCauHoi')->get()
            ->filter(fn ($loi) => $loi->phienBanCauHoi && isset($loi->phienBanCauHoi->du_lieu['danh_muc_id']))
            ->sortBy(fn ($loi) => [(int) $loi->phienBanCauHoi->du_lieu['thu_tu'], $loi->cau_hoi_id]);
    }
}
