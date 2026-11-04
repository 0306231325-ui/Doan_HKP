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
            'nhanDangTin' => $duLieu['noi_dung'], 'kieuNhap' => $duLieu['kieu_nhap'] ?? 'van_ban',
            'thuTu' => (int) $duLieu['thu_tu'], 'dangHoatDong' => true,
        ];
    }

    public function giaTri(array $cau, mixed $giaTri, string $truong): array
    {
        if ($giaTri !== null && ! is_string($giaTri) && ! is_int($giaTri) && ! is_float($giaTri)) {
            throw ValidationException::withMessages([$truong => 'Câu trả lời phải là văn bản hoặc số.']);
        }
        $noiDung = trim((string) $giaTri);
        if ($noiDung === '') {
            if ($cau['danhMucId'] !== null) {
                throw ValidationException::withMessages([$truong => 'Vui lòng trả lời: '.$cau['nhanDangTin']]);
            }

            return [];
        }
        if (mb_strlen($noiDung) > 2000) {
            throw ValidationException::withMessages([$truong => 'Mỗi câu trả lời tối đa 2000 ký tự.']);
        }
        if ($cau['kieuNhap'] !== 'so') {
            return ['gia_tri_text' => $noiDung];
        }
        if (! preg_match('/^([+-]?)(\d*)(?:\.(\d+))?(?:[eE]([+-]?\d{1,3}))?$/D', $noiDung, $so) || (($so[2] ?? '') === '' && ($so[3] ?? '') === '')) {
            throw ValidationException::withMessages([$truong => 'Vui lòng nhập số hợp lệ: '.$cau['nhanDangTin']]);
        }
        $phanNguyen = $so[2];
        $chuSo = $phanNguyen.($so[3] ?? '');
        $viTri = strlen($phanNguyen) + (int) ($so[4] ?? 0);
        if ($viTri <= 0) {
            $nguyen = '0';
            $le = str_repeat('0', -$viTri).$chuSo;
        } else {
            $chuSo = str_pad($chuSo, $viTri, '0');
            $nguyen = substr($chuSo, 0, $viTri);
            $le = substr($chuSo, $viTri);
        }
        $nguyen = ltrim($nguyen, '0') ?: '0';
        $le = rtrim($le, '0');
        if (strlen($nguyen) > 14 || strlen($le) > 4) {
            throw ValidationException::withMessages([$truong => 'Số tối đa 14 chữ số phần nguyên và 4 chữ số thập phân.']);
        }

        return ['gia_tri_so' => ($so[1] === '-' ? '-' : '').$nguyen.($le !== '' ? '.'.$le : '')];
    }
}
