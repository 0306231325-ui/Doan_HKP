<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class NguoiDungSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('nguoi_dung')->insertOrIgnore([
            [
                'ho_ten' => 'Quản trị viên',
                'email' => 'admin@lacoi.test',
                'mat_khau' => Hash::make('Admin@123'),
                'ma_so' => 'ADMIN001',
                'khoa' => null,
                'lop' => null,
                'vai_tro' => 'quan_tri',
                'da_xac_minh' => 1,
            ],
            [
                'ho_ten' => 'Sinh viên mẫu',
                'email' => 'sinhvien@lacoi.test',
                'mat_khau' => Hash::make('SinhVien@123'),
                'ma_so' => 'SV001',
                'khoa' => 'Công nghệ thông tin',
                'lop' => 'CTK46A',
                'vai_tro' => 'nguoi_dung',
                'da_xac_minh' => 1,
            ],
            [
                'ho_ten' => 'Giảng viên mẫu',
                'email' => 'giangvien@lacoi.test',
                'mat_khau' => Hash::make('GiangVien@123'),
                'ma_so' => 'GV001',
                'khoa' => 'Công nghệ thông tin',
                'lop' => null,
                'vai_tro' => 'nguoi_dung',
                'da_xac_minh' => 1,
            ],
        ]);
    }
}
