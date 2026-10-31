export const CAC_TRUONG_HO_SO = [
  { name: 'ho_ten', label: 'Họ và tên', required: true, maxLength: 150, autoComplete: 'name' },
  { name: 'ma_so', label: 'Mã sinh viên / giảng viên', maxLength: 50 },
  { name: 'email', label: 'Email', type: 'email', required: true, maxLength: 191, autoComplete: 'email' },
  { name: 'so_dien_thoai', label: 'Số điện thoại', type: 'tel', maxLength: 20, pattern: '[+]?[0-9 ]{9,20}', autoComplete: 'tel', title: 'Nhập số điện thoại hợp lệ từ 9 đến 20 ký tự.' },
  { name: 'khoa', label: 'Khoa', maxLength: 100 },
  { name: 'lop', label: 'Lớp', maxLength: 50 },
]

export function layDuLieuHoSo(nguoiDung) {
  return Object.fromEntries(CAC_TRUONG_HO_SO.map(({ name }) => [name, nguoiDung?.[name] ?? '']))
}

export function chuanHoaHoSo(duLieu) {
  const hoSo = Object.fromEntries(Object.entries(layDuLieuHoSo(duLieu)).map(([ten, giaTri]) => [ten, giaTri.trim()]))
  hoSo.email = hoSo.email.toLowerCase()
  return hoSo
}

export function coThayDoiHoSo(duLieu, nguoiDung) {
  return JSON.stringify(chuanHoaHoSo(duLieu)) !== JSON.stringify(chuanHoaHoSo(nguoiDung))
}

export function layLoiHoSo(loi) {
  const trangThai = loi.response?.status
  if (trangThai === 422) return Object.values(loi.response.data.errors || {}).flat().join(' ') || 'Vui lòng kiểm tra lại thông tin.'
  if (trangThai === 401 || trangThai === 419) return 'Phiên đăng nhập đã hết hạn. Vui lòng tải lại trang và đăng nhập lại.'
  if (trangThai === 403) return 'Tài khoản không được phép thực hiện thao tác này.'
  if (trangThai === 413) return 'Ảnh quá lớn. Vui lòng chọn ảnh không quá 2 MB.'
  if (trangThai === 429) return 'Bạn thao tác quá nhiều lần. Vui lòng đợi một phút rồi thử lại.'
  return 'Không thể lưu thay đổi lúc này. Vui lòng thử lại.'
}
