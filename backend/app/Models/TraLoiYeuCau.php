<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TraLoiYeuCau extends Model
{
    protected $table = 'tra_loi_yeu_cau';

    protected $fillable = [
        'yeu_cau_id',
        'tin_dang_id',
        'loi_khai_tin_dang_id',
        'gia_tri_text',
        'ket_qua_doi_chieu',
    ];

    public function yeuCauNhanDo(): BelongsTo
    {
        return $this->belongsTo(YeuCauNhanDo::class, 'yeu_cau_id');
    }

    public function tinDang(): BelongsTo
    {
        return $this->belongsTo(TinDang::class, 'tin_dang_id');
    }

    public function loiKhaiTinDang(): BelongsTo
    {
        return $this->belongsTo(LoiKhaiTinDang::class, 'loi_khai_tin_dang_id');
    }
}
