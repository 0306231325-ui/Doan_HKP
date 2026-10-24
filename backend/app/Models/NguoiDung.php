<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class NguoiDung extends Authenticatable
{
    use HasApiTokens, SoftDeletes;

    protected $table = 'nguoi_dung';

    protected $authPasswordName = 'mat_khau';

    protected $rememberTokenName = null;

    protected $fillable = [
        'ho_ten',
        'email',
        'mat_khau',
        'so_dien_thoai',
        'ma_so',
        'khoa',
        'lop',
        'vai_tro',
        'da_xac_minh',
        'trang_thai',
        'ly_do_khoa',
        'khoa_den_ngay',
        'anh_dai_dien',
    ];

    protected $hidden = [
        'mat_khau',
    ];

    protected function casts(): array
    {
        return [
            'mat_khau' => 'hashed',
            'da_xac_minh' => 'boolean',
            'khoa_den_ngay' => 'datetime',
        ];
    }

    public function tinDang(): HasMany
    {
        return $this->hasMany(TinDang::class, 'nguoi_dung_id');
    }

    public function yeuCauNhanDo(): HasMany
    {
        return $this->hasMany(YeuCauNhanDo::class, 'nguoi_yeu_cau_id');
    }

    public function yeuCauDaXuLy(): HasMany
    {
        return $this->hasMany(YeuCauNhanDo::class, 'nguoi_xu_ly_id');
    }

    public function cuocHenGiuDo(): HasMany
    {
        return $this->hasMany(CuocHen::class, 'nguoi_giu_do_id');
    }

    public function cuocHenDeXuat(): HasMany
    {
        return $this->hasMany(CuocHen::class, 'nguoi_de_xuat_id');
    }

    public function cuocHenXacNhan(): HasMany
    {
        return $this->hasMany(CuocHen::class, 'nguoi_xac_nhan_id');
    }

    public function banGiaoDaXacNhan(): HasMany
    {
        return $this->hasMany(BanGiao::class, 'nguoi_xac_nhan_ban_giao_id');
    }

    public function hinhAnhTinDang(): HasMany
    {
        return $this->hasMany(HinhAnhTinDang::class, 'nguoi_tai_len_id');
    }

    public function lichSuTinDang(): HasMany
    {
        return $this->hasMany(LichSuTinDang::class, 'nguoi_thuc_hien_id');
    }

    public function lichSuYeuCau(): HasMany
    {
        return $this->hasMany(LichSuYeuCau::class, 'nguoi_thuc_hien_id');
    }

    public function baoCaoTinDang(): HasMany
    {
        return $this->hasMany(BaoCaoTinDang::class, 'nguoi_bao_cao_id');
    }

    public function baoCaoDaXuLy(): HasMany
    {
        return $this->hasMany(BaoCaoTinDang::class, 'nguoi_xu_ly_id');
    }

    public function thongBao(): HasMany
    {
        return $this->hasMany(ThongBao::class, 'nguoi_dung_id');
    }
}
