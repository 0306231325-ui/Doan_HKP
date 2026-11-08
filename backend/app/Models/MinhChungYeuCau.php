<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MinhChungYeuCau extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'minh_chung_yeu_cau';

    protected $fillable = [
        'yeu_cau_id',
        'duong_dan',
        'mo_ta',
        'thu_tu',
    ];

    protected function casts(): array
    {
        return [
            'thu_tu' => 'integer',
        ];
    }

    public function yeuCauNhanDo(): BelongsTo
    {
        return $this->belongsTo(YeuCauNhanDo::class, 'yeu_cau_id');
    }
}
