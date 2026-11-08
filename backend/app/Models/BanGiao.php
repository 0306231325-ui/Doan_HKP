<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BanGiao extends Model
{
    protected $table = 'ban_giao';

    protected $fillable = [
        'cuoc_hen_id',
        'ma_ban_giao_hash',
        'ma_het_han_luc',
        'so_lan_nhap_sai',
        'phuong_thuc_ban_giao',
        'nguoi_xac_nhan_ban_giao_id',
        'thoi_gian_ban_giao',
        'ghi_chu_ban_giao',
    ];

    protected $hidden = [
        'ma_ban_giao_hash',
    ];

    protected function casts(): array
    {
        return [
            'ma_het_han_luc' => 'datetime',
            'so_lan_nhap_sai' => 'integer',
            'thoi_gian_ban_giao' => 'datetime',
        ];
    }

    public function cuocHen(): BelongsTo
    {
        return $this->belongsTo(CuocHen::class, 'cuoc_hen_id');
    }

    public function nguoiXacNhanBanGiao(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_xac_nhan_ban_giao_id');
    }
}
