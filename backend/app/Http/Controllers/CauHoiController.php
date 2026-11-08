<?php

namespace App\Http\Controllers;

use App\Models\CauHoi;
use App\Models\DanhMucDoVat;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CauHoiController extends Controller
{
    public function danhSach(): JsonResponse
    {
        return response()->json(['data' => CauHoi::whereNotNull('danh_muc_id')->with('lichSu')->withExists('loiKhaiTinDang')->orderBy('id')->get()->map(fn ($cau) => $this->duLieu($cau))]);
    }

    public function them(Request $request): JsonResponse
    {
        return $this->luu($request);
    }

    public function sua(Request $request, string $id): JsonResponse
    {
        return $this->luu($request, $id);
    }

    private function luu(Request $request, ?string $id = null): JsonResponse
    {
        $mau = $this->kiemTraDuLieu($request);
        $phienBan = $id === null ? null : $request->validate(['phienBan' => ['required', 'integer', 'min:1']])['phienBan'];

        return DB::transaction(function () use ($mau, $id, $phienBan) {
            $danhMuc = DanhMucDoVat::orderBy('id')->lockForUpdate()->get();
            $danhSach = CauHoi::whereNotNull('danh_muc_id')->orderBy('id')->lockForUpdate()->get();
            $cu = $id === null ? null : $danhSach->firstWhere('id', $id);
            abort_if($id !== null && ! $cu, 404, 'Không tìm thấy câu hỏi.');
            if ($cu) {
                $this->kiemTraBanMoiNhat($cu, (int) $phienBan);
                abort_if($cu->trang_thai !== $mau['dangHoatDong'], 409, 'Trạng thái câu hỏi đã thay đổi. Vui lòng tải lại.');
            }
            $this->kiemTraPhamVi($mau, $danhMuc, $cu);
            $this->kiemTraTrung($mau, $danhSach->reject(fn ($cau) => $cau->id === $cu?->id)->map(fn ($cau) => ['nhanDangTin' => $cau->noi_dung, 'kieuNhap' => $cau->kieu_nhap, 'danhMucId' => $cau->danh_muc_id]));
            $cot = $this->cacCot($mau);
            if ($cu && collect($cot)->every(fn ($giaTri, $tenCot) => $giaTri == $cu->$tenCot)) {
                return response()->json(['data' => $this->duLieu($cu), 'daThayDoi' => false]);
            }
            if ($cu) {
                $cu->update($cot);
                $cau = $cu;
            } else {
                $cau = CauHoi::create([...$cot, 'trang_thai' => true]);
            }
            $cau->lichSu()->create(['phien_ban' => $cu ? (int) $phienBan + 1 : 1, 'du_lieu' => $cau->attributesToArray()]);

            return response()->json(['data' => $this->duLieu($cau), 'daThayDoi' => true], $cu ? 200 : 201);
        }, 3);
    }

    public function doiTrangThai(Request $request, string $id): JsonResponse
    {
        $mau = $request->validate(['dangHoatDong' => ['required', 'boolean'], 'trangThaiHienTai' => ['required', 'boolean'], 'phienBan' => ['required', 'integer', 'min:1']]);

        return DB::transaction(function () use ($id, $mau) {
            $danhMuc = DanhMucDoVat::orderBy('id')->lockForUpdate()->get();
            $cau = CauHoi::whereNotNull('danh_muc_id')->lockForUpdate()->findOrFail($id);
            $this->kiemTraBanMoiNhat($cau, (int) $mau['phienBan']);
            if ($mau['dangHoatDong']) {
                abort_unless($danhMuc->firstWhere('id', $cau->danh_muc_id)?->trang_thai, 409, 'Mở lại danh mục trước khi mở câu hỏi.');
            }
            if ($cau->trang_thai !== (bool) $mau['dangHoatDong']) {
                abort_if($cau->trang_thai !== (bool) $mau['trangThaiHienTai'], 409, 'Trạng thái câu hỏi đã thay đổi. Vui lòng tải lại.');
                $cau->update(['trang_thai' => (bool) $mau['dangHoatDong']]);
            }

            return response()->json(['data' => $this->duLieu($cau)]);
        }, 3);
    }

    public function xoa(Request $request, string $id): JsonResponse
    {
        $phienBan = $request->validate(['phienBan' => ['required', 'integer', 'min:1']])['phienBan'];
        try {
            return DB::transaction(function () use ($id, $phienBan) {
                $cau = CauHoi::whereNotNull('danh_muc_id')->lockForUpdate()->findOrFail($id);
                $this->kiemTraBanMoiNhat($cau, (int) $phienBan);
                abort_if((int) $phienBan > 1 || $cau->loiKhaiTinDang()->exists(), 409, 'Câu hỏi có lịch sử hoặc đã có câu trả lời. Hãy dùng Ẩn để giữ dữ liệu.');
                $cau->lichSu()->delete();
                $cau->delete();

                return response()->json(['message' => 'Đã xóa câu hỏi.']);
            }, 3);
        } catch (QueryException $loi) {
            if (in_array((int) ($loi->errorInfo[1] ?? 0), [1451, 787], true)) {
                abort(409, 'Câu hỏi đã được sử dụng. Hãy dùng Ẩn để giữ dữ liệu.');
            }
            throw $loi;
        }
    }

    private function kiemTraBanMoiNhat(CauHoi $cau, int $phienBan): void
    {
        abort_if((int) $cau->lichSu()->max('phien_ban') !== $phienBan, 409, 'Câu hỏi đã thay đổi. Vui lòng tải lại danh sách.');
    }

    private function kiemTraTrung(array $mau, Collection $danhSach): void
    {
        if ($danhSach->contains(fn ($cu) => (string) $cu['danhMucId'] === (string) $mau['danhMucId'] && $this->chuanHoaTen($cu['nhanDangTin']) === $this->chuanHoaTen($mau['nhanDangTin']))) {
            throw ValidationException::withMessages(['nhanDangTin' => 'Câu hỏi đã tồn tại trong danh mục này, kể cả câu hỏi ngừng sử dụng.']);
        }
    }

    private function kiemTraPhamVi(array $mau, Collection $danhMuc, ?CauHoi $cu): void
    {
        $muc = $danhMuc->firstWhere('id', $mau['danhMucId']);
        if (! $muc || (! $muc->trang_thai && (string) $cu?->danh_muc_id !== (string) $mau['danhMucId'])) {
            throw ValidationException::withMessages(['danhMucId' => 'Vui lòng chọn danh mục đang hoạt động.']);
        }
    }

    private function kiemTraDuLieu(Request $request): array
    {
        $quyTac = [
            'danhMucId' => ['required', 'integer', 'min:1'],
            'nhanDangTin' => ['required', 'string', 'max:250'],
            'kieuNhap' => ['required', 'in:van_ban,so'],
            'thuTu' => ['required', 'integer', 'min:1', 'max:999'],
            'dangHoatDong' => ['required', 'boolean'],
        ];
        $mau = $request->validate($quyTac);
        $mau['nhanDangTin'] = trim($mau['nhanDangTin']);
        $mau['dangHoatDong'] = (bool) $mau['dangHoatDong'];
        if ($mau['nhanDangTin'] === '') {
            throw ValidationException::withMessages(['nhanDangTin' => 'Vui lòng nhập nội dung câu hỏi.']);
        }

        return $mau;
    }

    private function chuanHoaTen(string $ten): string
    {
        return Str::lower(Str::ascii(Str::squish($ten)));
    }

    private function cacCot(array $mau): array
    {
        return ['danh_muc_id' => $mau['danhMucId'], 'noi_dung' => $mau['nhanDangTin'], 'kieu_nhap' => $mau['kieuNhap'], 'thu_tu' => (int) $mau['thuTu']];
    }

    private function duLieu(CauHoi $cau): array
    {
        $cau->loadMissing('lichSu');
        $lichSu = $cau->lichSu->map(fn ($ban) => [
            'id' => (string) $ban->id, 'phienBan' => $ban->phien_ban,
            'danhMucId' => $ban->du_lieu['danh_muc_id'] === null ? null : (string) $ban->du_lieu['danh_muc_id'],
            'nhanDangTin' => $ban->du_lieu['noi_dung'], 'kieuNhap' => $ban->du_lieu['kieu_nhap'] ?? 'van_ban',
            'thuTu' => (int) $ban->du_lieu['thu_tu'], 'dangHoatDong' => (bool) $ban->du_lieu['trang_thai'],
        ]);

        return [
            'id' => (string) $cau->id, 'phienBan' => (int) $cau->lichSu->max('phien_ban'),
            'danhMucId' => (string) $cau->danh_muc_id,
            'nhanDangTin' => $cau->noi_dung, 'kieuNhap' => $cau->kieu_nhap,
            'thuTu' => $cau->thu_tu, 'dangHoatDong' => $cau->trang_thai, 'lichSu' => $lichSu,
            'coCauTraLoi' => (bool) ($cau->loi_khai_tin_dang_exists ?? $cau->loiKhaiTinDang()->exists()),
        ];
    }
}
