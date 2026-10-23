<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LoiKhaiTinDang extends Model
{
    protected $table = 'loi_khai_tin_dang';

    protected $fillable = [
        'tin_dang_id',
        'cau_hoi_id',
        'gia_tri_text',
        'gia_tri_so',
        'gia_tri_lua_chon',
    ];

    protected function casts(): array
    {
        return [
            'gia_tri_so' => 'decimal:4',
        ];
    }

    public function tinDang(): BelongsTo
    {
        return $this->belongsTo(TinDang::class, 'tin_dang_id');
    }

    public function cauHoi(): BelongsTo
    {
        return $this->belongsTo(CauHoi::class, 'cau_hoi_id');
    }

    public function traLoiYeuCau(): HasMany
    {
        return $this->hasMany(TraLoiYeuCau::class, 'loi_khai_tin_dang_id');
    }
}
