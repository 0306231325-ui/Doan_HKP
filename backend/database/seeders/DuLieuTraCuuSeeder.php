<?php

namespace Database\Seeders;

use App\Models\DanhMucDoVat;
use App\Models\DiaDiem;
use App\Models\HinhAnhTinDang;
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

        $tenAnh = HinhAnhTinDang::TEN_ANH_MAU;
        if (! is_file(public_path('tin/'.$tenAnh))) {
            throw new RuntimeException('Thiếu ảnh tin mẫu: '.$tenAnh);
        }

        DB::transaction(function () use ($tenAnh) {
            $danhMuc = [];
            foreach (['Đồ điện tử', 'Đồ dùng học tập', 'Giấy tờ', 'Chìa khóa và vé xe', 'Ví và túi xách'] as $ten) {
                $danhMuc[$ten] = DanhMucDoVat::firstOrCreate(['ten_danh_muc' => $ten], ['trang_thai' => true]);
            }
            DanhMucDoVat::firstOrCreate(['ten_danh_muc' => 'Khác'], [
                'mo_ta' => 'Dành cho những đồ vật không phù hợp với các danh mục trên.',
                'trang_thai' => true,
            ]);

            $diaDiem = [];
            foreach (['Thư viện', 'Khoa Công nghệ thông tin', 'Khoa Kế toán', 'Khoa Kỹ thuật ô tô', 'Nhà xe sinh viên'] as $ten) {
                $diaDiem[$ten] = DiaDiem::firstOrCreate(['ten_dia_diem' => $ten], ['trang_thai' => true]);
            }

            $cacTin = [
                ['laptop-asus', 'Báo mất laptop ASUS VivoBook màu đen', 'legiahan', 'Đồ điện tử', 'Thư viện',
                    'bao_mat', '2026-11-05', '09:20', 'Bàn đọc tầng 2', 'Mình để quên laptop sau buổi học nhóm ở thư viện.'],
                ['the-ve-xe', 'Báo mất thẻ vé xe màu xanh', 'phamduckhang', 'Chìa khóa và vé xe', 'Nhà xe sinh viên',
                    'bao_mat', '2026-11-04', null, 'Lối ra nhà xe', 'Mình làm rơi thẻ vé xe màu xanh lúc rời nhà xe.'],
                ['may-tinh-flexio', 'Nhặt được máy tính cầm tay Flexio FX680VN', 'nguyenthaovy', 'Đồ dùng học tập', 'Khoa Kế toán',
                    'nhat_duoc', '2026-11-05', '10:45', 'Hành lang khoa', 'Mình nhặt được máy tính Flexio màu đen có viền xanh.'],
                ['the-can-cuoc', 'Nhặt được thẻ căn cước trước phòng máy', 'vohoangnam', 'Giấy tờ', 'Khoa Công nghệ thông tin',
                    'nhat_duoc', '2026-11-04', null, 'Hành lang trước phòng máy', 'Mình nhặt được thẻ căn cước.'],
                ['vi-da-den', 'Nhặt được ví da đen gần xưởng thực hành', 'phamduckhang', 'Ví và túi xách', 'Khoa Kỹ thuật ô tô',
                    'nhat_duoc', '2026-11-03', '15:10', 'Ghế chờ gần xưởng', 'Mình nhặt được ví da đen dạng gập ở khu ghế chờ.'],
            ];

            foreach ($cacTin as [$slug, $tieuDe, $tenEmail, $tenDanhMuc, $tenDiaDiem, $loaiTin, $ngay, $gio, $chiTiet, $moTa]) {
                $nguoiDang = NguoiDung::withTrashed()->where('email', $tenEmail.'@caothang.edu.vn')->firstOrFail();
                $tin = TinDang::withTrashed()->firstOrCreate(['slug' => 'mau-tra-cuu-'.$slug], [
                    'nguoi_dung_id' => $nguoiDang->id,
                    'danh_muc_id' => $danhMuc[$tenDanhMuc]->id,
                    'dia_diem_id' => $diaDiem[$tenDiaDiem]->id,
                    'loai_tin' => $loaiTin,
                    'tieu_de' => $tieuDe,
                    'mo_ta' => $moTa,
                    'thoi_gian_xay_ra' => $ngay.' '.($gio ?? '00:00').':00',
                    'co_gio_xay_ra' => $gio !== null,
                    'dia_diem_chi_tiet' => $chiTiet,
                    'thong_tin_lien_he' => $nguoiDang->so_dien_thoai,
                    'email_lien_he' => $nguoiDang->email,
                    'trang_thai' => 'dang_mo',
                    'trang_thai_kiem_duyet' => 'hien_thi',
                ]);

                $soAnh = match ($slug) {
                    'laptop-asus' => 3,
                    'the-ve-xe' => 2,
                    default => 1,
                };
                $this->dongBoAnhMau($tin, $tenAnh, $soAnh);

                if (! $tin->wasRecentlyCreated) {
                    continue;
                }

                $tin->lichSu()->create([
                    'nguoi_thuc_hien_id' => $nguoiDang->id,
                    'hanh_dong' => 'tao_tin',
                    'trang_thai_moi' => 'hien_thi',
                    'noi_dung' => 'Đã đăng tin.',
                ]);
            }

            $this->call(CauHoiTinMauSeeder::class);
        });
    }

    private function dongBoAnhMau(TinDang $tin, string $tenAnh, int $soAnh): void
    {
        $duongDan = '/api/tin-dang/anh/'.$tenAnh;
        $anhMau = $tin->hinhAnh()->where('pham_vi', 'cong_khai')->orderBy('thu_tu')->orderBy('id')->get()
            ->filter(fn (HinhAnhTinDang $anh) => $anh->duong_dan === $duongDan
                || preg_match('~\A/(?:api/tin-dang/anh|tin/tin-(?:mat|nhat))/anhtin[1-5](?:_a)?\.(?:jpg|webp|png)\z~', $anh->duong_dan));

        for ($thuTu = 0; $thuTu < $soAnh; $thuTu++) {
            $anh = $anhMau->shift() ?? $tin->hinhAnh()->make([
                'nguoi_tai_len_id' => $tin->nguoi_dung_id,
                'pham_vi' => 'cong_khai',
            ]);
            $anh->fill(['duong_dan' => $duongDan, 'thu_tu' => $thuTu])->save();
        }

        if ($anhMau->isNotEmpty()) {
            $tin->hinhAnh()->whereKey($anhMau->modelKeys())->delete();
        }
    }
}
