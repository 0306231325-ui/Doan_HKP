<?php

namespace App\Http\Controllers;

use App\Models\CuocHen;
use App\Models\TinDang;
use App\Services\DuLieuTinDang;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TinLienQuanController extends Controller
{
    public function danhSach(Request $request, string $hen, DuLieuTinDang $duLieu): JsonResponse
    {
        $request->validate(['trang' => ['nullable', 'integer', 'min:1', 'max:1000000']]);
        $cuocHen = $this->cuocHenDaBanGiao($request, $hen);
        $tin = $cuocHen->yeuCauNhanDo->tinDang;
        $duocCapNhat = (int) $cuocHen->yeuCauNhanDo->nguoi_yeu_cau_id === (int) $request->user()->id;
        $lienKet = $this->tinDaLienKet($tin);
        $truyVan = $this->tinCoTheChon($tin, (int) $request->user()->id)->latest('id');
        if (! $duocCapNhat || $lienKet !== null) {
            $truyVan->whereRaw('1 = 0');
        }

        return response()->json([
            ...$duLieu->phanTrang($truyVan, (int) $request->input('trang', 1), (string) $request->user()->id),
            'coTheCapNhat' => $duocCapNhat,
            'loaiTin' => $tin->loai_tin === 'nhat_duoc' ? 'lost' : 'found',
            'daLienKet' => $lienKet !== null,
        ])->header('Cache-Control', 'private, no-store');
    }

    public function capNhat(Request $request, string $hen): JsonResponse
    {
        $mau = $request->validate(['tinId' => ['required', 'integer', 'min:1']]);
        $goc = $this->cuocHenDaBanGiao($request, $hen);
        abort_unless((int) $goc->yeuCauNhanDo->nguoi_yeu_cau_id === (int) $request->user()->id, 404);

        DB::transaction(function () use ($request, $hen, $goc, $mau) {
            $cacTin = TinDang::whereKey([$goc->yeuCauNhanDo->tin_dang_id, $mau['tinId']])
                ->orderBy('id')->lockForUpdate()->get()->keyBy('id');
            $tin = $cacTin->get($goc->yeuCauNhanDo->tin_dang_id);
            $tinChon = $cacTin->get($mau['tinId']);
            $yeuCau = $goc->yeuCauNhanDo()->lockForUpdate()->firstOrFail();
            $cuocHen = $yeuCau->cuocHen()->lockForUpdate()->findOrFail($hen);
            abort_unless($tin && $tin->trang_thai === 'da_hoan_tat' && $yeuCau->trang_thai === 'da_xac_minh'
                && $cuocHen->trang_thai === 'da_hoan_tat' && $cuocHen->banGiao?->thoi_gian_ban_giao, 409, 'Cuộc hẹn chưa hoàn tất bàn giao.');
            abort_unless($tinChon && (int) $tinChon->nguoi_dung_id === (int) $request->user()->id
                && $tinChon->loai_tin !== $tin->loai_tin && $tinChon->id !== $tin->id, 404);

            $daLienKet = $this->tinDaLienKet($tin);
            if ($daLienKet !== null) {
                abort_unless((int) $daLienKet === (int) $tinChon->id && $tinChon->trang_thai === 'da_hoan_tat', 409, 'Cuộc hẹn đã được liên kết với bài đăng khác.');

                return;
            }
            abort_unless($this->tinCoTheChon($tin, (int) $request->user()->id)->whereKey($tinChon->id)->exists(), 409, 'Bài đăng này hiện không thể cập nhật. Hãy chọn lại.');

            $trangThaiCu = $tinChon->trang_thai;
            $tinNhat = $tin->loai_tin === 'nhat_duoc' ? $tin : $tinChon;
            $tinMat = $tin->loai_tin === 'bao_mat' ? $tin : $tinChon;
            $tinNhat->update(['tin_bao_mat_lien_quan_id' => $tinMat->id]);
            $tinChon->update(['trang_thai' => 'da_hoan_tat']);
            $tinChon->yeuCauNhanDo()->whereIn('trang_thai', ['cho_kiem_tra', 'can_bo_sung'])->update(['trang_thai' => 'da_huy']);
            $tinChon->lichSu()->create([
                'nguoi_thuc_hien_id' => $request->user()->id,
                'hanh_dong' => 'hoan_tat_tin_lien_quan',
                'trang_thai_cu' => $trangThaiCu,
                'trang_thai_moi' => 'da_hoan_tat',
                'noi_dung' => 'Người đăng xác nhận đồ vật đã được giao nhận tại cuộc hẹn #'.$cuocHen->id.'.',
                'du_lieu_moi' => ['cuoc_hen_id' => $cuocHen->id, 'tin_lien_quan_id' => $tin->id],
            ]);
        }, 3);

        return response()->json(['message' => 'Đã đánh dấu bài đăng liên quan hoàn tất.'])->header('Cache-Control', 'private, no-store');
    }

    private function cuocHenDaBanGiao(Request $request, string $hen): CuocHen
    {
        $cuocHen = CuocHen::with(['yeuCauNhanDo.tinDang', 'banGiao'])->findOrFail($hen);
        $yeuCau = $cuocHen->yeuCauNhanDo;
        abort_unless($yeuCau && in_array((int) $request->user()->id, [$yeuCau->nguoiGiuId(), $yeuCau->nguoiNhanId()], true), 404);
        abort_unless($cuocHen->trang_thai === 'da_hoan_tat' && $cuocHen->banGiao?->thoi_gian_ban_giao
            && $yeuCau->trang_thai === 'da_xac_minh' && $yeuCau->tinDang?->trang_thai === 'da_hoan_tat', 409, 'Cuộc hẹn chưa hoàn tất bàn giao.');

        return $cuocHen;
    }

    private function tinDaLienKet(TinDang $tin): int|string|null
    {
        return $tin->loai_tin === 'nhat_duoc'
            ? $tin->tin_bao_mat_lien_quan_id
            : $tin->tinNhatDuocLienQuan()->withTrashed()->value('id');
    }

    private function tinCoTheChon(TinDang $tin, int $nguoiDungId): Builder
    {
        return TinDang::where('nguoi_dung_id', $nguoiDungId)
            ->where('loai_tin', $tin->loai_tin === 'nhat_duoc' ? 'bao_mat' : 'nhat_duoc')
            ->whereIn('trang_thai', ['dang_mo', 'da_dong'])
            ->whereNull('tin_bao_mat_lien_quan_id')
            ->whereDoesntHave('tinNhatDuocLienQuan', fn (Builder $q) => $q->withTrashed())
            ->whereDoesntHave('yeuCauNhanDo', fn (Builder $q) => $q->where('trang_thai', 'da_xac_minh')
                ->orWhereHas('cuocHen', fn (Builder $h) => $h->whereIn('trang_thai', ['cho_xac_nhan', 'da_xac_nhan', 'da_hoan_tat'])));
    }
}
