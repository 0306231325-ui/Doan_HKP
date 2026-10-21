export function kiemTraAnhDangTin(cacTep, soAnhHienTai) {
  if (cacTep.length + soAnhHienTai > 5) return 'Bạn có thể chọn tối đa 5 ảnh cho một tin đăng.'
  if (cacTep.some((tep) => !['image/jpeg', 'image/png', 'image/webp'].includes(tep.type))) return 'Vui lòng chọn ảnh JPG, PNG hoặc WebP.'
  if (cacTep.some((tep) => tep.size <= 0 || tep.size > 5 * 1024 * 1024)) return 'Mỗi ảnh cần có dung lượng lớn hơn 0 và không quá 5 MB.'
  return ''
}

export function kiemTraTinDang(duLieu, danhMuc, cauHoi, cauTraLoi) {
  if (!danhMuc.some((muc) => muc.id === duLieu.danhMucId)) return 'Vui lòng chọn danh mục đang được sử dụng.'
  if (!/^\+?[0-9 ]{9,20}$/.test(duLieu.soDienThoai.trim())) return 'Vui lòng nhập số điện thoại liên hệ hợp lệ.'
  const loaiForm = duLieu.loaiTin === 'found' ? 'nhat' : 'mat'
  for (const muc of cauHoi) {
    const traLoi = String(cauTraLoi[muc.id] ?? '').trim()
    if (muc.apDung[loaiForm].batBuoc && !traLoi) return `Vui lòng trả lời: ${muc.nhanDangTin}`
    if (traLoi && muc.kieuNhap === 'chon_mot' && !muc.luaChon.some((mucChon) => mucChon.id === traLoi)) return 'Vui lòng chọn câu trả lời có trong danh sách.'
    if (traLoi && muc.kieuNhap === 'so' && !Number.isFinite(Number(traLoi))) return 'Vui lòng nhập câu trả lời dạng số hợp lệ.'
  }
  return ''
}
