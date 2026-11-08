<?php

namespace Database\Seeders;

use App\Models\NguoiDung;
use Illuminate\Database\Seeder;
use RuntimeException;

class NguoiDungSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            throw new RuntimeException('Chỉ tạo tài khoản mẫu ở môi trường local hoặc testing.');
        }

        $taiKhoan = [
            ['Trần Minh Quân', 'tranminhquan', '0106032501', '0306231325', 'Công nghệ thông tin', null, 'quan_tri'],
            ['Lê Gia Hân', 'legiahan', '0306240108', '0306231326', 'Công nghệ thông tin', 'CDTH24A', 'nguoi_dung'],
            ['Phạm Đức Khang', 'phamduckhang', '0306240223', '0306231327', 'Kỹ thuật ô tô', 'CDOT24A', 'nguoi_dung'],
            ['Nguyễn Thảo Vy', 'nguyenthaovy', '0306250116', '0306231328', 'Kế toán', 'CDKT25A', 'nguoi_dung'],
            ['Võ Hoàng Nam', 'vohoangnam', '0106032502', '0306231329', 'Kỹ thuật ô tô', null, 'nguoi_dung'],
        ];

        foreach ($taiKhoan as [$hoTen, $tenEmail, $maSo, $soDienThoai, $khoa, $lop, $vaiTro]) {
            NguoiDung::withTrashed()->firstOrCreate(['email' => $tenEmail.'@caothang.edu.vn'], [
                'ho_ten' => $hoTen,
                'mat_khau' => '$2y$12$Uf795BjRO4VV4WRjsZwqXOgObGuYs9d8ak.PLs2pCTVeiCectMhAC',
                'ma_so' => $maSo,
                'so_dien_thoai' => $soDienThoai,
                'khoa' => $khoa,
                'lop' => $lop,
                'vai_tro' => $vaiTro,
                'trang_thai' => 'hoat_dong',
            ]);
        }
    }
}
