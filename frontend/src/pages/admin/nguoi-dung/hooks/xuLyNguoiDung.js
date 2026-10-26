import { chuanHoaTimKiem } from '../../../danh-sach-do/hooks/xuLyDanhSachDo.js'

export const cacVaiTro = { nguoi_dung: 'Người dùng', quan_tri: 'Quản trị viên' }
export const cacTrangThai = { hoat_dong: 'Đang hoạt động', bi_khoa: 'Đã khóa' }

export function locNguoiDung(danhSach, { tuKhoa, vaiTro, trangThai }) {
  const cacTu = chuanHoaTimKiem(tuKhoa).split(' ').filter(Boolean)
  return danhSach.filter((nguoiDung) => {
    const noiDung = chuanHoaTimKiem([nguoiDung.ho_ten, nguoiDung.email, nguoiDung.ma_so, nguoiDung.so_dien_thoai].filter(Boolean).join(' '))
    return !nguoiDung.deleted_at && cacTu.every((tu) => noiDung.includes(tu))
      && (vaiTro === 'tat_ca' || nguoiDung.vai_tro === vaiTro)
      && (trangThai === 'tat_ca' || nguoiDung.trang_thai === trangThai)
  })
}

export function layChuVietTat(hoTen) {
  return String(hoTen || '').trim().split(/\s+/).filter(Boolean).slice(-2).map((tu) => Array.from(tu)[0]).join('').toLocaleUpperCase('vi-VN') || 'ND'
}

export function dinhDangThoiGian(giaTri) {
  if (!giaTri) return 'Chưa có thông tin'
  const thoiGian = new Date(String(giaTri).replace(' ', 'T'))
  return Number.isNaN(thoiGian.getTime()) ? 'Chưa có thông tin' : new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh',
  }).format(thoiGian)
}

