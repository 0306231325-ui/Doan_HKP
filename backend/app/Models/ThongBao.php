<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ThongBao extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'thong_bao';

    protected $fillable = [
        'nguoi_dung_id',
        'tin_dang_id',
        'yeu_cau_id',
        'cuoc_hen_id',
        'loai_thong_bao',
        'tieu_de',
        'noi_dung',
        'thoi_gian_doc',
    ];

    protected function casts(): array
    {
        return [
            'thoi_gian_doc' => 'datetime',
        ];
    }

    public function nguoiDung(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_dung_id');
    }

    public function tinDang(): BelongsTo
    {
        return $this->belongsTo(TinDang::class, 'tin_dang_id');
    }

    public function yeuCauNhanDo(): BelongsTo
    {
        return $this->belongsTo(YeuCauNhanDo::class, 'yeu_cau_id');
    }

    public function cuocHen(): BelongsTo
    {
        return $this->belongsTo(CuocHen::class, 'cuoc_hen_id');
    }
}
