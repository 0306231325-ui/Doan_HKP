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
            ['Vũ Thiên Phú', 'vul53290', '0106032501', '0306231325', 'quan_tri'],
            ['Lê Gia Hân', 'legiahan', '0306240108', '0306231326', 'nguoi_dung'],
            ['Phạm Đức Khang', 'phamduckhang', '0306240223', '0306231327', 'nguoi_dung'],
            ['Nguyễn Thảo Vy', 'nguyenthaovy', '0306250116', '0306231328', 'nguoi_dung'],
            ['Võ Hoàng Nam', 'vohoangnam', '0106032502', '0306231329', 'nguoi_dung'],
            ['Nguyễn Minh Anh', 'nguyenminhanh', '0306240224', '0306231330', 'nguoi_dung'],
            ['Trần Quốc Bảo', 'tranquocbao', '0306240225', '0306231331', 'nguoi_dung'],
        ];

        // Chuẩn hóa tài khoản demo cũ tại chỗ để giữ nguyên các liên kết dữ liệu.
        foreach (['flexio-demo-1@example.test' => 'nguyenminhanh', 'flexio-demo-2@example.test' => 'tranquocbao'] as $emailCu => $tenMoi) {
            $mau = collect($taiKhoan)->first(fn ($dong) => $dong[1] === $tenMoi);
            $nguoiDung = NguoiDung::withTrashed()->where('email', $emailCu)->first();
            if ($nguoiDung && ! NguoiDung::withTrashed()->where('email', $tenMoi.'@caothang.edu.vn')->exists()) {
                $nguoiDung->update([
                    'ho_ten' => $mau[0],
                    'email' => $tenMoi.'@caothang.edu.vn',
                    'ma_so' => $mau[2],
                    'so_dien_thoai' => $mau[3],
                    'mat_khau' => '$2y$12$Uf795BjRO4VV4WRjsZwqXOgObGuYs9d8ak.PLs2pCTVeiCectMhAC',
                ]);
            }
        }

        foreach ($taiKhoan as [$hoTen, $tenEmail, $maSo, $soDienThoai, $vaiTro]) {
            NguoiDung::withTrashed()->firstOrCreate(['email' => $tenEmail.'@caothang.edu.vn'], [
                'ho_ten' => $hoTen,
                'mat_khau' => '$2y$12$Uf795BjRO4VV4WRjsZwqXOgObGuYs9d8ak.PLs2pCTVeiCectMhAC',
                'ma_so' => $maSo,
                'so_dien_thoai' => $soDienThoai,
                'vai_tro' => $vaiTro,
                'trang_thai' => 'hoat_dong',
            ]);
        }
    }
}
