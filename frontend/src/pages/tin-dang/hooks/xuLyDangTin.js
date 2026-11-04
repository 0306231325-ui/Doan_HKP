import { kiemTraCauTraLoi } from '../../../components/shared/quyTacCauHoi.js'
import { laNgayHopLe } from '../../admin/tong-quan/hooks/xuLyThongKe.js'

export function kiemTraAnhDangTin(cacTep, soAnhHienTai) {
  if (cacTep.length + soAnhHienTai > 5) return 'Bạn có thể chọn tối đa 5 ảnh cho một tin đăng.'
  if (cacTep.some((tep) => !['image/jpeg', 'image/png', 'image/webp'].includes(tep.type))) return 'Vui lòng chọn ảnh JPG, PNG hoặc WebP.'
  if (cacTep.some((tep) => tep.size <= 0 || tep.size > 5 * 1024 * 1024)) return 'Mỗi ảnh cần có dung lượng lớn hơn 0 và không quá 5 MB.'
  return ''
}

export function kiemTraTinDang(duLieu, danhMuc, cauHoi, cauTraLoi, homNay) {
  if (!danhMuc.some((muc) => muc.id === duLieu.danhMucId)) return 'Vui lòng chọn danh mục đang được sử dụng.'
  if (!cauHoi.some((muc) => muc.danhMucId === duLieu.danhMucId && muc.dangHoatDong)) return 'Danh mục này chưa có câu hỏi nhận diện. Vui lòng thử lại sau khi danh mục được thiết lập.'
  if (!duLieu.tieuDe?.trim() || duLieu.tieuDe.trim().length > 150) return 'Nhập tiêu đề từ 1 đến 150 ký tự.'
  if (!laNgayHopLe(duLieu.ngayXayRa) || (homNay && duLieu.ngayXayRa > homNay)) return 'Chọn ngày xảy ra hợp lệ, không ở tương lai.'
  if (!duLieu.diaDiemChiTiet?.trim() || duLieu.diaDiemChiTiet.trim().length > 255) return 'Nhập vị trí cụ thể, tối đa 255 ký tự.'
  const soDienThoai = duLieu.soDienThoai.trim()
  const email = duLieu.email?.trim() || ''
  if (!soDienThoai && !email) return 'Nhập ít nhất số điện thoại hoặc email liên hệ.'
  if (soDienThoai && !/^\+?[0-9 ]{9,20}$/.test(soDienThoai)) return 'Vui lòng nhập số điện thoại liên hệ hợp lệ.'
  if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)) return 'Vui lòng nhập email hợp lệ.'
  for (const muc of cauHoi) {
    const loiTraLoi = kiemTraCauTraLoi(muc, cauTraLoi[muc.id])
    if (loiTraLoi) return loiTraLoi
  }
  return ''
}

export function taoDuLieuGui(duLieu, cauHoi, cauTraLoi, anh, maGui) {
  const mau = new FormData()
  Object.entries({ ...duLieu, maGui }).forEach(([ten, giaTri]) => mau.append(ten, String(giaTri).trim()))
  cauHoi.forEach((cau, i) => {
    mau.append(`cauTraLoi[${i}][id]`, cau.id)
    mau.append(`cauTraLoi[${i}][phienBanId]`, cau.phienBanId)
    mau.append(`cauTraLoi[${i}][giaTri]`, String(cauTraLoi[cau.id] ?? '').trim())
  })
  anh.forEach((muc) => mau.append('anh[]', muc.tep))
  return mau
}

export function layLoiGui(loi) {
  if (loi.response?.status === 413) return 'Ảnh vượt giới hạn tải lên của máy chủ. Hãy giảm dung lượng ảnh rồi thử lại.'
  return Object.values(loi.response?.data?.errors || {}).flat()[0] || loi.response?.data?.message || 'Chưa gửi được dữ liệu. Vui lòng thử lại.'
}
