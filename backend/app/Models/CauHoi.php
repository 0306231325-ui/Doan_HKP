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
        'noi_dung',
        'kieu_nhap',
        'thu_tu',
        'trang_thai',
    ];

    protected function casts(): array
    {
        return [
            'thu_tu' => 'integer',
            'trang_thai' => 'boolean',
        ];
    }

    public function danhMuc(): BelongsTo
    {
        return $this->belongsTo(DanhMucDoVat::class, 'danh_muc_id');
    }

    public function lichSu(): HasMany
    {
        return $this->hasMany(LichSuCauHoi::class, 'cau_hoi_id')->orderBy('phien_ban');
    }

    public function loiKhaiTinDang(): HasMany
    {
        return $this->hasMany(LoiKhaiTinDang::class, 'cau_hoi_id');
    }
}
