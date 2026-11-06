<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TinDang extends Model
{
    use SoftDeletes;

    protected $table = 'tin_dang';

    protected $fillable = [
        'nguoi_dung_id',
        'danh_muc_id',
        'dia_diem_id',
        'loai_tin',
        'tin_bao_mat_lien_quan_id',
        'tieu_de',
        'slug',
        'mo_ta',
        'thoi_gian_xay_ra',
        'co_gio_xay_ra',
        'dia_diem_chi_tiet',
        'thong_tin_lien_he',
        'email_lien_he',
        'ma_gui',
        'trang_thai',
        'trang_thai_kiem_duyet',
        'ly_do_an',
    ];

    protected function casts(): array
    {
        return [
            'thoi_gian_xay_ra' => 'datetime',
            'co_gio_xay_ra' => 'boolean',
        ];
    }

    public function gioXayRa(): ?string
    {
        $thoiGian = $this->thoi_gian_xay_ra;
        if ($thoiGian === null || $this->co_gio_xay_ra === false) {
            return null;
        }

        return $this->co_gio_xay_ra || $thoiGian->format('H:i:s') !== '00:00:00' ? $thoiGian->format('H:i') : null;
    }

    public function thuMucAnh(): string
    {
        return $this->loai_tin === 'nhat_duoc' ? 'tin/tin-nhat' : 'tin/tin-mat';
    }

    public function nguoiDung(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_dung_id');
    }

    public function danhMuc(): BelongsTo
    {
        return $this->belongsTo(DanhMucDoVat::class, 'danh_muc_id');
    }

    public function diaDiem(): BelongsTo
    {
        return $this->belongsTo(DiaDiem::class, 'dia_diem_id');
    }

    public function tinBaoMatLienQuan(): BelongsTo
    {
        return $this->belongsTo(TinDang::class, 'tin_bao_mat_lien_quan_id');
    }

    public function tinNhatDuocLienQuan(): HasMany
    {
        return $this->hasMany(TinDang::class, 'tin_bao_mat_lien_quan_id');
    }

    public function loiKhai(): HasMany
    {
        return $this->hasMany(LoiKhaiTinDang::class, 'tin_dang_id');
    }

    public function yeuCauNhanDo(): HasMany
    {
        return $this->hasMany(YeuCauNhanDo::class, 'tin_dang_id');
    }

    public function traLoiYeuCau(): HasMany
    {
        return $this->hasMany(TraLoiYeuCau::class, 'tin_dang_id');
    }

    public function hinhAnh(): HasMany
    {
        return $this->hasMany(HinhAnhTinDang::class, 'tin_dang_id');
    }

    public function lichSu(): HasMany
    {
        return $this->hasMany(LichSuTinDang::class, 'tin_dang_id');
    }

    public function baoCao(): HasMany
    {
        return $this->hasMany(BaoCaoTinDang::class, 'tin_dang_id');
    }

    public function thongBao(): HasMany
    {
        return $this->hasMany(ThongBao::class, 'tin_dang_id');
    }
}
