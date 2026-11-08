<?php

namespace Database\Seeders;

use App\Models\CauHoi;
use App\Models\TinDang;
use App\Services\CauTraLoiTinDang;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CauHoiTinMauSeeder extends Seeder
{
    public function run(CauTraLoiTinDang $traLoi): void
    {
        if (! app()->environment(['local', 'testing'])) {
            throw new RuntimeException('Chỉ seed câu hỏi tin mẫu ở môi trường local hoặc testing.');
        }

        $boCauHoi = [
            'mau-tra-cuu-may-tinh-flexio' => [
                ['Nắp trượt của máy tính có dấu hiệu nhận biết gì?', 'van_ban', 'Nắp có vết xước chéo ở góc dưới.'],
                ['Có bao nhiêu tem dán ở mặt sau máy tính?', 'so', '1'],
            ],
            'mau-tra-cuu-the-can-cuoc' => [
                ['Thẻ được để trong loại bao đựng nào?', 'van_ban', 'Bao nhựa trong có viền xanh.'],
                ['Bao đựng thẻ có dấu hiệu nhận biết gì ở góc?', 'van_ban', 'Góc trên bên phải của bao bị gập.'],
            ],
            'mau-tra-cuu-vi-da-den' => [
                ['Lớp lót bên trong ví màu gì?', 'van_ban', 'Màu nâu.'],
                ['Ví có bao nhiêu ngăn nhỏ để thẻ?', 'so', '4'],
            ],
        ];

        DB::transaction(function () use ($boCauHoi, $traLoi) {
            $cacTin = TinDang::whereIn('slug', array_keys($boCauHoi))->where('loai_tin', 'nhat_duoc')
                ->orderBy('id')->lockForUpdate()->get();

            foreach ($cacTin as $tin) {
                if ($tin->loiKhai()->exists()) {
                    continue;
                }

                foreach ($boCauHoi[$tin->slug] as $thuTu => [$noiDung, $kieuNhap, $dapAn]) {
                    $cau = CauHoi::create([
                        'danh_muc_id' => $tin->danh_muc_id,
                        'noi_dung' => $noiDung,
                        'kieu_nhap' => $kieuNhap,
                        'thu_tu' => $thuTu + 1,
                        'trang_thai' => false,
                    ]);
                    $ban = $cau->lichSu()->create(['phien_ban' => 1, 'du_lieu' => $cau->attributesToArray()]);
                    $tin->loiKhai()->create([
                        'cau_hoi_id' => $cau->id,
                        'cau_hoi_phien_ban_id' => $ban->id,
                        ...$traLoi->giaTri($traLoi->cauHoi($ban, (string) $cau->id), $dapAn, 'giaTri'),
                    ]);
                }
            }
        });
    }
}
