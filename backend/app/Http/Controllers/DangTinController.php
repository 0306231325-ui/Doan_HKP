<?php

namespace App\Http\Controllers;

use App\Models\CauHoi;
use App\Models\DanhMucDoVat;
use App\Models\DiaDiem;
use App\Models\HinhAnhTinDang;
use App\Models\TinDang;
use App\Services\CauTraLoiTinDang;
use App\Services\DuLieuTinDang;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use LogicException;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class DangTinController extends Controller
{
    public function tinCuaToi(Request $request, DuLieuTinDang $duLieu): JsonResponse
    {
        $mau = $request->validate([
            'trang' => ['nullable', 'integer', 'min:1', 'max:1000000'],
            'tuKhoa' => ['nullable', 'string', 'max:200'],
        ]);
        $id = $request->user()->id;
        $truyVan = TinDang::where('nguoi_dung_id', $id)->latest()->orderByDesc('id');
        $duLieu->locTuKhoa($truyVan, trim($mau['tuKhoa'] ?? ''));

        return response()->json($duLieu->phanTrang($truyVan, (int) ($mau['trang'] ?? 1), (string) $id))
            ->header('Cache-Control', 'private, no-store');
    }

    public function bieuMau(Request $request, CauTraLoiTinDang $traLoi): JsonResponse
    {
        $mau = $request->validate(['danhMucId' => ['required', 'integer', Rule::exists('danh_muc_do_vat', 'id')->where('trang_thai', true)]]);
        $cacCau = CauHoi::with('lichSu')->where('trang_thai', true)
            ->where('danh_muc_id', $mau['danhMucId'])
            ->orderBy('thu_tu')->orderBy('id')->get();

        return response()->json(['data' => $cacCau->map(function ($cau) use ($traLoi) {
            $ban = $cau->lichSu->sortByDesc('phien_ban')->first();
            abort_unless($ban, 409, 'Câu hỏi chưa có phiên bản. Vui lòng liên hệ quản trị.');

            return $traLoi->cauHoi($ban, (string) $cau->id);
        })])->header('Cache-Control', 'no-store');
    }

    public function them(Request $request, CauTraLoiTinDang $traLoi): JsonResponse
    {
        if (is_string($request->input('cauTraLoi'))) {
            $request->merge(['cauTraLoi' => json_decode($request->input('cauTraLoi'), true)]);
        }
        $mau = $request->validate([
            'maGui' => ['required', 'uuid'], 'loaiTin' => ['required', 'in:lost,found'],
            'danhMucId' => ['required', 'integer', 'min:1'],
            ...$this->quyTacNoiDung(),
            'soDienThoai' => ['nullable', 'required_without:email', 'string', 'max:20', 'regex:/^\+?[0-9 ]{9,20}$/'],
            'email' => ['nullable', 'required_without:soDienThoai', 'email:rfc', 'max:254'],
            'cauTraLoi' => ['required', 'array', 'max:500'],
            'cauTraLoi.*' => ['required', 'array:id,phienBanId,giaTri'],
            'cauTraLoi.*.id' => ['required', 'integer', 'distinct', 'min:1'],
            'cauTraLoi.*.phienBanId' => ['required', 'integer', 'min:1'],
            'cauTraLoi.*.giaTri' => ['present', 'nullable'],
            'anh' => ['nullable', 'array', 'max:3'],
            'anh.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120', 'dimensions:max_width=8192,max_height=8192'],
        ], [
            'required' => 'Vui lòng điền :attribute.', 'required_without' => 'Nhập ít nhất số điện thoại hoặc email liên hệ.',
            'ngayXayRa.before_or_equal' => 'Ngày xảy ra không được ở tương lai.',
            'soDienThoai.regex' => 'Số điện thoại không hợp lệ.', 'email.email' => 'Email không đúng định dạng.',
            'anh.max' => 'Mỗi tin tối đa 3 ảnh.', 'anh.*.max' => 'Mỗi ảnh tối đa 5 MB.',
            'anh.*.image' => 'Tệp tải lên phải là hình ảnh.', 'anh.*.mimes' => 'Chỉ nhận ảnh JPG, PNG hoặc WebP.',
        ], ['tieuDe' => 'tiêu đề', 'diaDiemChiTiet' => 'vị trí cụ thể', 'ngayXayRa' => 'ngày xảy ra', 'danhMucId' => 'danh mục']);
        $tepDaLuu = [];
        try {
            return DB::transaction(function () use ($request, $mau, $traLoi, &$tepDaLuu) {
                $danhMuc = DanhMucDoVat::orderBy('id')->lockForUpdate()->get();
                $cacCau = CauHoi::where('danh_muc_id', $mau['danhMucId'])->where('trang_thai', true)->orderBy('id')->lockForUpdate()->get();
                $request->user()->newQuery()->whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
                $cu = TinDang::withTrashed()->where('ma_gui', $mau['maGui'])->first();
                if ($cu) {
                    abort_unless($cu->nguoi_dung_id === $request->user()->id && ! $cu->trashed(), 409, 'Lần gửi này đã được sử dụng.');

                    return response()->json(['data' => ['id' => $cu->id], 'message' => 'Tin đã được đăng.']);
                }
                abort_unless($danhMuc->firstWhere('id', $mau['danhMucId'])?->trang_thai, 409, 'Danh mục đã ngừng sử dụng. Vui lòng chọn lại.');
                if (! empty($mau['diaDiemId'])) {
                    abort_unless(DiaDiem::whereKey($mau['diaDiemId'])->where('trang_thai', true)->lockForUpdate()->exists(), 422, 'Địa điểm không còn được sử dụng.');
                }
                abort_unless($cacCau->isNotEmpty(), 422, 'Danh mục chưa có câu hỏi nhận diện. Vui lòng chọn danh mục khác.');
                $dapAn = collect($mau['cauTraLoi'])->keyBy('id');
                abort_unless($cacCau->count() === $dapAn->count() && $cacCau->every(fn ($cau) => $dapAn->has($cau->id)), 409, 'Bộ câu hỏi đã thay đổi. Hãy tải lại câu hỏi và kiểm tra câu trả lời.');
                $loiKhai = [];
                foreach ($cacCau as $cau) {
                    $ban = $cau->lichSu()->reorder('phien_ban', 'desc')->first();
                    abort_unless($ban && (string) $ban->id === (string) $dapAn[$cau->id]['phienBanId'], 409, 'Câu hỏi đã thay đổi. Hãy tải lại câu hỏi và kiểm tra câu trả lời.');
                    $cot = $traLoi->giaTri($traLoi->cauHoi($ban, (string) $cau->id), $dapAn[$cau->id]['giaTri'], 'cauTraLoi.'.$cau->id);
                    $loiKhai[] = ['cau_hoi_id' => $cau->id, 'cau_hoi_phien_ban_id' => $ban->id, ...$cot];
                }
                $tin = TinDang::create([
                    'nguoi_dung_id' => $request->user()->id, 'danh_muc_id' => $mau['danhMucId'],
                    ...$this->cotNoiDung($mau),
                    'loai_tin' => $mau['loaiTin'] === 'found' ? 'nhat_duoc' : 'bao_mat',
                    'slug' => Str::slug($mau['tieuDe']).'-'.Str::uuid(),
                    'thong_tin_lien_he' => $mau['soDienThoai'] ?? null,
                    'email_lien_he' => $mau['email'] ?? null, 'ma_gui' => $mau['maGui'],
                    'trang_thai' => 'dang_mo', 'trang_thai_kiem_duyet' => 'hien_thi',
                ]);
                $tin->loiKhai()->createMany($loiKhai);
                foreach (array_values($request->file('anh', [])) as $thuTu => $tep) {
                    $tenAnh = $tin->maTin().'-'.($thuTu + 1).'.'.$tep->guessExtension();
                    $duongDan = $tep->storeAs($tin->thuMucAnh(), $tenAnh, 'anh-tin-dang');
                    if (! $duongDan) {
                        throw new LogicException('Không lưu được ảnh. Vui lòng thử lại.');
                    }
                    $tepDaLuu[] = $duongDan;
                    $tin->hinhAnh()->create(['nguoi_tai_len_id' => $request->user()->id, 'duong_dan' => '/api/tin-dang/anh/'.$tenAnh, 'pham_vi' => 'cong_khai', 'thu_tu' => $thuTu]);
                }
                $tin->lichSu()->create(['nguoi_thuc_hien_id' => $request->user()->id, 'hanh_dong' => 'tao_tin', 'trang_thai_moi' => 'hien_thi', 'noi_dung' => 'Đã đăng tin.']);

                return response()->json(['data' => ['id' => $tin->id], 'message' => 'Đăng tin thành công.'], 201);
            });
        } catch (Throwable $loi) {
            Storage::disk('anh-tin-dang')->delete($tepDaLuu);
            throw $loi;
        }
    }

    public function duLieuSua(Request $request, string $tin): JsonResponse
    {
        $banTin = $this->timTinCuaToi($request, $tin);

        return response()->json(['data' => [
            'loaiTin' => $banTin->loai_tin === 'nhat_duoc' ? 'found' : 'lost',
            'tieuDe' => $banTin->tieu_de,
            'moTa' => $banTin->mo_ta ?? '',
            'ngayXayRa' => ($banTin->thoi_gian_xay_ra ?? $banTin->created_at)?->format('Y-m-d') ?? '',
            'gioXayRa' => $banTin->gioXayRa() ?? '',
            'diaDiemId' => (string) $banTin->dia_diem_id,
            'tenDiaDiem' => $banTin->diaDiem?->ten_dia_diem,
            'diaDiemChiTiet' => $banTin->dia_diem_chi_tiet ?? '',
        ]])->header('Cache-Control', 'private, no-store');
    }

    public function sua(Request $request, string $tin): JsonResponse
    {
        return DB::transaction(function () use ($request, $tin) {
            $banTin = $this->timTinCuaToi($request, $tin, true);
            $mau = $request->validate($this->quyTacNoiDung(), [
                'ngayXayRa.before_or_equal' => 'Ngày xảy ra không được ở tương lai.',
            ], ['tieuDe' => 'tiêu đề', 'diaDiemChiTiet' => 'vị trí cụ thể', 'ngayXayRa' => 'ngày xảy ra']);
            $diaDiemMoi = $mau['diaDiemId'] ?? null;
            if ($diaDiemMoi !== null && (string) $diaDiemMoi !== (string) $banTin->dia_diem_id) {
                abort_unless(DiaDiem::whereKey($diaDiemMoi)->where('trang_thai', true)->lockForUpdate()->exists(), 422, 'Địa điểm không còn được sử dụng.');
            }
            $banTin->fill($this->cotNoiDung($mau));
            if ($banTin->isDirty()) {
                $banTin->save();
                $banTin->lichSu()->create(['nguoi_thuc_hien_id' => $request->user()->id, 'hanh_dong' => 'sua_tin', 'trang_thai_moi' => $banTin->trang_thai_kiem_duyet, 'noi_dung' => 'Chủ tin đã sửa nội dung tin đăng.']);
            }

            return response()->json(['message' => 'Đã lưu nội dung tin đăng.']);
        });
    }

    public function xoa(Request $request, string $tin): JsonResponse
    {
        return DB::transaction(function () use ($request, $tin) {
            $banTin = $this->timTinCuaToi($request, $tin, true);
            $banTin->lichSu()->create(['nguoi_thuc_hien_id' => $request->user()->id, 'hanh_dong' => 'xoa_tin', 'trang_thai_moi' => 'da_xoa', 'noi_dung' => 'Chủ tin đã xóa tin đăng.']);
            $banTin->delete();

            return response()->json(['message' => 'Đã xóa tin đăng.']);
        });
    }

    private function timTinCuaToi(Request $request, string $tin, bool $khoa = false): TinDang
    {
        $truyVan = TinDang::where('nguoi_dung_id', $request->user()->id);
        if ($khoa) {
            $truyVan->lockForUpdate();
        }

        return $truyVan->findOrFail($tin);
    }

    private function quyTacNoiDung(): array
    {
        return [
            'tieuDe' => ['required', 'string', 'max:150'],
            'moTa' => ['nullable', 'string', 'max:2000'],
            'ngayXayRa' => ['required', 'date_format:Y-m-d', 'before_or_equal:'.now('Asia/Ho_Chi_Minh')->toDateString()],
            'gioXayRa' => ['nullable', 'date_format:H:i'],
            'diaDiemId' => ['nullable', 'integer', 'min:1'],
            'diaDiemChiTiet' => ['required', 'string', 'max:255'],
        ];
    }

    private function cotNoiDung(array $mau): array
    {
        $gio = $mau['gioXayRa'] ?? null;

        return [
            'tieu_de' => $mau['tieuDe'],
            'mo_ta' => $mau['moTa'] ?? '',
            'thoi_gian_xay_ra' => $mau['ngayXayRa'].' '.($gio ?? '00:00').':00',
            'co_gio_xay_ra' => $gio !== null,
            'dia_diem_id' => $mau['diaDiemId'] ?? null,
            'dia_diem_chi_tiet' => $mau['diaDiemChiTiet'],
        ];
    }

    public function anh(Request $request, string $tenAnh): StreamedResponse
    {
        $anh = HinhAnhTinDang::whereIn('duong_dan', [
            '/api/tin-dang/anh/'.$tenAnh,
            '/tin/tin-mat/'.$tenAnh,
            '/tin/tin-nhat/'.$tenAnh,
        ])
            ->where('pham_vi', 'cong_khai')
            ->whereHas('tinDang', fn ($q) => $q->xemDuoc($request->user('web')))
            ->with('tinDang:id,loai_tin')
            ->firstOrFail();
        $duongDan = $tenAnh === HinhAnhTinDang::TEN_ANH_MAU
            ? 'tin/'.$tenAnh
            : $anh->tinDang->thuMucAnh().'/'.$tenAnh;
        foreach ([
            ['anh-tin-dang', $duongDan],
            ['anh-tin-dang', 'tin/anh-cu/'.$tenAnh],
            ['public', $duongDan],
            ['local', 'tin-dang/'.$tenAnh],
        ] as [$tenODia, $tep]) {
            $oDia = Storage::disk($tenODia);
            if ($oDia instanceof FilesystemAdapter && $oDia->exists($tep)) {
                return $oDia->response($tep, null, ['X-Content-Type-Options' => 'nosniff', 'Cache-Control' => 'private, no-store']);
            }
        }

        abort(404);
    }
}
