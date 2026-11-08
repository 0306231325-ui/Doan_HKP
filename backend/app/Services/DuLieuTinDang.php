<?php

namespace App\Services;

use App\Models\TinDang;
use Illuminate\Database\Eloquent\Builder;

class DuLieuTinDang
{
    public function quanHe(): array
    {
        return [
            'danhMuc:id,ten_danh_muc', 'diaDiem:id,ten_dia_diem', 'nguoiDung:id,ho_ten',
            'hinhAnh' => fn ($anh) => $anh->where('pham_vi', 'cong_khai')->orderBy('thu_tu')->orderBy('id'),
        ];
    }

    public function phanTrang(Builder $truyVan, int $trang, ?string $nguoiXem): array
    {
        $moiTrang = 6;
        $tongTin = (clone $truyVan)->reorder()->count();
        $tongTrang = max(1, (int) ceil($tongTin / $moiTrang));
        $trang = min($trang, $tongTrang);
        $cacTin = $truyVan->with($this->quanHe())->forPage($trang, $moiTrang)->get();

        return [
            'data' => $cacTin->map(fn (TinDang $tin) => [
                ...$this->congKhai($tin),
                'laChuTin' => (string) $tin->nguoi_dung_id === $nguoiXem,
            ]),
            'meta' => [
                'trangHienTai' => $trang, 'tongTrang' => $tongTrang, 'tongTin' => $tongTin,
                'tuViTri' => $tongTin ? ($trang - 1) * $moiTrang + 1 : 0,
                'denViTri' => min($trang * $moiTrang, $tongTin),
            ],
        ];
    }

    public function congKhai(TinDang $tin, bool $chiTiet = false): array
    {
        $laNhatDuoc = $tin->loai_tin === 'nhat_duoc';
        $trangThai = ['dang_mo' => 'Đang mở', 'cho_ban_giao' => 'Chờ bàn giao', 'da_hoan_tat' => 'Đã hoàn tất', 'da_dong' => 'Đã đóng'];
        $duLieu = [
            'id' => $tin->id, 'title' => $tin->tieu_de, 'description' => $tin->mo_ta,
            'referenceCode' => 'TIN-'.str_pad((string) $tin->id, 6, '0', STR_PAD_LEFT),
            'type' => $laNhatDuoc ? 'found' : 'lost', 'typeName' => $laNhatDuoc ? 'Nhặt được' : 'Báo mất',
            'categoryId' => (string) $tin->danh_muc_id, 'category' => $tin->danhMuc?->ten_danh_muc ?? 'Chưa phân loại',
            'locationId' => $tin->dia_diem_id ? (string) $tin->dia_diem_id : '',
            'location' => $tin->diaDiem?->ten_dia_diem ?? 'Chưa rõ địa điểm', 'locationDetail' => $tin->dia_diem_chi_tiet,
            'date' => ($tin->thoi_gian_xay_ra ?? $tin->created_at)?->format('Y-m-d'),
            'gioXayRa' => $tin->gioXayRa(),
            'imageUrl' => $tin->hinhAnh->first()?->duong_dan ?? '/do-vat-trong.svg',
            'statusBadge' => $trangThai[$tin->trang_thai] ?? 'Đang mở', 'canClaim' => $laNhatDuoc && $tin->trang_thai === 'dang_mo',
            'statusType' => $tin->trang_thai === 'dang_mo' ? ($laNhatDuoc ? 'safe' : 'urgent') : 'secure',
            'contactPerson' => $tin->nguoiDung?->ho_ten ?? 'Người đăng',
            'contactPhone' => $this->cheLienHe($tin->thong_tin_lien_he),
            'contactEmail' => $this->cheLienHe($tin->email_lien_he, laEmail: true),
        ];
        if ($chiTiet) {
            $duLieu['images'] = $tin->hinhAnh->pluck('duong_dan')->values();
        }
        if ($tin->trang_thai_kiem_duyet === 'da_an') {
            $duLieu['biAn'] = true;
            $duLieu['canClaim'] = false;
        }

        return $duLieu;
    }

    private function cheLienHe(?string $giaTri, bool $laEmail = false): string
    {
        $giaTri = trim($giaTri ?? '');
        if ($giaTri === '') {
            return '';
        }
        if ($laEmail) {
            $ten = explode('@', $giaTri, 2)[0];

            return mb_substr($ten, 0, max(0, min(2, mb_strlen($ten) - 1))).'****@****';
        }

        return mb_substr($giaTri, 0, intdiv(mb_strlen($giaTri), 2)).'****';
    }
}
