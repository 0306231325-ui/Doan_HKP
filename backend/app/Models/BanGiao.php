<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BanGiao extends Model
{
    protected $table = 'ban_giao';

    public $timestamps = false;

    protected $fillable = [
        'cuoc_hen_id',
        'ma_ban_giao_hash',
        'ma_het_han_luc',
        'thoi_gian_ban_giao',
    ];

    protected $hidden = [
        'ma_ban_giao_hash',
    ];

    protected function casts(): array
    {
        return [
            'ma_het_han_luc' => 'datetime',
            'thoi_gian_ban_giao' => 'datetime',
        ];
    }

    public function cuocHen(): BelongsTo
    {
        return $this->belongsTo(CuocHen::class, 'cuoc_hen_id');
    }
}
