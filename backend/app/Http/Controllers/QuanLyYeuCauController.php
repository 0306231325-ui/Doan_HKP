<?php

namespace App\Http\Controllers;

use App\Models\ThongBao;
use App\Models\TinDang;
use App\Models\YeuCauNhanDo;
use App\Services\TienDoYeuCau;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class QuanLyYeuCauController extends Controller
{
    public function cuaToi(Request $request)
    {
        $rows = YeuCauNhanDo::where('nguoi_yeu_cau_id', $request->user()->id)->with('tinDang')->latest('id')->paginate(20);
        $rows->through(fn ($yc) => [
            ...$yc->only(['id', 'tin_dang_id', 'trang_thai', 'created_at', 'ghi_chu_admin']),
            'tin_dang' => $yc->tinDang?->only(['id', 'tieu_de']),
        ]);

        return response()->json(['data' => $rows])->header('Cache-Control', 'private, no-store');
    }

    public function danhSach(Request $request, TienDoYeuCau $tienDo)
    {
        $filters = $request->validate(['trangThai' => ['nullable', Rule::in(TienDoYeuCau::CAC_TRANG_THAI)], 'tuKhoa' => 'nullable|string|max:200']);
        $tong = YeuCauNhanDo::count();
        $hoanTat = $tienDo->hoanTat(YeuCauNhanDo::query())->count();
        $stats = ['tong' => $tong, 'choKiemTra' => YeuCauNhanDo::where('trang_thai', 'cho_kiem_tra')->count(), 'dangGiaoNhan' => $tienDo->loc(YeuCauNhanDo::query(), 'dang_giao_nhan')->count(), 'hoanTat' => $hoanTat];
        $q = YeuCauNhanDo::with(['tinDang', 'nguoiYeuCau', 'cuocHen.banGiao']);
        if (! empty($filters['trangThai'])) {
            $tienDo->loc($q, $filters['trangThai']);
        }
        $keyword = trim($filters['tuKhoa'] ?? '');
        if ($keyword !== '') {
            $q->where(function ($q) use ($keyword) {
                $pattern = '%'.str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $keyword).'%';
                $id = preg_replace('/^YC-0*/i', '', $keyword);
                $q->whereHas('tinDang', fn ($q) => $q->whereRaw("tieu_de LIKE ? ESCAPE '!'", [$pattern]))
                    ->orWhereHas('nguoiYeuCau', fn ($q) => $q->whereRaw("ho_ten LIKE ? ESCAPE '!'", [$pattern])->orWhereRaw("email LIKE ? ESCAPE '!'", [$pattern]));
                if (ctype_digit($id)) {
                    $q->orWhere('yeu_cau_nhan_do.id', (int) $id);
                }
            });
        }
        $rows = $q->latest('id')->paginate(20);
        $rows->through(fn ($yc) => $tienDo->duLieu($yc));

        return response()->json(['data' => $rows, 'thongKe' => $stats])->header('Cache-Control', 'private, no-store');
    }

    public function chiTiet(string $id)
    {
        $yc = YeuCauNhanDo::with(['tinDang.nguoiDung', 'nguoiYeuCau', 'traLoi.loiKhaiTinDang.phienBanCauHoi', 'minhChung', 'lichSu.nguoiThucHien', 'cuocHen.banGiao'])->findOrFail($id);

        return response()->json(['data' => app(TienDoYeuCau::class)->duLieu($yc)])->header('Cache-Control', 'private, no-store');
    }

    public function anh(string $id, string $anh)
    {
        $file = YeuCauNhanDo::findOrFail($id)->minhChung()->findOrFail($anh);
        $prefix = 'minh-chung-yeu-cau/';
        abort_unless(str_starts_with($file->duong_dan, $prefix), 404);
        $disk = Storage::disk('minh-chung-yeu-cau');
        $path = substr($file->duong_dan, strlen($prefix));
        abort_if(str_contains($path, '..') || ! $disk->exists($path), 404);

        return response()->file($disk->path($path), ['Cache-Control' => 'private, no-store', 'X-Content-Type-Options' => 'nosniff']);
    }

    public function xuLy(Request $request, string $id)
    {
        $data = $request->validate([
            'hanhDong' => 'required|in:can_bo_sung,tu_choi,da_xac_minh',
            'ghiChu' => 'required_unless:hanhDong,da_xac_minh|nullable|string|max:2000',
            'doiChieu' => 'sometimes|array|max:500',
            'doiChieu.*' => 'required|in:khop,khong_khop,chua_du_can_cu,chua_danh_gia',
        ]);
        $data['ghiChu'] = $data['hanhDong'] === 'da_xac_minh'
            ? 'Yêu cầu nhận lại đồ đã được duyệt.'
            : trim($data['ghiChu'] ?? '');
        abort_if($data['ghiChu'] === '', 422, 'Vui lòng nhập lý do từ chối hoặc nội dung cần bổ sung.');
        DB::transaction(function () use ($request, $id, $data) {
            // Lock the item first: competing claims for the same item must serialize.
            $itemId = YeuCauNhanDo::findOrFail($id)->tin_dang_id;
            $tin = TinDang::lockForUpdate()->findOrFail($itemId);
            $yc = YeuCauNhanDo::lockForUpdate()->findOrFail($id);
            $old = $yc->trang_thai;
            $action = $data['hanhDong'];
            abort_if(in_array($old, ['tu_choi', 'da_huy']) || $tin->trang_thai === 'da_hoan_tat', 409, 'Yêu cầu hoặc tin đã kết thúc.');
            abort_unless(in_array($old, ['cho_kiem_tra', 'can_bo_sung']) || ($old === 'da_xac_minh' && $action === 'tu_choi'), 409, 'Yêu cầu đã được duyệt.');
            if ($old === 'da_xac_minh') {
                $yc->cuocHen()->whereIn('trang_thai', ['cho_xac_nhan', 'da_xac_nhan'])->update(['trang_thai' => 'da_huy', 'ly_do_huy' => trim($data['ghiChu'])]);
                $tin->update(['trang_thai' => 'dang_mo']);
            }
            $answers = $yc->traLoi()->get();
            foreach ($data['doiChieu'] ?? [] as $answerId => $result) {
                $answer = $answers->firstWhere('id', $answerId);
                abort_unless($answer, 422, 'Câu trả lời không thuộc yêu cầu.');
                $answer->update(['ket_qua_doi_chieu' => $result]);
            }
            if ($action === 'da_xac_minh') {
                abort_unless($tin->trang_thai === 'dang_mo', 409, 'Đồ vật đang chờ bàn giao hoặc đã đóng.');
                abort_if($answers->isEmpty() || $answers->contains(fn ($a) => $a->ket_qua_doi_chieu !== 'khop'), 422, 'Cần đối chiếu tất cả câu trả lời là khớp trước khi chấp thuận.');
                $tin->update(['trang_thai' => 'cho_ban_giao']);
            }
            $yc->update(['trang_thai' => $action, 'ghi_chu_admin' => trim($data['ghiChu']), 'nguoi_xu_ly_id' => $request->user()->id, 'thoi_gian_xu_ly' => now()]);
            $this->ghiNhan($yc, $request, $action, $old, trim($data['ghiChu']));
        });

        return $this->chiTiet($id);
    }

    public function boSung(Request $request, string $id)
    {
        $data = $request->validate(['noiDung' => 'required|string|max:2000']);
        abort_if(trim($data['noiDung']) === '', 422, 'Vui lòng nhập thông tin bổ sung.');
        DB::transaction(function () use ($request, $id, $data) {
            $yc = YeuCauNhanDo::where('nguoi_yeu_cau_id', $request->user()->id)->lockForUpdate()->findOrFail($id);
            abort_unless($yc->trang_thai === 'can_bo_sung', 409, 'Yêu cầu không chờ bổ sung.');
            $yc->update(['loi_nhan' => ($yc->loi_nhan ? $yc->loi_nhan."\n\n" : '').'Bổ sung: '.trim($data['noiDung']), 'trang_thai' => 'cho_kiem_tra']);
            $yc->lichSu()->create(['nguoi_thuc_hien_id' => $request->user()->id, 'hanh_dong' => 'bo_sung', 'trang_thai_cu' => 'can_bo_sung', 'trang_thai_moi' => 'cho_kiem_tra', 'noi_dung' => trim($data['noiDung'])]);
        });

        return response()->json(['message' => 'Đã gửi bổ sung.']);
    }

    private function ghiNhan($yc, $request, $action, $old, $note, $henId = null): void
    {
        $yc->lichSu()->create(['cuoc_hen_id' => $henId, 'nguoi_thuc_hien_id' => $request->user()->id, 'hanh_dong' => $action, 'trang_thai_cu' => $old, 'trang_thai_moi' => $yc->trang_thai, 'noi_dung' => $note]);
        $recipients = [$yc->nguoi_yeu_cau_id];
        if ($action === 'da_xac_minh' || $old === 'da_xac_minh') {
            $recipients[] = $yc->tinDang->nguoi_dung_id;
        }
        foreach (array_unique($recipients) as $userId) {
            ThongBao::create(['nguoi_dung_id' => $userId, 'tin_dang_id' => $yc->tin_dang_id, 'yeu_cau_id' => $yc->id, 'cuoc_hen_id' => $henId, 'loai_thong_bao' => 'xu_ly_yeu_cau', 'tieu_de' => 'Yêu cầu nhận đồ có cập nhật', 'noi_dung' => $note]);
        }
    }
}
