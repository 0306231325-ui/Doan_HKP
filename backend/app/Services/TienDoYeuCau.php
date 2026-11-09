<?php

namespace App\Services;

use App\Models\YeuCauNhanDo;
use Illuminate\Database\Eloquent\Builder;

class TienDoYeuCau
{
    public const CAC_TRANG_THAI = ['cho_kiem_tra', 'can_bo_sung', 'da_xac_minh', 'cho_xac_nhan_lich', 'da_thong_nhat_lich', 'cho_xac_nhan_giao_nhan', 'da_hoan_tat', 'tu_choi', 'da_huy', 'nhom_cho_kiem_tra', 'dang_giao_nhan', 'nhom_tu_choi', 'tam_cho_ban_giao', 'da_dong', 'san_sang_duyet', 'nhom_da_duyet', 'nhom_da_dong'];

    public function duLieu(YeuCauNhanDo $yc): array
    {
        $status = $yc->trang_thai;
        if ($status === 'da_xac_minh') {
            $appointments = $yc->cuocHen;
            $completed = $appointments->contains(fn ($h) => $h->trang_thai === 'da_hoan_tat' || $h->banGiao?->thoi_gian_ban_giao);
            $active = $appointments->first(fn ($h) => in_array($h->trang_thai, ['cho_xac_nhan', 'da_xac_nhan']));
            $status = $completed ? 'da_hoan_tat' : match ($active?->trang_thai) {
                'cho_xac_nhan' => 'cho_xac_nhan_lich',
                'da_xac_nhan' => ($active->nguoi_giu_xac_nhan_luc || $active->nguoi_nhan_xac_nhan_luc) ? 'cho_xac_nhan_giao_nhan' : 'da_thong_nhat_lich',
                default => 'da_xac_minh',
            };
        }

        $xuLy = $status;
        if (in_array($yc->trang_thai, ['cho_kiem_tra', 'can_bo_sung'])) {
            $xuLy = match ($yc->tinDang?->trang_thai) {
                'cho_ban_giao' => 'tam_cho_ban_giao',
                'da_hoan_tat' => 'da_dong',
                default => $status,
            };
        }

        return [...$yc->toArray(), 'tien_do' => $status, 'trang_thai_xu_ly' => $xuLy];
    }

    public function hoanTat(Builder $q): Builder
    {
        return $q->where('trang_thai', 'da_xac_minh')->whereHas('cuocHen', fn ($h) => $h->where('trang_thai', 'da_hoan_tat')->orWhereHas('banGiao', fn ($b) => $b->whereNotNull('thoi_gian_ban_giao')));
    }

    public function loc(Builder $q, string $status): Builder
    {
        if ($status === 'nhom_da_dong') {
            return $q->where(function ($nhom) {
                $nhom->whereIn('trang_thai', ['tu_choi', 'da_huy'])
                    ->orWhere(fn ($cho) => $cho->whereIn('trang_thai', ['cho_kiem_tra', 'can_bo_sung'])->whereHas('tinDang', fn ($tin) => $tin->where('trang_thai', 'da_hoan_tat')));
            });
        }
        if ($status === 'san_sang_duyet') {
            return $q->where('trang_thai', 'cho_kiem_tra')->whereHas('tinDang', fn ($tin) => $tin->where('trang_thai', 'dang_mo'));
        }
        if ($status === 'nhom_da_duyet') {
            return $q->where('trang_thai', 'da_xac_minh');
        }
        if (in_array($status, ['tam_cho_ban_giao', 'da_dong'])) {
            return $q->whereIn('trang_thai', ['cho_kiem_tra', 'can_bo_sung'])->whereHas('tinDang', fn ($tin) => $tin->where('trang_thai', $status === 'tam_cho_ban_giao' ? 'cho_ban_giao' : 'da_hoan_tat'));
        }
        if ($status === 'nhom_cho_kiem_tra') {
            return $q->whereIn('trang_thai', ['cho_kiem_tra', 'can_bo_sung']);
        }
        if ($status === 'nhom_tu_choi') {
            return $q->whereIn('trang_thai', ['tu_choi', 'da_huy']);
        }
        if ($status === 'da_hoan_tat') {
            return $this->hoanTat($q);
        }
        if (in_array($status, ['cho_kiem_tra', 'can_bo_sung', 'tu_choi', 'da_huy'])) {
            return $q->where('trang_thai', $status);
        }
        $q->where('trang_thai', 'da_xac_minh')->whereDoesntHave('cuocHen', fn ($h) => $h->where('trang_thai', 'da_hoan_tat')->orWhereHas('banGiao', fn ($b) => $b->whereNotNull('thoi_gian_ban_giao')));
        if ($status === 'dang_giao_nhan') {
            return $q->whereHas('cuocHen', fn ($h) => $h->whereIn('trang_thai', ['cho_xac_nhan', 'da_xac_nhan']));
        }
        if ($status === 'da_xac_minh') {
            return $q->whereDoesntHave('cuocHen', fn ($h) => $h->whereIn('trang_thai', ['cho_xac_nhan', 'da_xac_nhan']));
        }

        return $q->whereHas('cuocHen', function ($h) use ($status) {
            $h->where('trang_thai', $status === 'cho_xac_nhan_lich' ? 'cho_xac_nhan' : 'da_xac_nhan');
            if ($status === 'da_thong_nhat_lich') {
                $h->whereNull('nguoi_giu_xac_nhan_luc')->whereNull('nguoi_nhan_xac_nhan_luc');
            } elseif ($status === 'cho_xac_nhan_giao_nhan') {
                $h->where(fn ($h) => $h->whereNotNull('nguoi_giu_xac_nhan_luc')->orWhereNotNull('nguoi_nhan_xac_nhan_luc'));
            }
        });
    }
}
