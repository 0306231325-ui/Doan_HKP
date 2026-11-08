<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LichSuTinDang extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'lich_su_tin_dang';

    protected $fillable = [
        'tin_dang_id',
        'nguoi_thuc_hien_id',
        'hanh_dong',
        'trang_thai_cu',
        'trang_thai_moi',
        'noi_dung',
        'du_lieu_cu',
        'du_lieu_moi',
    ];

    protected function casts(): array
    {
        return [
            'du_lieu_cu' => 'array',
            'du_lieu_moi' => 'array',
        ];
    }

    public function tinDang(): BelongsTo
    {
        return $this->belongsTo(TinDang::class, 'tin_dang_id');
    }

    public function nguoiThucHien(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_thuc_hien_id');
    }
}
