<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CuocHen extends Model
{
    protected $table = 'cuoc_hen';

    protected $fillable = [
        'yeu_cau_id',
        'nguoi_giu_do_id',
        'nguoi_de_xuat_id',
        'nguoi_xac_nhan_id',
        'thoi_gian_xac_nhan',
        'thoi_gian_hen_gap',
        'dia_diem_id',
        'trang_thai',
        'ly_do_huy',
    ];

    protected function casts(): array
    {
        return [
            'thoi_gian_xac_nhan' => 'datetime',
            'thoi_gian_hen_gap' => 'datetime',
        ];
    }

    public function yeuCauNhanDo(): BelongsTo
    {
        return $this->belongsTo(YeuCauNhanDo::class, 'yeu_cau_id');
    }

    public function nguoiGiuDo(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_giu_do_id');
    }

    public function nguoiDeXuat(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_de_xuat_id');
    }

    public function nguoiXacNhan(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_xac_nhan_id');
    }

    public function diaDiem(): BelongsTo
    {
        return $this->belongsTo(DiaDiem::class, 'dia_diem_id');
    }

    public function banGiao(): HasOne
    {
        return $this->hasOne(BanGiao::class, 'cuoc_hen_id');
    }

    public function lichSuYeuCau(): HasMany
    {
        return $this->hasMany(LichSuYeuCau::class, 'cuoc_hen_id');
    }

    public function thongBao(): HasMany
    {
        return $this->hasMany(ThongBao::class, 'cuoc_hen_id');
    }
}
