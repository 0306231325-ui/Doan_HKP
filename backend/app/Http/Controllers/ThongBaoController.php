<?php

namespace App\Http\Controllers;

use App\Models\ThongBao;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ThongBaoController extends Controller
{
    public function danhSach(Request $request): JsonResponse
    {
        $nguoiDung = $request->user();
        $hopThu = $nguoiDung->thongBao();
        $danhSach = (clone $hopThu)
            ->withExists(['tinDang as co_the_xem_tin' => fn (Builder $query) => $query->xemDuoc($nguoiDung)])
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(20)
            ->get();

        return response()->json([
            'data' => $danhSach->map(fn (ThongBao $muc) => $this->duLieuThongBao($muc)),
            'soChuaDoc' => $hopThu->whereNull('thoi_gian_doc')->count(),
        ])->header('Cache-Control', 'private, no-store');
    }

    public function danhDauDaDoc(Request $request, string $id): Response
    {
        $hopThu = $request->user()->thongBao()->whereKey($id);
        $hopThu->firstOrFail();
        $hopThu->whereNull('thoi_gian_doc')->update(['thoi_gian_doc' => now()]);

        return response()->noContent();
    }

    public function danhDauTatCaDaDoc(Request $request): Response
    {
        $request->user()->thongBao()->whereNull('thoi_gian_doc')->update(['thoi_gian_doc' => now()]);

        return response()->noContent();
    }

    public function xoa(Request $request, string $id): Response
    {
        $soDaXoa = $request->user()->thongBao()->whereKey($id)->delete();
        abort_if($soDaXoa === 0, 404);

        return response()->noContent();
    }

    public function xoaTatCa(Request $request): Response
    {
        $request->user()->thongBao()->delete();

        return response()->noContent();
    }

    private function duLieuThongBao(ThongBao $muc): array
    {
        $duongDan = $muc->co_the_xem_tin ? '/chi-tiet-tin-dang?id='.$muc->tin_dang_id : null;
        if ($muc->yeu_cau_id) {
            $thamSo = ['id' => $muc->yeu_cau_id];
            if ($muc->loai_thong_bao === 'tao_cuoc_hen') {
                $thamSo['tab'] = 'lich-hen';
                $thamSo['cuocHen'] = $muc->cuoc_hen_id;
            }
            $duongDan = '/chi-tiet-yeu-cau?'.http_build_query($thamSo);
        }

        return [
            'id' => (string) $muc->id,
            'tieuDe' => $muc->tieu_de,
            'noiDung' => $muc->noi_dung,
            'taoLuc' => $muc->created_at?->toISOString(),
            'daDoc' => $muc->thoi_gian_doc !== null,
            'duongDan' => $duongDan,
        ];
    }
}
