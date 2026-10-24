<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HinhAnhTinDang extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'hinh_anh_tin_dang';

    protected $fillable = [
        'tin_dang_id',
        'nguoi_tai_len_id',
        'duong_dan',
        'mo_ta',
        'pham_vi',
        'thu_tu',
    ];

    protected function casts(): array
    {
        return [
            'thu_tu' => 'integer',
        ];
    }

    public function tinDang(): BelongsTo
    {
        return $this->belongsTo(TinDang::class, 'tin_dang_id');
    }

    public function nguoiTaiLen(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_tai_len_id');
    }
}
