import { cacKieuNhap } from '../../../../components/shared/quyTacCauHoi.js'
import { chuanHoaTuKhoa } from '../../danh-muc/hooks/xuLyDanhMuc.js'

export function taoBieuMau(danhMucId) {
  return { id: '', danhMucId, nhanDangTin: '', kieuNhap: 'van_ban', thuTu: 1, dangHoatDong: true }
}

export function kiemTraCauHoi(bieuMau, danhSach, danhMuc) {
  const loi = {}
  const nhan = bieuMau.nhanDangTin.trim()
  const danhMucChon = danhMuc.find((muc) => muc.id === bieuMau.danhMucId)
  const banCu = danhSach.find((muc) => muc.id === bieuMau.id)
  if (!danhMucChon) loi.danhMucId = 'Vui lòng chọn danh mục còn tồn tại.'
  else if (danhMucChon.dangHoatDong === false && banCu?.danhMucId !== bieuMau.danhMucId) loi.danhMucId = 'Chọn danh mục đang hoạt động để thêm câu hỏi.'
  if (!nhan || nhan.length > 250) loi.nhanDangTin = 'Nhập câu hỏi từ 1 đến 250 ký tự.'
  else if (danhSach.some((muc) => muc.danhMucId === bieuMau.danhMucId && muc.id !== bieuMau.id && chuanHoaTuKhoa(muc.nhanDangTin) === chuanHoaTuKhoa(nhan))) loi.nhanDangTin = 'Câu hỏi đã tồn tại trong danh mục này, kể cả câu hỏi ngừng sử dụng.'
  if (!Object.hasOwn(cacKieuNhap, bieuMau.kieuNhap)) loi.kieuNhap = 'Chọn kiểu trả lời Văn bản hoặc Số.'
  if (!Number.isInteger(Number(bieuMau.thuTu)) || Number(bieuMau.thuTu) < 1 || Number(bieuMau.thuTu) > 999) loi.thuTu = 'Thứ tự phải là số nguyên từ 1 đến 999.'
  return loi
}

export function layNhanPhamVi(cauHoi, danhMuc) {
  return cauHoi.danhMucId === null ? 'Không có danh mục' : `Danh mục: ${danhMuc.find((muc) => muc.id === cauHoi.danhMucId)?.tenDanhMuc || 'Không còn tồn tại'}`
}

export function locCauHoi(danhSach, danhMucId, tuKhoa = '', trangThai = 'tat_ca') {
  if (!danhMucId) return []
  return danhSach.filter((muc) => muc.danhMucId === danhMucId
    && chuanHoaTuKhoa(muc.nhanDangTin).includes(chuanHoaTuKhoa(tuKhoa))
    && (trangThai === 'tat_ca' || muc.dangHoatDong === (trangThai === 'hoat_dong')))
    .sort((a, b) => a.thuTu - b.thuTu || a.nhanDangTin.localeCompare(b.nhanDangTin, 'vi'))
}
