<?php

namespace App\Http\Controllers;

use App\Models\TinDang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class QuanLyTinDangController extends Controller
{
    public function danhSach()
    {
        return response()->json(['data' => TinDang::with($this->quanHe())->latest('id')->get()->map(fn ($tin) => $this->duLieu($tin))]);
    }

    public function chiTiet(TinDang $tin)
    {
        return response()->json(['data' => $this->duLieu($tin->load($this->quanHe()))]);
    }

    public function xuLy(Request $request, TinDang $tin)
    {
        $data = $request->validate([
            'hanh_dong' => ['required', Rule::in(['an_tin', 'khoi_phuc', 'chap_nhan_bao_cao', 'tu_choi_bao_cao'])],
            'ly_do' => ['required_unless:hanh_dong,khoi_phuc', 'nullable', 'string', 'min:5', 'max:2000'],
            'bao_cao_id' => ['nullable', 'integer', 'min:1'],
        ]);
        $lyDo = $data['hanh_dong'] === 'khoi_phuc'
            ? 'Khôi phục tin theo xác nhận của quản trị viên.'
            : trim($data['ly_do']);
        abort_if(mb_strlen($lyDo) < 5, 422, 'Lý do phải có ít nhất 5 ký tự có nội dung.');
        DB::transaction(function () use ($request, $tin, $data, $lyDo) {
            $banGhi = TinDang::whereKey($tin->id)->lockForUpdate()->firstOrFail();
            $cu = $banGhi->trang_thai_kiem_duyet;
            $hanhDong = $data['hanh_dong'];
            $duLieuCu = ['trang_thai_kiem_duyet' => $cu, 'ly_do_an' => $banGhi->ly_do_an];
            if (in_array($hanhDong, ['an_tin', 'khoi_phuc'], true)) {
                $moi = $hanhDong === 'an_tin' ? 'da_an' : 'hien_thi';
                abort_if($cu === $moi, 409, 'Tin đã ở trạng thái này. Vui lòng tải lại.');
                $banGhi->update(['trang_thai_kiem_duyet' => $moi, 'ly_do_an' => $moi === 'da_an' ? $lyDo : null]);
                $duLieuMoi = ['trang_thai_kiem_duyet' => $moi, 'ly_do_an' => $banGhi->ly_do_an];
            } else {
                abort_unless(! empty($data['bao_cao_id']), 422, 'Cần chọn báo cáo để xử lý.');
                $baoCao = $banGhi->baoCao()->whereKey($data['bao_cao_id'])->lockForUpdate()->firstOrFail();
                abort_unless($baoCao->trang_thai === 'cho_xu_ly', 409, 'Báo cáo đã được xử lý.');
                $duLieuCu = ['bao_cao_id' => $baoCao->id, 'trang_thai' => $baoCao->trang_thai];
                $baoCao->update(['trang_thai' => $hanhDong === 'chap_nhan_bao_cao' ? 'chap_nhan' : 'tu_choi', 'nguoi_xu_ly_id' => $request->user()->id, 'ghi_chu_admin' => $lyDo, 'thoi_gian_xu_ly' => now()]);
                $duLieuMoi = ['bao_cao_id' => $baoCao->id, 'trang_thai' => $baoCao->trang_thai];
            }
            $banGhi->lichSu()->create([
                'nguoi_thuc_hien_id' => $request->user()->id, 'hanh_dong' => $hanhDong,
                'trang_thai_cu' => $cu, 'trang_thai_moi' => $banGhi->trang_thai_kiem_duyet,
                'noi_dung' => $lyDo, 'du_lieu_cu' => $duLieuCu, 'du_lieu_moi' => $duLieuMoi,
            ]);
        });
        return response()->json(['data' => $this->duLieu($tin->fresh()->load($this->quanHe()))]);
    }

    private function quanHe(): array
    {
        return ['nguoiDung', 'danhMuc', 'diaDiem', 'hinhAnh' => fn ($q) => $q->where('pham_vi', 'cong_khai')->orderBy('thu_tu'), 'baoCao.nguoiBaoCao', 'lichSu' => fn ($q) => $q->orderByDesc('id'), 'lichSu.nguoiThucHien'];
    }

    private function duLieu(TinDang $tin): array
    {
        $nhan = ['an_tin' => 'Ẩn tin', 'khoi_phuc' => 'Khôi phục tin', 'chap_nhan_bao_cao' => 'Xác nhận vi phạm', 'tu_choi_bao_cao' => 'Bác bỏ báo cáo'];
        return [
            'id' => $tin->id, 'title' => $tin->tieu_de, 'fullName' => $tin->tieu_de, 'description' => $tin->mo_ta,
            'referenceCode' => 'TIN-'.str_pad((string) $tin->id, 6, '0', STR_PAD_LEFT),
            'type' => $tin->loai_tin === 'bao_mat' ? 'lost' : 'found', 'typeName' => $tin->loai_tin === 'bao_mat' ? 'Mất đồ' : 'Nhặt được',
            'date' => $tin->created_at?->format('Y-m-d'), 'category' => $tin->danhMuc?->ten_danh_muc ?? 'Chưa phân loại',
            'location' => $tin->diaDiem?->ten_dia_diem ?? 'Chưa rõ', 'imageUrl' => $tin->hinhAnh->first()?->duong_dan ?? '/do-vat-trong.svg',
            'nguoiDang' => $tin->nguoiDung?->ho_ten ?? 'Tài khoản không còn hoạt động', 'maSinhVien' => $tin->nguoiDung?->ma_so ?? '—',
            'trangThai' => $tin->trang_thai_kiem_duyet, 'lyDoAn' => $tin->ly_do_an,
            'baoCao' => $tin->baoCao->map(fn ($bc) => ['id' => $bc->id, 'nguoiBaoCao' => $bc->nguoiBaoCao?->ho_ten ?? 'Không xác định', 'lyDo' => $bc->ly_do, 'moTa' => $bc->mo_ta, 'thoiGian' => $bc->created_at?->format('d/m/Y H:i'), 'trangThai' => $bc->trang_thai, 'ketQua' => $bc->ghi_chu_admin]),
            'lichSu' => $tin->lichSu->map(fn ($ls) => ['hanhDong' => $nhan[$ls->hanh_dong] ?? $ls->hanh_dong, 'lyDo' => $ls->noi_dung, 'thoiGian' => $ls->created_at?->format('d/m/Y H:i'), 'nguoiThucHien' => $ls->nguoiThucHien?->ho_ten ?? 'Không xác định']),
        ];
    }
}
