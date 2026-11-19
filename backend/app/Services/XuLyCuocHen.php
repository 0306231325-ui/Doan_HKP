<?php

namespace App\Services;

use App\Models\CuocHen;
use App\Models\DiaDiem;
use App\Models\NguoiDung;
use App\Models\TinDang;
use App\Models\YeuCauNhanDo;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

class XuLyCuocHen
{
    public const SO_LAN_HEN_TOI_DA = 2;

    public const HET_LUOT_HEN = 'Yêu cầu đã bị hủy do cả 2 cuộc hẹn đều bị hủy. Tin đăng đã được mở lại.';

    private const HET_HAN = 'Cuộc hẹn đã hết hạn xác nhận. Vui lòng đặt lịch mới.';

    private const LY_DO_HUY_HET_HAN_CU = 'Mã bàn giao đã hết hạn. Vui lòng đặt lịch mới.';

    public const TIN_DUOC_DAT_LICH = ['dang_mo', 'cho_ban_giao'];

    public const LICH_DANG_HIEU_LUC = ['cho_xac_nhan', 'da_xac_nhan', 'da_hoan_tat'];

    public function taoLichTraDo(string $tinId, array $duLieu, int $nguoiGiuId): array
    {
        return DB::transaction(function () use ($tinId, $duLieu, $nguoiGiuId) {
            $tin = TinDang::where('trang_thai_kiem_duyet', 'hien_thi')->lockForUpdate()->findOrFail($tinId);
            abort_unless($tin->loai_tin === 'bao_mat' && in_array($tin->trang_thai, self::TIN_DUOC_DAT_LICH, true), 409, 'Tin này không thể tạo lịch trả đồ.');
            abort_if((int) $tin->nguoi_dung_id === $nguoiGiuId, 403, 'Bạn không thể tạo lịch trả đồ cho tin của mình.');
            abort_unless(NguoiDung::whereKey($tin->nguoi_dung_id)->where('trang_thai', 'hoat_dong')->exists(), 409, 'Tài khoản người nhận hiện không thể nhận lịch hẹn.');

            $this->capNhatLichHetHan($tin->yeuCauNhanDo()->pluck('id')->all());
            abort_if($tin->yeuCauNhanDo()->where('nguoi_yeu_cau_id', '!=', $nguoiGiuId)
                ->whereHas('cuocHen', fn ($q) => $q->whereIn('trang_thai', self::LICH_DANG_HIEU_LUC))->exists(), 409, 'Tin báo mất đã có lịch trả đồ đang hiệu lực.');
            $tin->yeuCauNhanDo()->where('nguoi_yeu_cau_id', '!=', $nguoiGiuId)
                ->where('trang_thai', 'da_xac_minh')->update(['trang_thai' => 'da_huy']);
            $yeuCau = $tin->yeuCauNhanDo()->firstOrCreate([
                'nguoi_yeu_cau_id' => $nguoiGiuId,
            ], ['trang_thai' => 'da_xac_minh', 'nguoi_xu_ly_id' => $nguoiGiuId, 'thoi_gian_xu_ly' => now()]);
            if ($yeuCau->cuocHen()->count() >= self::SO_LAN_HEN_TOI_DA) {
                return ['message' => 'Yêu cầu đã dùng đủ 2 lần tạo cuộc hẹn.', 'hetLuotHen' => true];
            }
            if ($yeuCau->trang_thai !== 'da_xac_minh') {
                $yeuCau->update(['trang_thai' => 'da_xac_minh', 'nguoi_xu_ly_id' => $nguoiGiuId, 'thoi_gian_xu_ly' => now()]);
            }

            return $this->taoLich([...$duLieu, 'yeuCauId' => $yeuCau->id], $nguoiGiuId);
        }, 3);
    }

