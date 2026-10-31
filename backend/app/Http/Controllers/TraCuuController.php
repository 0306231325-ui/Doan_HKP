<?php

namespace App\Http\Controllers;

use App\Models\DanhMucDoVat;
use App\Models\DiaDiem;
use App\Models\TinDang;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class TraCuuController extends Controller
{
    public function boLoc(): JsonResponse
    {
        return response()->json([
            'danhMuc' => DanhMucDoVat::where('trang_thai', true)->orderBy('ten_danh_muc')->get(['id', 'ten_danh_muc'])
                ->map(fn ($muc) => ['id' => (string) $muc->id, 'name' => $muc->ten_danh_muc]),
            'diaDiem' => DiaDiem::where('trang_thai', true)->orderBy('ten_dia_diem')->get(['id', 'ten_dia_diem'])
                ->map(fn ($muc) => ['id' => (string) $muc->id, 'name' => $muc->ten_dia_diem]),
        ]);
    }

    public function danhSach(Request $request): JsonResponse
    {
        $boLoc = $request->validate([
            'tuKhoa' => ['nullable', 'string', 'max:200'],
            'loaiTin' => ['nullable', Rule::in(['all', 'lost', 'found'])],
            'danhMuc' => ['nullable', 'integer', 'min:1'],
            'diaDiem' => ['nullable', 'integer', 'min:1'],
            'tuNgay' => ['nullable', 'date_format:Y-m-d'],
            'denNgay' => ['nullable', 'date_format:Y-m-d'],
            'sapXep' => ['nullable', Rule::in(['moi_nhat', 'cu_nhat'])],
            'trang' => ['nullable', 'integer', 'min:1', 'max:1000000'],
        ], [
            'date_format' => 'Vui lòng chọn ngày hợp lệ.',
            'integer' => 'Bộ lọc hoặc số trang không hợp lệ.',
            'in' => 'Lựa chọn bộ lọc không hợp lệ.',
            'tuKhoa.max' => 'Từ khóa không được vượt quá 200 ký tự.',
        ]);
        if (! empty($boLoc['tuNgay']) && ! empty($boLoc['denNgay']) && $boLoc['tuNgay'] > $boLoc['denNgay']) {
            throw ValidationException::withMessages(['denNgay' => 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.']);
        }
        $truyVan = TinDang::query()->where('trang_thai_kiem_duyet', 'hien_thi');
        if (in_array($boLoc['loaiTin'] ?? null, ['lost', 'found'], true)) {
            $truyVan->where('loai_tin', $boLoc['loaiTin'] === 'lost' ? 'bao_mat' : 'nhat_duoc');
        }
        foreach (['danhMuc' => 'danh_muc_id', 'diaDiem' => 'dia_diem_id'] as $ten => $cot) {
            if (! empty($boLoc[$ten])) {
                $truyVan->where($cot, $boLoc[$ten]);
            }
        }
        if (! empty($boLoc['tuNgay'])) {
            $truyVan->whereRaw('DATE(COALESCE(thoi_gian_xay_ra, created_at)) >= ?', [$boLoc['tuNgay']]);
        }
        if (! empty($boLoc['denNgay'])) {
            $truyVan->whereRaw('DATE(COALESCE(thoi_gian_xay_ra, created_at)) <= ?', [$boLoc['denNgay']]);
        }
        $this->locTuKhoa($truyVan, trim($boLoc['tuKhoa'] ?? ''));
        $tongTin = (clone $truyVan)->count();
        $tongTrang = max(1, (int) ceil($tongTin / 6));
        $trang = min((int) ($boLoc['trang'] ?? 1), $tongTrang);
        $chieu = ($boLoc['sapXep'] ?? 'moi_nhat') === 'cu_nhat' ? 'asc' : 'desc';
        $cacTin = $truyVan->with([
            'danhMuc:id,ten_danh_muc', 'diaDiem:id,ten_dia_diem', 'nguoiDung:id,ho_ten',
            'hinhAnh' => fn ($anh) => $anh->where('pham_vi', 'cong_khai')->orderBy('thu_tu')->orderBy('id'),
        ])->orderByRaw('COALESCE(thoi_gian_xay_ra, created_at) '.$chieu)->orderBy('id', $chieu)->forPage($trang, 6)->get();

        return response()->json([
            'data' => $cacTin->map(fn ($tin) => $this->duLieuCongKhai($tin)),
            'meta' => [
                'trangHienTai' => $trang, 'tongTrang' => $tongTrang, 'tongTin' => $tongTin,
                'tuViTri' => $tongTin ? ($trang - 1) * 6 + 1 : 0,
                'denViTri' => min($trang * 6, $tongTin),
            ],
        ]);
    }

    private function locTuKhoa(Builder $truyVan, string $tuKhoa): void
    {
        if ($tuKhoa === '') {
            return;
        }
        if (preg_match('/^(?:TIN-)?0*([1-9][0-9]*)$/i', $tuKhoa, $maTin)) {
            $truyVan->whereKey($maTin[1]);

            return;
        }
        $cacTu = preg_split('/[^a-z0-9]+/', strtolower(Str::ascii($tuKhoa)), -1, PREG_SPLIT_NO_EMPTY);
        foreach ($cacTu as $tu) {
            $giaTri = '% '.$tu.' %';
            $truyVan->where(function (Builder $nhom) use ($giaTri) {
                $nhom->whereRaw($this->cotTimKiem('tieu_de'), [$giaTri])
                    ->orWhereRaw($this->cotTimKiem('mo_ta'), [$giaTri])
                    ->orWhereRaw($this->cotTimKiem('dia_diem_chi_tiet'), [$giaTri])
                    ->orWhereHas('danhMuc', fn (Builder $muc) => $muc->whereRaw($this->cotTimKiem('ten_danh_muc'), [$giaTri]))
                    ->orWhereHas('diaDiem', fn (Builder $noi) => $noi->whereRaw($this->cotTimKiem('ten_dia_diem'), [$giaTri]));
            });
        }
        if (! $cacTu) {
            $truyVan->whereRaw('1 = 0');
        }
    }

    private function cotTimKiem(string $cot): string
    {
        $bieuThuc = "REGEXP_REPLACE(LOWER(REPLACE(REPLACE(COALESCE({$cot}, ''), 'đ', 'd'), 'Đ', 'd')), '[^[:alnum:]]+', ' ')";
        $noiChuoi = (new TinDang)->getConnection()->getDriverName() === 'sqlite'
            ? "' ' || {$bieuThuc} || ' '"
            : "CONCAT(' ', {$bieuThuc}, ' ')";

        return "({$noiChuoi}) LIKE ?";
    }

    private function duLieuCongKhai(TinDang $tin): array
    {
        $laNhatDuoc = $tin->loai_tin === 'nhat_duoc';
        $trangThai = ['dang_mo' => 'Đang mở', 'cho_ban_giao' => 'Chờ bàn giao', 'da_hoan_tat' => 'Đã hoàn tất', 'da_dong' => 'Đã đóng'];

        return [
            'id' => $tin->id, 'title' => $tin->tieu_de, 'description' => $tin->mo_ta,
            'referenceCode' => 'TIN-'.str_pad((string) $tin->id, 6, '0', STR_PAD_LEFT),
            'type' => $laNhatDuoc ? 'found' : 'lost', 'typeName' => $laNhatDuoc ? 'Nhặt được' : 'Báo mất',
            'categoryId' => (string) $tin->danh_muc_id, 'category' => $tin->danhMuc?->ten_danh_muc ?? 'Chưa phân loại',
            'locationId' => $tin->dia_diem_id ? (string) $tin->dia_diem_id : '',
            'location' => $tin->diaDiem?->ten_dia_diem ?? 'Chưa rõ địa điểm',
            'locationDetail' => $tin->dia_diem_chi_tiet,
            'date' => ($tin->thoi_gian_xay_ra ?? $tin->created_at)?->format('Y-m-d'),
            'imageUrl' => $tin->hinhAnh->first()?->duong_dan ?? '/do-vat-trong.svg',
            'statusBadge' => $trangThai[$tin->trang_thai] ?? 'Đang mở',
            'statusType' => $tin->trang_thai === 'dang_mo' ? ($laNhatDuoc ? 'safe' : 'urgent') : 'secure',
            'contactPerson' => $tin->nguoiDung?->ho_ten ?? 'Người đăng',
            'contactPhone' => $tin->thong_tin_lien_he ?: 'Chưa công khai thông tin liên hệ',
        ];
    }
}
