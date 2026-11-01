<?php

namespace Database\Seeders;

use App\Models\BaoCaoTinDang;
use App\Models\NguoiDung;
use App\Models\TinDang;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class BaoCaoTinDangSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            throw new RuntimeException('Chỉ tạo báo cáo mẫu ở local hoặc testing.');
        }
        $nguoiDung = NguoiDung::where('trang_thai', 'hoat_dong')->orderBy('id')->get();
        $cacTin = TinDang::where('slug', 'like', 'mau-tra-cuu-%')->orderBy('id')->take(2)->get();
        if ($nguoiDung->isEmpty() || $cacTin->count() < 2) {
            throw new RuntimeException('Cần có người dùng hoạt động và ít nhất 2 tin mẫu tra cứu trước.');
        }
        DB::transaction(function () use ($nguoiDung, $cacTin) {
            foreach ([['Thông tin không chính xác', 'Nội dung mô tả và địa điểm cần được đối chiếu.'], ['Nghi ngờ yêu cầu phí nhận đồ', 'Đề nghị kiểm tra việc yêu cầu chuyển tiền trước khi nhận đồ.'], ['Nội dung không phù hợp', 'Thông tin liên hệ và nội dung cần được quản trị viên xác minh.'], ['Tin đăng trùng lặp', 'Có tin khác với mô tả tương tự, đề nghị kiểm tra.'], ['Nghi ngờ thông tin sai', 'Thời gian và địa điểm chưa thống nhất.']] as $i => [$lyDo, $moTa]) {
                // Định danh ổn định để chạy lại không tạo trùng hoặc đặt lại báo cáo đã xử lý.
                BaoCaoTinDang::firstOrCreate([
                    'tin_dang_id' => $cacTin[$i < 3 ? 0 : 1]->id,
                    'nguoi_bao_cao_id' => $nguoiDung[$i % $nguoiDung->count()]->id,
                    'mo_ta' => '[Báo cáo mẫu '.($i + 1).'] '.$moTa.' Đây là tình huống giả lập để thử kiểm duyệt.',
                ], ['ly_do' => $lyDo, 'trang_thai' => 'cho_xu_ly']);
            }
        });
    }
}
