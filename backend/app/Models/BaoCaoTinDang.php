<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BaoCaoTinDang extends Model
{
    protected $table = 'bao_cao_tin_dang';

    protected $fillable = [
        'tin_dang_id',
        'nguoi_bao_cao_id',
        'ly_do',
        'mo_ta',
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

    public function nguoiBaoCao(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_bao_cao_id');
    }

    public function nguoiXuLy(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_xu_ly_id');
    }
}
