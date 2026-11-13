<?php

namespace App\Services;

use App\Models\BanGiao;
use App\Models\CuocHen;
use App\Models\DiaDiem;
use App\Models\NguoiDung;
use App\Models\TinDang;
use App\Models\YeuCauNhanDo;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;

class XuLyCuocHen
{
    private const HET_HAN = 'Mã bàn giao đã hết hạn. Vui lòng đặt lịch mới.';

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

        for ($lan = 0; $lan < 5; $lan++) {
            try {
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
                    if ($lichCu && ! $this->huyLichHetHan($lichCu, $lichCu->banGiao()->lockForUpdate()->first(), $bayGio)) {
                        return [
                            'message' => 'Yêu cầu đã có cuộc hẹn.',
                            'daCoLich' => true,
                            'yeuCauId' => $yeuCau->id,
                            'cuocHenId' => $lichCu->id,
                        ];
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
                    $hetHan = $gioHen->addHours(24);
                    $hen->banGiao()->create([
                        'ma_ban_giao_hash' => $this->bamMa($nguoiNhapId, $ma),
                        'ma_het_han_luc' => $hetHan,
                    ]);
                    if ($tin->trang_thai === 'dang_mo') {
                        $tin->update(['trang_thai' => 'cho_ban_giao']);
                    }
                    $noiDung = 'Cuộc hẹn đã được đặt. Xem giờ và địa điểm gặp trong chi tiết yêu cầu.';
                    $this->ghiNhan($yeuCau, $hen, $nguoiTaoId, 'tao_cuoc_hen', null, $noiDung, [$nguoiNhapId], 'Có cuộc hẹn bàn giao');

                    return ['ma' => $ma, 'yeuCauId' => $yeuCau->id, 'cuocHenId' => $hen->id, 'gioHen' => $gioHen->toISOString(), 'hetHanLuc' => $hetHan->toISOString(), 'diaDiem' => $diaDiem->ten_dia_diem];
                }, 3);
            } catch (UniqueConstraintViolationException $exception) {
                if (! str_contains($exception->errorInfo[2] ?? '', 'ma_ban_giao_hash')) {
                    throw $exception;
                }
            }
        }

        abort(503, 'Chưa thể tạo mã bàn giao. Vui lòng thử lại.');
    }

    public function xacNhan(string $ma, int $nguoiNhapId): array
    {
        $maHash = $this->bamMa($nguoiNhapId, $ma);
        $banGiaoGoc = BanGiao::where('ma_ban_giao_hash', $maHash)->first();
        abort_unless($banGiaoGoc, 422, 'Mã bàn giao không hợp lệ.');
        $henGoc = CuocHen::findOrFail($banGiaoGoc->cuoc_hen_id);
        $yeuCauGoc = YeuCauNhanDo::findOrFail($henGoc->yeu_cau_id);

        return DB::transaction(function () use ($yeuCauGoc, $henGoc, $banGiaoGoc, $maHash, $nguoiNhapId) {
            $tin = TinDang::lockForUpdate()->findOrFail($yeuCauGoc->tin_dang_id);
            $yeuCau = YeuCauNhanDo::lockForUpdate()->findOrFail($yeuCauGoc->id);
            $hen = CuocHen::lockForUpdate()->findOrFail($henGoc->id);
            $banGiao = BanGiao::lockForUpdate()->findOrFail($banGiaoGoc->id);
            abort_unless(hash_equals($maHash, (string) $banGiao->ma_ban_giao_hash), 422, 'Mã bàn giao không hợp lệ.');
            $haiBen = [(int) $tin->nguoi_dung_id, (int) $yeuCau->nguoi_yeu_cau_id];
            abort_unless(in_array($nguoiNhapId, $haiBen, true) && in_array((int) $hen->nguoi_de_xuat_id, $haiBen, true)
                && $nguoiNhapId !== (int) $hen->nguoi_de_xuat_id, 422, 'Mã bàn giao không hợp lệ.');
            $ketQua = ['message' => 'Hai bên đã xác nhận bàn giao thành công.', 'yeuCauId' => $yeuCau->id, 'cuocHenId' => $hen->id];
            if ($hen->trang_thai === 'da_hoan_tat' && (int) $hen->nguoi_xac_nhan_id === $nguoiNhapId) {
                return $ketQua;
            }
            $bayGio = now();
            if ($this->huyLichHetHan($hen, $banGiao, $bayGio) || ($hen->trang_thai === 'da_huy' && $hen->ly_do_huy === self::HET_HAN)) {
                return ['message' => self::HET_HAN, 'hetHan' => true];
            }
            abort_unless($yeuCau->trang_thai === 'da_xac_minh' && $tin->trang_thai === 'cho_ban_giao'
                && $hen->trang_thai === 'cho_xac_nhan' && $banGiao->ma_het_han_luc, 409, 'Cuộc hẹn không còn hiệu lực.');
            abort_if($bayGio->lt($hen->thoi_gian_hen_gap), 409, 'Chưa đến giờ hẹn. Vui lòng nhập mã sau khi giao nhận đồ.');

            $hen->update([
                'trang_thai' => 'da_hoan_tat',
                'nguoi_xac_nhan_id' => $nguoiNhapId,
                'thoi_gian_xac_nhan' => $bayGio,
                'nguoi_giu_xac_nhan_luc' => $bayGio,
                'nguoi_nhan_xac_nhan_luc' => $bayGio,
            ]);
            $banGiao->update([
                'thoi_gian_ban_giao' => $bayGio,
                'ma_het_han_luc' => null,
            ]);
            $tin->update(['trang_thai' => 'da_hoan_tat']);
            $this->hoanTatTinBaoMat($tin, $yeuCau);
            YeuCauNhanDo::where('tin_dang_id', $tin->id)->whereIn('trang_thai', ['cho_kiem_tra', 'can_bo_sung'])->update(['trang_thai' => 'da_huy']);
            $this->ghiNhan($yeuCau, $hen, $nguoiNhapId, 'xac_nhan_ban_giao', 'cho_xac_nhan', $ketQua['message'], $haiBen, 'Bàn giao đồ thành công');

            return $ketQua;
        }, 3);
    }

    private function hoanTatTinBaoMat(TinDang $tin, YeuCauNhanDo $yeuCau): void
    {
        if ($tin->loai_tin === 'bao_mat') {
            return;
        }
        $truyVan = $tin->tin_bao_mat_lien_quan_id ? $tin->tinBaoMatLienQuan() : $tin->tinBaoMatDaThongBao();
        $tinBaoMat = $truyVan->withTrashed()->where('loai_tin', 'bao_mat')
            ->where('nguoi_dung_id', $yeuCau->nguoi_yeu_cau_id)->limit(2)->lockForUpdate()->get();

        if ($tinBaoMat->count() === 1 && ! $tinBaoMat[0]->trashed() && $tinBaoMat[0]->trang_thai === 'dang_mo') {
            $tinBaoMat[0]->update(['trang_thai' => 'da_hoan_tat']);
            $tin->tinBaoMatLienQuan()->associate($tinBaoMat[0]);
            $tin->save();
        }
    }

    public function capNhatLichHetHan(array $yeuCauIds): void
    {
        $bayGio = now();
        $lichHetHan = CuocHen::whereIn('yeu_cau_id', $yeuCauIds)->where('trang_thai', 'cho_xac_nhan')
            ->whereHas('banGiao', fn ($q) => $q->whereNotNull('ma_ban_giao_hash')->where('ma_het_han_luc', '<=', $bayGio))
            ->pluck('id');
        foreach ($lichHetHan as $id) {
            DB::transaction(function () use ($id, $bayGio) {
                $hen = CuocHen::lockForUpdate()->findOrFail($id);
                $this->huyLichHetHan($hen, $hen->banGiao()->lockForUpdate()->first(), $bayGio);
            }, 3);
        }
    }

    private function huyLichHetHan(CuocHen $hen, ?BanGiao $banGiao, CarbonInterface $bayGio): bool
    {
        if ($hen->trang_thai !== 'cho_xac_nhan' || ! $banGiao?->ma_ban_giao_hash || ! $banGiao->ma_het_han_luc?->lte($bayGio)) {
            return false;
        }

        $hen->update(['trang_thai' => 'da_huy', 'ly_do_huy' => self::HET_HAN]);
        $banGiao->update(['ma_het_han_luc' => null]);

        return true;
    }

    private function bamMa(int $nguoiNhapId, string $ma): string
    {
        return hash_hmac('sha256', "ban-giao:{$nguoiNhapId}:{$ma}", config('app.key'));
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
