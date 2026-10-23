<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LichSuYeuCau extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'lich_su_yeu_cau';

    protected $fillable = [
        'yeu_cau_id',
        'cuoc_hen_id',
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

    public function yeuCauNhanDo(): BelongsTo
    {
        return $this->belongsTo(YeuCauNhanDo::class, 'yeu_cau_id');
    }

    public function cuocHen(): BelongsTo
    {
        return $this->belongsTo(CuocHen::class, 'cuoc_hen_id');
    }

    public function nguoiThucHien(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_thuc_hien_id');
    }
}