    public function taoLich(array $duLieu, int $nguoiTaoId): array
    {
        $gioHen = CarbonImmutable::createFromFormat('!Y-m-d H:i', $duLieu['thoiGianHen'], 'Asia/Ho_Chi_Minh')
            ->setTimezone(config('app.timezone'));
        $yeuCauGoc = YeuCauNhanDo::findOrFail($duLieu['yeuCauId']);

        return DB::transaction(function () use ($yeuCauGoc, $nguoiTaoId, $duLieu, $gioHen) {
            $tin = TinDang::lockForUpdate()->findOrFail($yeuCauGoc->tin_dang_id);
            $yeuCau = YeuCauNhanDo::lockForUpdate()->findOrFail($yeuCauGoc->id);
            $yeuCau->setRelation('tinDang', $tin);
            $nguoiGiuId = $yeuCau->nguoiGiuId();
            $nguoiNhanId = $yeuCau->nguoiNhanId();
            abort_unless(in_array($nguoiTaoId, [$nguoiGiuId, $nguoiNhanId], true), 404);
            abort_unless($yeuCau->trang_thai === 'da_xac_minh' && in_array($tin->trang_thai, self::TIN_DUOC_DAT_LICH, true), 409, 'Yêu cầu hiện không thể đặt lịch.');
            if ($tin->loai_tin === 'bao_mat') {
                abort_unless($tin->trang_thai_kiem_duyet === 'hien_thi', 409, 'Tin này hiện không thể đặt lịch.');
                $this->capNhatLichHetHan($tin->yeuCauNhanDo()->whereKeyNot($yeuCau->id)->pluck('id')->all());
                abort_if($tin->yeuCauNhanDo()->whereKeyNot($yeuCau->id)
                    ->whereHas('cuocHen', fn ($q) => $q->whereIn('trang_thai', self::LICH_DANG_HIEU_LUC))->exists(), 409, 'Tin báo mất đã có lịch trả đồ đang hiệu lực.');
            }
            $nguoiNhapId = $nguoiTaoId === $nguoiGiuId ? $nguoiNhanId : $nguoiGiuId;
            abort_if($nguoiNhapId === $nguoiTaoId || ! NguoiDung::whereKey($nguoiNhapId)->exists(), 409, 'Không xác định được tài khoản của người còn lại.');

            $bayGio = now();
            $lichCu = $yeuCau->cuocHen()->whereIn('trang_thai', self::LICH_DANG_HIEU_LUC)->lockForUpdate()->first();
            if ($lichCu && ! $this->huyLichHetHan($lichCu, $bayGio)) {
                return [
                    'message' => 'Yêu cầu đã có cuộc hẹn.',
                    'daCoLich' => true,
                    'yeuCauId' => $yeuCau->id,
                    'cuocHenId' => $lichCu->id,
                ];
            }

            if ($yeuCau->cuocHen()->count() >= self::SO_LAN_HEN_TOI_DA) {
                $this->huyYeuCauHetLuotHen($yeuCau->id);

                return ['message' => 'Yêu cầu đã dùng đủ 2 lần tạo cuộc hẹn.', 'hetLuotHen' => true];
            }

            abort_if($gioHen->lt($bayGio->copy()->startOfMinute()), 422, 'Vui lòng chọn giờ hẹn từ thời điểm hiện tại trở đi.');
            $diaDiem = DiaDiem::where('trang_thai', true)->sharedLock()->find($duLieu['diaDiemId']);
            abort_unless($diaDiem, 422, 'Vui lòng chọn địa điểm đang hoạt động.');

            $ma = sprintf('%06d', random_int(0, 999999));
            $hen = $yeuCau->cuocHen()->create([
                'nguoi_giu_do_id' => $nguoiGiuId,
                'nguoi_de_xuat_id' => $nguoiTaoId,
                'thoi_gian_hen_gap' => $gioHen,
                'dia_diem_id' => $diaDiem->id,
                'trang_thai' => 'cho_xac_nhan',
            ]);
            $hen->banGiao()->create([
                'ma_ban_giao' => $ma,
            ]);
            if ($tin->trang_thai === 'dang_mo') {
                $tin->update(['trang_thai' => 'cho_ban_giao']);
            }
            $noiDung = 'Cuộc hẹn đã được đặt. Xem giờ và địa điểm gặp trong chi tiết yêu cầu.';
            $this->ghiNhan($yeuCau, $hen, $nguoiTaoId, 'tao_cuoc_hen', null, $noiDung, [$nguoiNhapId], 'Có cuộc hẹn bàn giao');

            return ['ma' => $ma, 'yeuCauId' => $yeuCau->id, 'cuocHenId' => $hen->id, 'gioHen' => $gioHen->toISOString(), 'hetHanLuc' => $hen->hanXacNhan()->toISOString(), 'diaDiem' => $diaDiem->ten_dia_diem];
        }, 3);
    }

