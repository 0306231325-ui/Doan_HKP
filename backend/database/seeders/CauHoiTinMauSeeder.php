<?php

namespace Database\Seeders;

use App\Models\CauHoi;
use App\Models\DanhMucDoVat;
use App\Models\LichSuCauHoi;
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
            'Đồ điện tử' => [
                ['Đồ vật có xuất xứ theo hãng gì ?', 'Thiết bị thuộc hãng hoặc dòng máy nào?', 'van_ban'],
                ['đồ vật mất có số lượng là ?', 'Có bao nhiêu thiết bị giống như mô tả?', 'so'],
                ['đồ vật mất màu sắc ra sao ?', 'Thiết bị có màu sắc và kiểu dáng như thế nào?', 'van_ban'],
                ['có mất vết xước', 'Thiết bị có bao nhiêu dấu hiệu riêng như vết xước, tem hoặc ký hiệu?', 'so'],
                ['đồ dùng có ốp màu gì', 'Thiết bị có đi kèm phụ kiện gì, nếu có?', 'van_ban'],
            ],
            'Đồ dùng học tập' => [
                ['Nắp trượt của máy tính có dấu hiệu nhận biết gì?', 'Đồ dùng có dấu hiệu riêng nào để nhận biết?', 'van_ban'],
                ['Có bao nhiêu tem dán ở mặt sau máy tính?', 'Có bao nhiêu tem, nhãn hoặc ký hiệu riêng trên đồ dùng?', 'so'],
            ],
            'Giấy tờ' => [
                ['Thẻ được để trong loại bao đựng nào?', 'Giấy tờ được cất trong vật gì, nếu có?', 'van_ban'],
                ['Bao đựng thẻ có dấu hiệu nhận biết gì ở góc?', 'Giấy tờ hoặc vật đựng có đặc điểm riêng nào để nhận biết?', 'van_ban'],
            ],
            'Chìa khóa và vé xe' => [
                [null, 'Đồ vật có màu sắc và kiểu dáng như thế nào?', 'van_ban'],
                [null, 'Đồ vật có dấu hiệu riêng nào như ký hiệu, móc treo hoặc vết xước?', 'van_ban'],
            ],
            'Ví và túi xách' => [
                ['Lớp lót bên trong ví màu gì?', 'Bên trong đồ vật có màu sắc hoặc đặc điểm gì dễ nhận ra?', 'van_ban'],
                ['Ví có bao nhiêu ngăn nhỏ để thẻ?', 'Đồ vật có bao nhiêu ngăn nhỏ?', 'so'],
            ],
            'Khác' => [
                [null, 'Đồ vật có màu sắc, hình dáng hoặc chất liệu như thế nào?', 'van_ban'],
                [null, 'Đồ vật có dấu hiệu riêng nào để nhận biết?', 'van_ban'],
            ],
        ];
        $loiKhaiMau = [
            'Đồ dùng học tập' => ['mau-tra-cuu-may-tinh-flexio', ['Có một vết xước chéo ở góc dưới của nắp.', '1']],
            'Giấy tờ' => ['mau-tra-cuu-the-can-cuoc', ['Bao nhựa trong có viền xanh.', 'Góc trên bên phải của bao bị gập.']],
            'Ví và túi xách' => ['mau-tra-cuu-vi-da-den', ['Lớp lót màu nâu.', '4']],
        ];

        DB::transaction(function () use ($boCauHoi, $loiKhaiMau, $traLoi) {
            $danhMuc = DanhMucDoVat::whereIn('ten_danh_muc', array_keys($boCauHoi))->where('trang_thai', true)
                ->orderBy('id')->lockForUpdate()->get();

            foreach ($danhMuc as $muc) {
                $ten = $muc->ten_danh_muc;
                $cauHienCo = $muc->cauHoi()->orderBy('id')->lockForUpdate()->get()->keyBy('noi_dung');
                $cacBan = [];
                foreach ($boCauHoi[$ten] as $thuTu => [$noiDungCu, $noiDung, $kieuNhap]) {
                    $cau = $cauHienCo->get($noiDung) ?? ($noiDungCu === null ? null : $cauHienCo->get($noiDungCu));
                    $cacBan[] = $this->luuCauHoi($cau ?? new CauHoi, $muc, $noiDung, $kieuNhap, $thuTu + 1);
                }

                if (! isset($loiKhaiMau[$ten])) {
                    continue;
                }
                [$slug, $dapAn] = $loiKhaiMau[$ten];
                $tin = $muc->tinDang()->where('slug', $slug)->where('loai_tin', 'nhat_duoc')->lockForUpdate()->first();
                if (! $tin || $tin->yeuCauNhanDo()->exists()) {
                    continue;
                }
                foreach ($cacBan as $thuTu => $ban) {
                    $giaTri = $traLoi->giaTri($traLoi->cauHoi($ban, (string) $ban->cau_hoi_id), $dapAn[$thuTu], 'giaTri');
                    $tin->loiKhai()->updateOrCreate(['cau_hoi_id' => $ban->cau_hoi_id], [
                        'cau_hoi_phien_ban_id' => $ban->id,
                        'gia_tri_text' => $giaTri['gia_tri_text'] ?? null,
                        'gia_tri_so' => $giaTri['gia_tri_so'] ?? null,
                        'gia_tri_lua_chon' => null,
                    ]);
                }
            }
        }, 3);
    }

    private function luuCauHoi(CauHoi $cau, DanhMucDoVat $muc, string $noiDung, string $kieuNhap, int $thuTu): LichSuCauHoi
    {
        $cau->fill([
            'danh_muc_id' => $muc->id, 'noi_dung' => $noiDung,
            'kieu_nhap' => $kieuNhap, 'thu_tu' => $thuTu, 'trang_thai' => true,
        ]);
        $doiNoiDung = $cau->isDirty(['noi_dung', 'kieu_nhap', 'thu_tu']);
        $cau->save();
        $ban = $cau->lichSu()->reorder('phien_ban', 'desc')->first();

        if ($ban && ! $doiNoiDung) {
            return $ban;
        }

        return $cau->lichSu()->create([
            'phien_ban' => ($ban?->phien_ban ?? 0) + 1, 'du_lieu' => $cau->attributesToArray(),
        ]);
    }
}
