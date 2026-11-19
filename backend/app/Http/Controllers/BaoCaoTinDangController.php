<?php

namespace App\Http\Controllers;

use App\Models\TinDang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class BaoCaoTinDangController extends Controller
{
    public function store(Request $request, TinDang $tin)
    {
        $request->merge(['mo_ta' => is_string($request->input('mo_ta')) ? trim($request->input('mo_ta')) : $request->input('mo_ta')]);
        $data = $request->validate([
            'ly_do' => ['required', Rule::in(['Tin giả / sai thông tin', 'Nghi lừa đảo', 'Spam / trùng lặp', 'Nội dung không phù hợp', 'Khác'])],
            'mo_ta' => ['required_if:ly_do,Khác', 'nullable', 'string', 'min:10', 'max:2000'],
        ], [
            'ly_do.required' => 'Vui lòng chọn lý do báo cáo.',
            'ly_do.in' => 'Lý do báo cáo không hợp lệ.',
            'mo_ta.required_if' => 'Vui lòng mô tả lý do báo cáo khác.',
            'mo_ta.min' => 'Mô tả phải có ít nhất 10 ký tự có nội dung.',
            'mo_ta.max' => 'Mô tả không được vượt quá 2000 ký tự.',
            'mo_ta.string' => 'Mô tả phải là chuỗi ký tự.',
        ]);

        $baoCao = DB::transaction(function () use ($request, $tin, $data) {
            // Khóa tin để các lần gửi đồng thời không tạo báo cáo chờ trùng nhau.
            $banGhi = TinDang::whereKey($tin->id)->lockForUpdate()->firstOrFail();
            abort_unless($banGhi->trang_thai_kiem_duyet === 'hien_thi', 404, 'Tin đăng không còn được hiển thị.');
            abort_if((int) $banGhi->nguoi_dung_id === (int) $request->user()->id, 403, 'Bạn không thể báo cáo tin đăng của chính mình.');
            abort_if($banGhi->baoCao()->where('nguoi_bao_cao_id', $request->user()->id)->where('trang_thai', 'cho_xu_ly')->exists(), 409, 'Bạn đã báo cáo tin này. Vui lòng chờ quản trị viên xử lý.');

            return $banGhi->baoCao()->create([
                'nguoi_bao_cao_id' => $request->user()->id,
                'ly_do' => $data['ly_do'], 'mo_ta' => $data['mo_ta'] ?? null,
                'trang_thai' => 'cho_xu_ly',
            ]);
        });

        return response()->json([
            'message' => 'Đã gửi báo cáo. Quản trị viên sẽ xem xét.',
            'data' => ['id' => $baoCao->id, 'trang_thai' => $baoCao->trang_thai],
        ], 201);
    }
}
