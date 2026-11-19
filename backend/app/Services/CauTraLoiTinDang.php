<?php

namespace App\Services;

use App\Models\LichSuCauHoi;
use Illuminate\Validation\ValidationException;

class CauTraLoiTinDang
{
    public function cauHoi(LichSuCauHoi $ban, string $id): array
    {
        $duLieu = $ban->du_lieu;

        return [
            'id' => $id, 'phienBanId' => (string) $ban->id,
            'danhMucId' => isset($duLieu['danh_muc_id']) ? (string) $duLieu['danh_muc_id'] : null,
            'nhanDangTin' => $duLieu['noi_dung'],
            'thuTu' => (int) $duLieu['thu_tu'], 'dangHoatDong' => true,
        ];
    }

    public function giaTri(array $cau, mixed $giaTri, string $truong): array
    {
        if ($giaTri !== null && ! is_string($giaTri) && ! is_int($giaTri) && ! is_float($giaTri)) {
            throw ValidationException::withMessages([$truong => 'Câu trả lời không hợp lệ.']);
        }
        $noiDung = trim((string) $giaTri);
        if ($noiDung === '') {
            throw ValidationException::withMessages([$truong => 'Vui lòng trả lời: '.$cau['nhanDangTin']]);
        }
        if (mb_strlen($noiDung) > 2000) {
            throw ValidationException::withMessages([$truong => 'Mỗi câu trả lời tối đa 2000 ký tự.']);
        }
        return ['gia_tri_text' => $noiDung];
    }
}
