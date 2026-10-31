<?php

namespace Database\Seeders;

use App\Models\DanhMucDoVat;
use App\Models\DiaDiem;
use App\Models\NguoiDung;
use App\Models\TinDang;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class DuLieuTraCuuSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            throw new RuntimeException('Chỉ seed dữ liệu tra cứu mẫu ở môi trường local hoặc testing.');
        }
        $nguoiDung = NguoiDung::where('trang_thai', 'hoat_dong')->orderBy('id')->first();
        if (! $nguoiDung) {
            throw new RuntimeException('Cần có ít nhất một tài khoản hoạt động trước khi seed tin mẫu.');
        }
        DB::transaction(function () use ($nguoiDung) {
            $danhMuc = [];
            foreach (['Điện thoại', 'Ví và giấy tờ', 'Chìa khóa', 'Sách vở', 'Phụ kiện điện tử'] as $ten) {
                $danhMuc[$ten] = DanhMucDoVat::firstOrCreate(['ten_danh_muc' => $ten], ['trang_thai' => true]);
            }
            $diaDiem = [];
            foreach (['Thư viện', 'Căn tin', 'Nhà xe', 'Sân trường', 'Khu phòng học'] as $ten) {
                $diaDiem[$ten] = DiaDiem::firstOrCreate(['ten_dia_diem' => $ten], ['trang_thai' => true]);
            }
            $cacTin = [
                ['dien-thoai-den', 'Nhặt được điện thoại màu đen', 'Điện thoại', 'Thư viện', 'nhat_duoc', 'Điện thoại có ốp màu đen, nhặt tại khu bàn đọc sách.', 'Bàn đọc tầng 1'],
                ['vi-da-nau', 'Mất ví da màu nâu', 'Ví và giấy tờ', 'Căn tin', 'bao_mat', 'Ví da nhỏ màu nâu, có ngăn đựng thẻ và giấy tờ.', 'Khu bàn gần quầy nước'],
                ['chum-chia-khoa', 'Nhặt được chùm chìa khóa', 'Chìa khóa', 'Nhà xe', 'nhat_duoc', 'Chùm chìa khóa có móc vải màu xanh.', 'Lối đi khu gửi xe'],
                ['sach-lap-trinh', 'Mất sách lập trình PHP', 'Sách vở', 'Khu phòng học', 'bao_mat', 'Sách lập trình PHP và MySQL, bìa xanh, có ghi chú bằng bút chì.', 'Hành lang tầng 2'],
                ['tai-nghe-trang', 'Nhặt được tai nghe màu trắng', 'Phụ kiện điện tử', 'Sân trường', 'nhat_duoc', 'Hộp tai nghe không dây màu trắng, có vết xước nhỏ bên ngoài.', 'Ghế đá gần lối vào'],
                ['dien-thoai-xanh', 'Mất điện thoại ốp xanh', 'Điện thoại', 'Sân trường', 'bao_mat', 'Điện thoại dùng ốp xanh dương, mặt lưng có hình dán nhỏ.', 'Khu ghế đá'],
                ['the-sinh-vien', 'Nhặt được thẻ sinh viên', 'Ví và giấy tờ', 'Thư viện', 'nhat_duoc', 'Thẻ sinh viên để trong bao đeo màu xanh. Thông tin nhận dạng cần đối chiếu khi nhận.', 'Quầy mượn sách'],
                ['sac-laptop', 'Mất sạc laptop màu đen', 'Phụ kiện điện tử', 'Khu phòng học', 'bao_mat', 'Bộ sạc laptop màu đen, dây được buộc bằng dây dán.', 'Phòng tự học'],
            ];
            foreach ($cacTin as $viTri => [$slug, $tieuDe, $tenDanhMuc, $tenDiaDiem, $loaiTin, $moTa, $chiTiet]) {
                TinDang::withTrashed()->firstOrCreate(['slug' => 'mau-tra-cuu-'.$slug], [
                    'nguoi_dung_id' => $nguoiDung->id, 'danh_muc_id' => $danhMuc[$tenDanhMuc]->id,
                    'dia_diem_id' => $diaDiem[$tenDiaDiem]->id, 'loai_tin' => $loaiTin,
                    'tieu_de' => $tieuDe, 'mo_ta' => $moTa.' (Dữ liệu mẫu để thử tìm kiếm.)',
                    'thoi_gian_xay_ra' => now('Asia/Ho_Chi_Minh')->subDays($viTri),
                    'dia_diem_chi_tiet' => $chiTiet, 'thong_tin_lien_he' => null,
                    'trang_thai' => 'dang_mo', 'trang_thai_kiem_duyet' => 'hien_thi',
                ]);
            }
        });
    }
}
