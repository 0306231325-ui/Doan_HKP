<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HinhAnhTinDang extends Model
{
    public const TEN_ANH_MAU = 'hanghoa01.jpg';

    public const MAU_TEN_ANH = '(?:hanghoa01\.jpg|(?:[a-zA-Z0-9]{40}|anhtin[0-9]+(?:_[a-z])?|TIN-[0-9]{6,20}(?:-[a-z0-9-]{1,100})?)\.(jpg|jpeg|png|webp))';

    public const UPDATED_AT = null;

    protected $table = 'hinh_anh_tin_dang';

    protected $fillable = [
        'tin_dang_id',
        'nguoi_tai_len_id',
        'duong_dan',
        'mo_ta',
        'pham_vi',
        'thu_tu',
    ];

    protected function casts(): array
    {
        return [
            'thu_tu' => 'integer',
        ];
    }

    public function duongDanHienThi(): string
    {
        return preg_match('~\A/tin/tin-(?:mat|nhat)/('.self::MAU_TEN_ANH.')\z~', $this->duong_dan)
            ? '/api/tin-dang/anh/'.basename($this->duong_dan)
            : $this->duong_dan;
    }

    public function tinDang(): BelongsTo
    {
        return $this->belongsTo(TinDang::class, 'tin_dang_id');
    }

    public function nguoiTaiLen(): BelongsTo
    {
        return $this->belongsTo(NguoiDung::class, 'nguoi_tai_len_id');
    }
}
