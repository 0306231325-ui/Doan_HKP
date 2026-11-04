<?php

namespace App\Services;

use App\Models\TinDang;

class DuLieuTinDang
{
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
            'imageUrl' => $tin->hinhAnh->first()?->duong_dan ?? '/do-vat-trong.svg',
            'statusBadge' => $trangThai[$tin->trang_thai] ?? 'Đang mở', 'canClaim' => $laNhatDuoc && $tin->trang_thai === 'dang_mo',
            'statusType' => $tin->trang_thai === 'dang_mo' ? ($laNhatDuoc ? 'safe' : 'urgent') : 'secure',
            'contactPerson' => $tin->nguoiDung?->ho_ten ?? 'Người đăng',
            'contactPhone' => $tin->thong_tin_lien_he ? '****' : '', 'contactEmail' => $tin->email_lien_he ? '****' : '',
        ];
        if ($chiTiet) {
            $duLieu['images'] = $tin->hinhAnh->pluck('duong_dan')->values();
            $duLieu['publicAnswers'] = $tin->loiKhai->filter(fn ($loi) => $loi->phienBanCauHoi && array_key_exists('danh_muc_id', $loi->phienBanCauHoi->du_lieu) && $loi->phienBanCauHoi->du_lieu['danh_muc_id'] === null)
                ->map(fn ($loi) => ['id' => (string) $loi->id, 'question' => $loi->phienBanCauHoi->du_lieu['noi_dung'], 'answer' => $loi->gia_tri_text ?? $loi->gia_tri_so ?? $loi->gia_tri_lua_chon])->values();
        }

        return $duLieu;
    }
}