    public function xacNhan(int $cuocHenId, string $ma, int $nguoiNhapId): array
    {
        $henGoc = CuocHen::findOrFail($cuocHenId);
        $yeuCauGoc = YeuCauNhanDo::findOrFail($henGoc->yeu_cau_id);

        return DB::transaction(function () use ($yeuCauGoc, $cuocHenId, $ma, $nguoiNhapId) {
            $tin = TinDang::lockForUpdate()->findOrFail($yeuCauGoc->tin_dang_id);
            $yeuCau = YeuCauNhanDo::lockForUpdate()->findOrFail($yeuCauGoc->id);
            $hen = $yeuCau->cuocHen()->lockForUpdate()->findOrFail($cuocHenId);

            $haiBen = [(int) $tin->nguoi_dung_id, (int) $yeuCau->nguoi_yeu_cau_id];
            abort_unless(in_array($nguoiNhapId, $haiBen, true) && in_array((int) $hen->nguoi_de_xuat_id, $haiBen, true)
                && $nguoiNhapId !== (int) $hen->nguoi_de_xuat_id, 422, 'Mã bàn giao không hợp lệ.');
                
            $banGiao = $hen->banGiao()->lockForUpdate()->first();
            abort_unless($banGiao && (string) $banGiao->ma_ban_giao === $ma, 422, 'Mã bàn giao không khớp với cuộc hẹn đã chọn.');

            $ketQua = ['message' => 'Hai bên đã xác nhận bàn giao thành công.', 'yeuCauId' => $yeuCau->id, 'cuocHenId' => $hen->id];
            if ($hen->trang_thai === 'da_hoan_tat' && (int) $hen->nguoi_xac_nhan_id === $nguoiNhapId) {
                return $ketQua;
            }
            $bayGio = now();
            if ($this->huyLichHetHan($hen, $bayGio)
                || ($hen->trang_thai === 'da_huy' && in_array($hen->ly_do_huy, [self::HET_HAN, self::LY_DO_HUY_HET_HAN_CU], true))) {
                return ['message' => self::HET_HAN, 'hetHan' => true];
            }
            abort_unless($yeuCau->trang_thai === 'da_xac_minh' && $tin->trang_thai === 'cho_ban_giao'
                && $hen->trang_thai === 'cho_xac_nhan' && $hen->thoi_gian_hen_gap, 409, 'Cuộc hẹn không còn hiệu lực.');
            $kiemTraGioHen = ! app()->isLocal();
            // $kiemTraGioHen = true; // kiểm tra giờ hẹn o day
            abort_if($kiemTraGioHen && $bayGio->lt($hen->thoi_gian_hen_gap), 409, 'Chưa đến giờ hẹn. Vui lòng nhập mã sau khi giao nhận đồ.');

            $hen->update([
                'trang_thai' => 'da_hoan_tat',
                'nguoi_xac_nhan_id' => $nguoiNhapId,
                'thoi_gian_xac_nhan' => $bayGio,
                'nguoi_giu_xac_nhan_luc' => $bayGio,
                'nguoi_nhan_xac_nhan_luc' => $bayGio,
            ]);
            $banGiao->update(['thoi_gian_ban_giao' => $bayGio]);
            $tin->update(['trang_thai' => 'da_hoan_tat']);
            $this->hoanTatTinBaoMat($tin, $yeuCau);
            YeuCauNhanDo::where('tin_dang_id', $tin->id)->whereIn('trang_thai', ['cho_kiem_tra', 'can_bo_sung'])->update(['trang_thai' => 'da_huy']);
            $this->ghiNhan($yeuCau, $hen, $nguoiNhapId, 'xac_nhan_ban_giao', 'cho_xac_nhan', $ketQua['message'], $haiBen, 'Bàn giao đồ thành công');

            return $ketQua;
        }, 3);
    }

    private function hoanTatTinBaoMat(TinDang $tin, YeuCauNhanDo $yeuCau): void
    {
        if ($tin->tin_bao_mat_lien_quan_id === null) {
            return;
        }

        $tinBaoMat = $tin->tinBaoMatLienQuan()->where('loai_tin', 'bao_mat')
            ->where('nguoi_dung_id', $yeuCau->nguoi_yeu_cau_id)->lockForUpdate()->first();

        if ($tinBaoMat?->trang_thai === 'dang_mo') {
            $tinBaoMat->update(['trang_thai' => 'da_hoan_tat']);
        }
    }

