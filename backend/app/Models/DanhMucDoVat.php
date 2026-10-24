<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DanhMucDoVat extends Model
{
    protected $table = 'danh_muc_do_vat';

    protected $fillable = [
        'ten_danh_muc',
        'bieu_tuong',
        'mo_ta',
        'trang_thai',
    ];

    protected function casts(): array
    {
        return [
            'trang_thai' => 'boolean',
        ];
    }

    public function cauHoi(): HasMany
    {
        return $this->hasMany(CauHoi::class, 'danh_muc_id');
    }

    public function tinDang(): HasMany
    {
        return $this->hasMany(TinDang::class, 'danh_muc_id');
    }
}
