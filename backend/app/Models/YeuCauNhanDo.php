<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class YeuCauNhanDo extends Model
{
    public function nguoiGiuId(): int
    {
        return (int) ($this->tinDang?->loai_tin === 'bao_mat' ? $this->nguoi_yeu_cau_id : $this->tinDang?->nguoi_dung_id);
    }

    public function nguoiNhanId(): int
    {
        return (int) ($this->tinDang?->loai_tin === 'bao_mat' ? $this->tinDang?->nguoi_dung_id : $this->nguoi_yeu_cau_id);
    }

    protected $table = 'yeu_cau_nhan_do';

    protected $fillable = [
        'tin_dang_id',
        'nguoi_yeu_cau_id',
        'loi_nhan',
        'trang_thai',
        'nguoi_xu_ly_id',
        'ghi_chu_admin',
        'thoi_gian_xu_ly',
    ];

    protected function casts(): array
    {
        return [
            'thoi_gian_xu_ly' => 'datetime',
        ];
    }

    public function tinDang(): BelongsTo
    {
        return $this->belongsTo(TinDang::class, 'tin_dang_id');
    }

    public function nguoiYeuCau(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_yeu_cau_id');
    }

    public function nguoiXuLy(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_xu_ly_id');
    }

    public function cuocHen(): HasMany
    {
        return $this->hasMany(CuocHen::class, 'yeu_cau_id');
    }

    public function traLoi(): HasMany
    {
        return $this->hasMany(TraLoiYeuCau::class, 'yeu_cau_id');
    }

    public function minhChung(): HasMany
    {
        return $this->hasMany(MinhChungYeuCau::class, 'yeu_cau_id');
    }

    public function lichSu(): HasMany
    {
        return $this->hasMany(LichSuYeuCau::class, 'yeu_cau_id');
    }

    public function thongBao(): HasMany
    {
        return $this->hasMany(ThongBao::class, 'yeu_cau_id');
    }
}