    public function capNhatLichHetHan(array $yeuCauIds): void
    {
        $bayGio = now();
        $lichHetHan = CuocHen::whereIn('yeu_cau_id', $yeuCauIds)->where('trang_thai', 'cho_xac_nhan')
            ->where('thoi_gian_hen_gap', '<=', $bayGio->copy()->subHours(CuocHen::SO_GIO_XAC_NHAN))
            ->pluck('id');
        foreach ($lichHetHan as $id) {
            DB::transaction(function () use ($id, $bayGio) {
                $goc = CuocHen::findOrFail($id);
                $yeuCau = YeuCauNhanDo::findOrFail($goc->yeu_cau_id);
                TinDang::withTrashed()->lockForUpdate()->findOrFail($yeuCau->tin_dang_id);
                YeuCauNhanDo::lockForUpdate()->findOrFail($yeuCau->id);
                $hen = CuocHen::lockForUpdate()->findOrFail($id);
                $this->huyLichHetHan($hen, $bayGio);
            }, 3);
        }
        foreach ($yeuCauIds as $id) {
            $this->huyYeuCauHetLuotHen((int) $id);
        }
    }

    public function huyYeuCauHetLuotHen(int $yeuCauId): void
    {
        DB::transaction(function () use ($yeuCauId) {
            $goc = YeuCauNhanDo::find($yeuCauId);
            if (! $goc) {
                return;
            }
            $tin = TinDang::withTrashed()->lockForUpdate()->findOrFail($goc->tin_dang_id);
            $yc = YeuCauNhanDo::lockForUpdate()->findOrFail($yeuCauId);
            if ($yc->trang_thai !== 'da_xac_minh') {
                return;
            }
            $lich = $yc->cuocHen()->lockForUpdate()->get();
            if ($lich->count() < self::SO_LAN_HEN_TOI_DA || $lich->contains(fn ($h) => $h->trang_thai !== 'da_huy')) {
                return;
            }

            $yc->update(['trang_thai' => 'da_huy', 'ghi_chu_admin' => self::HET_LUOT_HEN, 'thoi_gian_xu_ly' => now()]);
            if ($tin->trang_thai === 'cho_ban_giao' && ! $tin->yeuCauNhanDo()->whereKeyNot($yc->id)
                ->whereHas('cuocHen', fn ($q) => $q->whereIn('trang_thai', self::LICH_DANG_HIEU_LUC))->exists()) {
                $tin->update(['trang_thai' => 'dang_mo']);
            }
            $yc->lichSu()->create(['hanh_dong' => 'huy_yeu_cau_het_luot_hen', 'trang_thai_cu' => 'da_xac_minh', 'trang_thai_moi' => 'da_huy', 'noi_dung' => self::HET_LUOT_HEN]);
            foreach (array_unique([$yc->nguoi_yeu_cau_id, $tin->nguoi_dung_id]) as $id) {
                $yc->thongBao()->create(['nguoi_dung_id' => $id, 'tin_dang_id' => $tin->id, 'loai_thong_bao' => 'huy_yeu_cau_het_luot_hen', 'tieu_de' => 'Yêu cầu nhận đồ đã bị hủy', 'noi_dung' => self::HET_LUOT_HEN]);
            }
        }, 3);
    }

    private function huyLichHetHan(CuocHen $hen, CarbonInterface $bayGio): bool
    {
        if ($hen->trang_thai !== 'cho_xac_nhan' || ! $hen->hanXacNhan()?->lte($bayGio)) {
            return false;
        }

        $hen->update(['trang_thai' => 'da_huy', 'ly_do_huy' => self::HET_HAN]);

        return true;
    }

    private function ghiNhan(YeuCauNhanDo $yeuCau, CuocHen $hen, int $nguoiThucHien, string $hanhDong, ?string $trangThaiCu, string $noiDung, array $nguoiNhan, string $tieuDe): void
    {
        $yeuCau->lichSu()->create([
            'cuoc_hen_id' => $hen->id, 'nguoi_thuc_hien_id' => $nguoiThucHien,
            'hanh_dong' => $hanhDong, 'trang_thai_cu' => $trangThaiCu, 'trang_thai_moi' => $hen->trang_thai, 'noi_dung' => $noiDung,
        ]);
        foreach ($nguoiNhan as $id) {
            $hen->thongBao()->create([
                'nguoi_dung_id' => $id, 'tin_dang_id' => $yeuCau->tin_dang_id, 'yeu_cau_id' => $yeuCau->id,
                'loai_thong_bao' => $hanhDong, 'tieu_de' => $tieuDe, 'noi_dung' => $noiDung,
            ]);
        }
    }
}
