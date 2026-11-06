<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LichSuCauHoi extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'lich_su_cau_hoi';

    protected $fillable = ['cau_hoi_id', 'phien_ban', 'du_lieu'];

    protected function casts(): array
    {
        return ['phien_ban' => 'integer', 'du_lieu' => 'array'];
    }

    public function cauHoi(): BelongsTo
    {
        return $this->belongsTo(CauHoi::class, 'cau_hoi_id');
    }
}
