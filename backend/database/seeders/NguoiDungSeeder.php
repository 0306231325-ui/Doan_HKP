<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NguoiDungSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('nguoi_dung')->insertOrIgnore([
            [
                'ho_ten' => 'Quản trị viên',
                'email' => 'adminlacoi@gmail.com',
                'mat_khau' => 'Admin@123',
                'so_dien_thoai' => '0123456789',
                'ma_so' => 'ADMIN001',
                'khoa' => null,
                'lop' => null,
                'vai_tro' => 'quan_tri',
            ],
            [
                'ho_ten' => 'Sinh viên mẫu',
                'email' => 'sinhvien@lacoi.test',
                'mat_khau' => 'SinhVien@123',
                'so_dien_thoai' => null,
                'ma_so' => 'SV001',
                'khoa' => 'Công nghệ thông tin',
                'lop' => 'CTK46A',
                'vai_tro' => 'nguoi_dung',
            ],
            [
                'ho_ten' => 'Giảng viên mẫu',
                'email' => 'giangvien@lacoi.test',
                'mat_khau' => 'GiangVien@123',
                'so_dien_thoai' => null,
                'ma_so' => 'GV001',
                'khoa' => 'Công nghệ thông tin',
                'lop' => null,
                'vai_tro' => 'nguoi_dung',
            ],
        ]);
    }
}
