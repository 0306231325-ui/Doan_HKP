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
                [['Thiết bị thuộc hãng hoặc dòng máy nào?', 'Đồ vật có xuất xứ theo hãng gì ?'],
                    'Thiết bị của hãng nào và thuộc mẫu máy nào, nếu biết?'],
                [['Có bao nhiêu thiết bị giống như mô tả?', 'đồ vật mất có số lượng là ?'],
                    'Nếu biết, ghi 4 ký tự cuối của số sê-ri hoặc mã tài sản in trên thiết bị.'],
                [['Thiết bị có màu sắc và kiểu dáng như thế nào?', 'đồ vật mất màu sắc ra sao ?'],
                    'Thân thiết bị có màu gì? Viền, nắp hoặc phím có màu khác gì so với thân?'],
                [['Thiết bị có bao nhiêu dấu hiệu riêng như vết xước, tem hoặc ký hiệu?', 'có mất vết xước'],
                    'Thiết bị có vết trầy, chỗ móp hoặc ký hiệu riêng nào? Mô tả vị trí và hình dạng nếu có.'],
                [['Thiết bị có đi kèm phụ kiện gì, nếu có?', 'đồ dùng có ốp màu gì'],
                    'Thiết bị có ốp, bao đựng hoặc phụ kiện đi kèm nào? Nếu có, mô tả màu hoặc đặc điểm dễ nhận ra.'],
            ],
            'Đồ dùng học tập' => [
                [['Đồ dùng có dấu hiệu riêng nào để nhận biết?', 'Nắp trượt của máy tính có dấu hiệu nhận biết gì?'],
                    'Đồ dùng có vết trầy, nứt hoặc sứt ở đâu? Mô tả hình dạng của vết nếu có.'],
                [['Có bao nhiêu tem, nhãn hoặc ký hiệu riêng trên đồ dùng?', 'Có bao nhiêu tem dán ở mặt sau máy tính?'],
                    'Trên đồ dùng có tem dán, tên viết hoặc ký hiệu nào? Mô tả dấu đó và vị trí nếu có.'],
            ],
            'Giấy tờ' => [
                [['Giấy tờ được cất trong vật gì, nếu có?', 'Thẻ được để trong loại bao đựng nào?'],
                    'Giấy tờ được đựng trong bao, bìa hay ví nào? Mô tả màu và chất liệu nếu có.'],
                [['Giấy tờ hoặc vật đựng có đặc điểm riêng nào để nhận biết?', 'Bao đựng thẻ có dấu hiệu nhận biết gì ở góc?'],
                    'Giấy tờ hoặc bao đựng có dấu gì như vết gập, rách hay nhãn dán? Mô tả dấu đó và vị trí nếu có.'],
            ],
            'Chìa khóa và vé xe' => [
                [['Đồ vật có màu sắc và kiểu dáng như thế nào?'],
                    'Nếu là chùm chìa, có mấy chìa và đầu chìa có hình dạng hoặc màu gì? Nếu là vé xe, vé làm bằng gì và có logo hoặc chữ gì?'],
                [['Đồ vật có dấu hiệu riêng nào như ký hiệu, móc treo hoặc vết xước?'],
                    'Móc chìa có hình gì hoặc trên chìa hay vé xe có dấu riêng nào như vết trầy, vết nứt hoặc chữ viết tay?'],
            ],
            'Ví và túi xách' => [
                [['Bên trong đồ vật có màu sắc hoặc đặc điểm gì dễ nhận ra?', 'Lớp lót bên trong ví màu gì?'],
                    'Lớp lót bên trong ví hoặc túi có màu gì và có hoa văn gì, nếu có?'],
                [['Đồ vật có bao nhiêu ngăn nhỏ?', 'Ví có bao nhiêu ngăn nhỏ để thẻ?'],
                    'Trong ví hoặc túi có vật gì và nằm ở ngăn nào? Chỉ mô tả vật, bỏ qua thông tin cá nhân.'],
            ],
            'Khác' => [
                [['Đồ vật có màu sắc, hình dáng hoặc chất liệu như thế nào?'],
                    'Món đồ dùng để làm gì, làm bằng chất liệu gì và có kích thước khoảng bao nhiêu?'],
                [['Đồ vật có dấu hiệu riêng nào để nhận biết?'],
                    'Món đồ có chỗ đã sửa, phần bị hỏng hoặc dấu đánh dấu nào? Mô tả dấu đó và vị trí nếu có.'],
            ],
        ];
        $loiKhaiMau = [
            'Đồ dùng học tập' => ['mau-tra-cuu-may-tinh-flexio', ['Có một vết xước chéo ở góc dưới của nắp.', 'Tem tròn màu trắng ở góc trên bên phải mặt lưng.']],
            'Giấy tờ' => ['mau-tra-cuu-the-can-cuoc', ['Bao nhựa trong có viền xanh.', 'Góc trên bên phải của bao bị gập.']],
            'Ví và túi xách' => ['mau-tra-cuu-vi-da-den', ['Lớp lót màu nâu.', 'Một biên lai gấp đôi nằm trong ngăn có khóa kéo.']],
        ];

        DB::transaction(function () use ($boCauHoi, $loiKhaiMau, $traLoi) {
            $danhMuc = DanhMucDoVat::whereIn('ten_danh_muc', array_keys($boCauHoi))->where('trang_thai', true)
                ->orderBy('id')->lockForUpdate()->get();

            foreach ($danhMuc as $muc) {
                $ten = $muc->ten_danh_muc;
                $cauHienCo = $muc->cauHoi()->orderBy('id')->lockForUpdate()->get();
                $tongCau = $cauHienCo->count();
                $theoNoiDung = $cauHienCo->keyBy('noi_dung');
                $cacBan = [];
                foreach ($boCauHoi[$ten] as $thuTu => [$cacNhanCu, $noiDung]) {
                    $cau = $theoNoiDung->get($noiDung)
                        ?? collect($cacNhanCu)->map(fn ($nhan) => $theoNoiDung->get($nhan))->first(fn ($cu) => $cu !== null);
                    if (! $cau) {
                        if ($tongCau >= CauHoi::GIOI_HAN_MOI_DANH_MUC) {
                            continue;
                        }
                        $cau = new CauHoi;
                        $tongCau++;
                    }
                    $cacBan[$thuTu] = $this->luuCauHoi($cau, $muc, $noiDung, $thuTu + 1);
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
                    ]);
                }
            }
        }, 3);
    }

    private function luuCauHoi(CauHoi $cau, DanhMucDoVat $muc, string $noiDung, int $thuTu): LichSuCauHoi
    {
        $cau->fill([
            'danh_muc_id' => $muc->id, 'noi_dung' => $noiDung,
            'thu_tu' => $thuTu, 'trang_thai' => true,
        ]);
        $doiNoiDung = $cau->isDirty(['noi_dung', 'thu_tu']);
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
