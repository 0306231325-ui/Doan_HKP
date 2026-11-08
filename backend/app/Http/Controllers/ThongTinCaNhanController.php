<?php

namespace App\Http\Controllers;

use App\Models\NguoiDung;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use LogicException;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class ThongTinCaNhanController extends Controller
{
    public const MAU_TEN_ANH = '(?:[a-zA-Z0-9]{40}|[a-zA-Z0-9][a-zA-Z0-9._+-]{0,63}-[a-zA-Z0-9]{40})\.(?:jpg|jpeg|png|webp)';

    public function capNhat(Request $request): JsonResponse
    {
        if (is_string($request->input('email'))) {
            $request->merge(['email' => mb_strtolower(trim($request->input('email')))]);
        }
        $nguoiDung = $request->user();
        $duLieu = $request->validate([
            'ho_ten' => ['required', 'string', 'max:150'],
            'email' => ['required', 'string', 'email', 'max:191', Rule::unique('nguoi_dung', 'email')->ignore($nguoiDung->id)],
            'ma_so' => ['nullable', 'string', 'max:50'],
            'so_dien_thoai' => ['nullable', 'string', 'max:20', 'regex:/^\+?[0-9 ]{9,20}$/'],
            'khoa' => ['nullable', 'string', 'max:100'],
            'lop' => ['nullable', 'string', 'max:50'],
            'current_password' => ['nullable', 'string', 'max:72'],
        ], [
            'required' => 'Vui lòng nhập :attribute.',
            'max' => ':attribute vượt quá độ dài cho phép.',
            'email.email' => 'Email không đúng định dạng.',
            'email.unique' => 'Email này đã được sử dụng.',
            'so_dien_thoai.regex' => 'Số điện thoại không hợp lệ.',
        ], ['ho_ten' => 'họ và tên', 'email' => 'email', 'current_password' => 'mật khẩu hiện tại']);
        if ($duLieu['email'] !== $nguoiDung->email && ! $nguoiDung->kiemTraMatKhau($duLieu['current_password'] ?? '')) {
            throw ValidationException::withMessages(['current_password' => 'Nhập đúng mật khẩu hiện tại để thay đổi email.']);
        }
        unset($duLieu['current_password']);
        $nguoiDung->fill($duLieu);
        $coThayDoi = $nguoiDung->isDirty();
        try {
            if ($coThayDoi) {
                $nguoiDung->save();
            }
        } catch (UniqueConstraintViolationException $exception) {
            throw ValidationException::withMessages(['email' => 'Email này đã được sử dụng.']);
        }

        return response()->json([
            'message' => $coThayDoi ? 'Đã lưu thông tin cá nhân.' : 'Bạn chưa thay đổi thông tin nào.',
            'updated' => $coThayDoi,
            'user' => $nguoiDung->thongTinCaNhan(),
        ]);
    }

    public function doiMatKhau(Request $request): JsonResponse
    {
        $duLieu = $request->validate([
            'current_password' => ['required', 'string', 'max:72'],
            'password' => ['required', 'string', 'min:8', 'max:72', 'confirmed', 'different:current_password'],
        ], [
            'current_password.required' => 'Vui lòng nhập mật khẩu hiện tại.',
            'password.required' => 'Vui lòng nhập mật khẩu mới.',
            'password.min' => 'Mật khẩu mới phải có ít nhất 8 ký tự.',
            'password.max' => 'Mật khẩu mới không được vượt quá 72 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
            'password.different' => 'Mật khẩu mới phải khác mật khẩu hiện tại.',
        ]);
        if (! $request->user()->kiemTraMatKhau($duLieu['current_password'])) {
            throw ValidationException::withMessages(['current_password' => 'Mật khẩu hiện tại không đúng.']);
        }
        if (strlen($duLieu['password']) > 72) {
            throw ValidationException::withMessages(['password' => 'Mật khẩu mới không được vượt quá 72 byte.']);
        }
        $request->user()->update(['mat_khau' => Hash::make($duLieu['password'])]);

        return response()->json(['message' => 'Đổi mật khẩu thành công.']);
    }

    public function doiAnhDaiDien(Request $request): JsonResponse
    {
        $request->validate([
            'anh_dai_dien' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048', 'dimensions:max_width=4096,max_height=4096'],
        ], [
            'anh_dai_dien.required' => 'Vui lòng chọn ảnh đại diện.',
            'anh_dai_dien.image' => 'Tệp tải lên phải là hình ảnh.',
            'anh_dai_dien.mimes' => 'Chỉ chấp nhận ảnh JPG, PNG hoặc WebP.',
            'anh_dai_dien.max' => 'Ảnh không được lớn hơn 2 MB.',
            'anh_dai_dien.dimensions' => 'Kích thước ảnh tối đa là 4096 × 4096 pixel.',
        ]);
        $taiKhoan = $request->user();
        $anh = $request->file('anh_dai_dien');
        $phanEmail = explode('@', $taiKhoan->email, 2)[0];
        $tienTo = trim(substr(preg_replace('/[^a-zA-Z0-9._+-]+/', '-', $phanEmail), 0, 64), '._+-');
        $tenAnh = ($tienTo === '' ? 'tai-khoan' : $tienTo).'-'.$anh->hashName();
        $duongDan = $anh->storeAs('', $tenAnh, 'anh-dai-dien');
        if (! $duongDan) {
            throw ValidationException::withMessages(['anh_dai_dien' => 'Chưa thể lưu ảnh. Vui lòng thử lại.']);
        }
        try {
            [$nguoiDung, $anhCu] = $this->luuAnhDaiDien($taiKhoan, '/api/anh-dai-dien/'.$tenAnh);
        } catch (Throwable $exception) {
            Storage::disk('anh-dai-dien')->delete($duongDan);
            throw $exception;
        }
        $this->donAnhCu($anhCu);

        return response()->json(['message' => $anhCu ? 'Đã thay đổi ảnh đại diện.' : 'Đã thêm ảnh đại diện.', 'user' => $nguoiDung->thongTinCaNhan()]);
    }

    public function goAnhDaiDien(Request $request): JsonResponse
    {
        [$nguoiDung, $anhCu] = $this->luuAnhDaiDien($request->user(), null);
        $this->donAnhCu($anhCu);

        return response()->json(['message' => 'Đã gỡ ảnh đại diện.', 'user' => $nguoiDung->thongTinCaNhan()]);
    }

    private function luuAnhDaiDien(NguoiDung $taiKhoan, ?string $anhMoi): array
    {
        return DB::transaction(function () use ($taiKhoan, $anhMoi) {
            $nguoiDung = NguoiDung::lockForUpdate()->findOrFail($taiKhoan->id);
            $anhCu = $nguoiDung->anh_dai_dien;
            if ($anhCu !== $anhMoi) {
                $nguoiDung->update(['anh_dai_dien' => $anhMoi]);
            }

            return [$nguoiDung, $anhCu];
        }, 3);
    }

    private function donAnhCu(?string $anhCu): void
    {
        if ($anhCu && preg_match('~\A/api/anh-dai-dien/('.self::MAU_TEN_ANH.')\z~', $anhCu, $ketQua)
            && ! NguoiDung::where('anh_dai_dien', $anhCu)->exists()) {
            Storage::disk('anh-dai-dien')->delete($ketQua[1]);
            Storage::disk('public')->delete('anh-dai-dien/'.$ketQua[1]);
        }
    }

    public function anhDaiDien(string $tenAnh): StreamedResponse
    {
        $oDia = Storage::disk('anh-dai-dien');
        $duongDan = $tenAnh;
        if (! $oDia->exists($duongDan)) {
            $oDia = Storage::disk('public');
            $duongDan = 'anh-dai-dien/'.$tenAnh;
        }
        if (! $oDia instanceof FilesystemAdapter) {
            throw new LogicException('Ổ lưu trữ ảnh đại diện không hỗ trợ trả tệp.');
        }
        abort_unless($oDia->exists($duongDan), 404);

        return $oDia->response($duongDan, null, [
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}
