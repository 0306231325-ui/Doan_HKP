<?php

namespace App\Http\Controllers;

use App\Models\NguoiDung;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(['data' => NguoiDung::where('id', '<>', $request->user()->id)->orderByDesc('id')->get()->map(fn ($user) => $this->duLieuQuanTri($user, $request))]);
    }

    public function doiTrangThai(Request $request, string $id): JsonResponse
    {
        $duLieu = $request->validate([
            'trang_thai' => ['required', Rule::in(['hoat_dong', 'bi_khoa'])],
            'trang_thai_hien_tai' => ['required', Rule::in(['hoat_dong', 'bi_khoa'])],
            'ly_do_khoa' => ['nullable', 'required_if:trang_thai,bi_khoa', 'string', 'max:1000'],
        ], [
            'ly_do_khoa.required_if' => 'Vui lòng nhập lý do khóa tài khoản.',
            'ly_do_khoa.max' => 'Lý do khóa không được vượt quá 1000 ký tự.',
            'trang_thai.in' => 'Trạng thái tài khoản không hợp lệ.',
        ]);

        return DB::transaction(function () use ($request, $id, $duLieu) {
            $cacTaiKhoan = NguoiDung::whereIn('id', [$request->user()->id, $id])->orderBy('id')->lockForUpdate()->get()->keyBy('id');
            abort_unless($cacTaiKhoan->get($request->user()->id)?->trang_thai === 'hoat_dong', 403, 'Tài khoản đã bị khóa.');
            abort_unless($cacTaiKhoan->get($request->user()->id)?->vai_tro === 'quan_tri', 403, 'Bạn không có quyền quản trị.');
            $user = $cacTaiKhoan->get($id);
            abort_unless($user, 404, 'Không tìm thấy tài khoản.');
            abort_if((string) $request->user()->id === (string) $user->id, 403, 'Bạn không thể thay đổi trạng thái tài khoản đang đăng nhập.');
            abort_if($user->trang_thai !== $duLieu['trang_thai_hien_tai'], 409, 'Trạng thái tài khoản đã thay đổi. Vui lòng tải lại danh sách.');
            $updated = $user->trang_thai !== $duLieu['trang_thai'];
            if ($updated) {
                $user->update([
                    'trang_thai' => $duLieu['trang_thai'],
                    'ly_do_khoa' => $duLieu['trang_thai'] === 'bi_khoa' ? trim($duLieu['ly_do_khoa']) : null,
                    'khoa_den_ngay' => null,
                ]);
            }

            return response()->json([
                'user' => $this->duLieuQuanTri($user, $request), 'updated' => $updated,
                'message' => ! $updated ? 'Trạng thái tài khoản không thay đổi.' : ($user->trang_thai === 'bi_khoa' ? 'Đã khóa tài khoản.' : 'Đã mở khóa tài khoản.'),
            ]);
        });
    }

    private function duLieuQuanTri(NguoiDung $user, Request $request): array
    {
        return array_merge($user->only([
            'id', 'ho_ten', 'email', 'ma_so', 'so_dien_thoai', 'khoa', 'lop', 'anh_dai_dien',
            'vai_tro', 'trang_thai', 'ly_do_khoa', 'khoa_den_ngay', 'created_at', 'updated_at',
        ]), ['co_the_doi_trang_thai' => (string) $user->id !== (string) $request->user()->id]);
    }
}
