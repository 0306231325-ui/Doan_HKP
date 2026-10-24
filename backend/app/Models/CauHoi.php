<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CauHoi extends Model
{
    protected $table = 'cau_hoi';

    protected $fillable = [
        'danh_muc_id',
        'ma_cau_hoi',
        'phien_ban',
        'noi_dung',
        'kieu_nhap',
        'lua_chon',
        'loai_tin',
        'bat_buoc',
        'cong_khai',
        'dung_xac_minh',
        'thu_tu',
        'trang_thai',
    ];

    protected function casts(): array
    {
        return [
            'phien_ban' => 'integer',
            'lua_chon' => 'array',
            'bat_buoc' => 'boolean',
            'cong_khai' => 'boolean',
            'dung_xac_minh' => 'boolean',
            'thu_tu' => 'integer',
            'trang_thai' => 'boolean',
        ];
    }

    public function danhMuc(): BelongsTo
    {
        return $this->belongsTo(DanhMucDoVat::class, 'danh_muc_id');
    }

    public function loiKhaiTinDang(): HasMany
    {
        return $this->hasMany(LoiKhaiTinDang::class, 'cau_hoi_id');
    }
}
