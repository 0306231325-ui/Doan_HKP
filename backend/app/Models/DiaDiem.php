<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DiaDiem extends Model
{
    protected $table = 'dia_diem';

    protected $fillable = [
        'ten_dia_diem',
        'mo_ta',
        'trang_thai',
    ];

    protected function casts(): array
    {
        return [
            'trang_thai' => 'boolean',
        ];
    }

    public function tinDang(): HasMany
    {
        return $this->hasMany(TinDang::class, 'dia_diem_id');
    }

    public function yeuCauNhanDo(): HasMany
    {
        return $this->hasMany(YeuCauNhanDo::class, 'dia_diem_mat_id');
    }

    public function cuocHen(): HasMany
    {
        return $this->hasMany(CuocHen::class, 'dia_diem_id');
    }
}
