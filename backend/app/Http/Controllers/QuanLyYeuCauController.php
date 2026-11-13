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
        $filters = $request->validate(['trangThai' => ['nullable', Rule::in(TienDoYeuCau::CAC_TRANG_THAI)], 'trangThaiNhom' => 'nullable|in:cho_duyet,cho_ban_giao,hoan_tat,tu_choi', 'tuKhoa' => 'nullable|string|max:200', 'nhom' => 'sometimes|boolean', 'tinDangId' => 'nullable|integer|min:1', 'danhMucId' => 'nullable|integer|min:1']);
        $yeuCauCanDuyet = fn () => YeuCauNhanDo::whereDoesntHave('tinDang', fn ($tin) => $tin->withTrashed()->where('loai_tin', 'bao_mat'));
        $tong = $yeuCauCanDuyet()->count();
        $hoanTat = $tienDo->hoanTat($yeuCauCanDuyet())->count();
        $stats = ['tong' => $tong, 'choKiemTra' => $yeuCauCanDuyet()->where('trang_thai', 'cho_kiem_tra')->count(), 'dangGiaoNhan' => $tienDo->loc($yeuCauCanDuyet(), 'dang_giao_nhan')->count(), 'hoanTat' => $hoanTat];
        $q = $yeuCauCanDuyet()->with(['tinDang', 'nguoiYeuCau', 'cuocHen.banGiao']);
        $request->validate(['trangThaiNhom' => 'nullable|in:cho_duyet,cho_ban_giao,hoan_tat,tu_choi']);
        if ($request->boolean('nhom') && $request->filled('trangThaiNhom')) {
            $state = $request->input('trangThaiNhom');
            $q->whereHas('tinDang', function ($tin) use ($state) {
                if ($state === 'cho_ban_giao' || $state === 'hoan_tat') {
                    $tin->where('trang_thai', $state === 'hoan_tat' ? 'da_hoan_tat' : 'cho_ban_giao');
                } elseif ($state === 'cho_duyet') {
                    $tin->where('trang_thai', 'dang_mo')->whereHas('yeuCauNhanDo', fn ($yc) => $yc->whereIn('trang_thai', ['cho_kiem_tra', 'can_bo_sung']));
                } else {
                    $tin->where('trang_thai', '!=', 'da_hoan_tat')->whereDoesntHave('yeuCauNhanDo', fn ($yc) => $yc->whereNotIn('trang_thai', ['tu_choi', 'da_huy']));
                }
            });
        }
        if (! empty($filters['danhMucId'])) {
            $q->whereHas('tinDang', fn ($tin) => $tin->where('danh_muc_id', $filters['danhMucId']));
        }
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
        if (! empty($filters['tinDangId'])) {
            $q->where('tin_dang_id', $filters['tinDangId']);
        }
        if ($request->boolean('nhom')) {
            if (! empty($filters['trangThaiNhom'])) {
                $q->whereHas('tinDang', function ($tin) use ($filters) {
                    $choDuyet = fn ($yc) => $yc->whereIn('trang_thai', ['cho_kiem_tra', 'can_bo_sung']);
                    match ($filters['trangThaiNhom']) {
                        'cho_duyet' => $tin->whereNotIn('trang_thai', ['cho_ban_giao', 'da_hoan_tat'])->whereHas('yeuCauNhanDo', $choDuyet),
                        'cho_ban_giao' => $tin->where('trang_thai', 'cho_ban_giao'),
                        'hoan_tat' => $tin->where('trang_thai', 'da_hoan_tat'),
                        'tu_choi' => $tin->whereNotIn('trang_thai', ['cho_ban_giao', 'da_hoan_tat'])->whereDoesntHave('yeuCauNhanDo', $choDuyet),
                    };
                });
            }
            $rows = $q->without(['nguoiYeuCau', 'cuocHen'])->with(['tinDang.danhMuc', 'tinDang.hinhAnh' => fn ($anh) => $anh->where('pham_vi', 'cong_khai')->orderBy('thu_tu')->orderBy('id')])->select('tin_dang_id')
                ->selectRaw('COUNT(*) as so_yeu_cau, MAX(created_at) as moi_nhat')
                ->selectRaw("SUM(CASE WHEN trang_thai = 'cho_kiem_tra' THEN 1 ELSE 0 END) as cho_kiem_tra")
                ->selectRaw("SUM(CASE WHEN trang_thai = 'can_bo_sung' THEN 1 ELSE 0 END) as can_bo_sung")
                ->selectRaw("SUM(CASE WHEN trang_thai = 'da_xac_minh' THEN 1 ELSE 0 END) as so_da_duyet")
                ->groupBy('tin_dang_id')->orderByDesc('cho_kiem_tra')->orderByDesc('moi_nhat')->orderByDesc('tin_dang_id')->paginate(9);
            $daDuyet = YeuCauNhanDo::whereIn('tin_dang_id', $rows->getCollection()->pluck('tin_dang_id'))->where('trang_thai', 'da_xac_minh')
                ->with(['nguoiYeuCau', 'cuocHen' => fn ($h) => $h->whereIn('trang_thai', ['cho_xac_nhan', 'da_xac_nhan', 'da_hoan_tat'])->latest('id')])->get()->keyBy('tin_dang_id');
            $rows->through(function ($nhom) use ($daDuyet) {
                $yc = $daDuyet->get($nhom->tin_dang_id);
                $nhom->setAttribute('anh_bia', $nhom->tinDang?->hinhAnh->first()?->duongDanHienThi() ?? '/do-vat-trong.svg');
                $nhom->setAttribute('nguoi_nhan', $yc?->nguoiYeuCau?->ho_ten);
                $nhom->setAttribute('lich_hen', $yc?->cuocHen->first()?->only(['id', 'thoi_gian_hen_gap', 'trang_thai']));
                $nhom->tinDang?->unsetRelation('hinhAnh');

                return $nhom;
            });

            return response()->json(['data' => $rows, 'thongKe' => $stats])->header('Cache-Control', 'private, no-store');
        }
        $rows = $q->latest('id')->paginate(20);
        $rows->through(fn ($yc) => $tienDo->duLieu($yc));

        return response()->json(['data' => $rows, 'thongKe' => $stats])->header('Cache-Control', 'private, no-store');
    }

    public function chiTiet(string $id)
    {
        $yc = YeuCauNhanDo::with(['tinDang.nguoiDung', 'tinDang.hinhAnh' => fn ($anh) => $anh->where('pham_vi', 'cong_khai')->orderBy('thu_tu')->orderBy('id'), 'nguoiYeuCau', 'traLoi.loiKhaiTinDang.phienBanCauHoi', 'minhChung' => fn ($anh) => $anh->orderBy('thu_tu')->orderBy('id'), 'lichSu.nguoiThucHien', 'cuocHen.banGiao'])->findOrFail($id);
        $yc->setAttribute('anh_tin_dang', $yc->tinDang?->hinhAnh->map(fn ($anh) => ['id' => $anh->id, 'url' => $anh->duongDanHienThi(), 'mo_ta' => $anh->mo_ta])->values() ?? []);
        $yc->tinDang?->unsetRelation('hinhAnh');

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
            'hanhDong' => 'required|in:tu_choi,da_xac_minh',
            'ghiChu' => 'required_unless:hanhDong,da_xac_minh|nullable|string|max:2000',
            'doiChieu' => 'sometimes|array|max:500',
            'doiChieu.*' => 'required|in:khop,khong_khop,chua_du_can_cu,chua_danh_gia',
            'xacNhanDoiChieu' => 'sometimes|accepted',
        ]);
        $data['ghiChu'] = $data['hanhDong'] === 'da_xac_minh'
            ? 'Yêu cầu nhận lại đồ đã được duyệt.'
            : trim($data['ghiChu'] ?? '');
        abort_if($data['ghiChu'] === '', 422, 'Vui lòng nhập lý do từ chối.');
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
                abort_if(YeuCauNhanDo::where('tin_dang_id', $itemId)->where('trang_thai', 'da_xac_minh')->where('id', '!=', $yc->id)->exists(), 409, 'Đồ vật đã có người được duyệt.');
                if (! empty($data['xacNhanDoiChieu'])) {
                    foreach ($answers as $answer) {
                        $answer->update(['ket_qua_doi_chieu' => 'khop']);
                    }
                }
                abort_if($answers->isEmpty() || $answers->contains(fn ($a) => $a->ket_qua_doi_chieu !== 'khop'), 422, 'Cần đối chiếu tất cả câu trả lời là khớp trước khi chấp thuận.');
                $tin->update(['trang_thai' => 'cho_ban_giao']);
            }
            $yc->update(['trang_thai' => $action, 'ghi_chu_admin' => trim($data['ghiChu']), 'nguoi_xu_ly_id' => $request->user()->id, 'thoi_gian_xu_ly' => now()]);
            $this->ghiNhan($yc, $request, $action, $old, trim($data['ghiChu']));
        });

        return $this->chiTiet($id);
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
