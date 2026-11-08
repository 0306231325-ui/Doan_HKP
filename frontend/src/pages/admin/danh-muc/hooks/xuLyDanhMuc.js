export function chuanHoaTuKhoa(giaTri) {
  return giaTri.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim().replace(/\s+/g, ' ')
}

export function locDanhSachDanhMuc(danhSach, { tuKhoa = '', trangThai = 'tat_ca' }) {
  const tuKhoaChuan = chuanHoaTuKhoa(tuKhoa)
  return danhSach.filter((muc) => chuanHoaTuKhoa(`${muc.tenDanhMuc} ${muc.moTa ?? ''}`).includes(tuKhoaChuan)
    && (trangThai === 'tat_ca' || muc.dangHoatDong === (trangThai === 'hoat_dong')))
}

export function kiemTraDanhMuc(bieuMau, danhSach) {
  const loi = {}
  const ten = bieuMau.tenDanhMuc.trim().replace(/\s+/g, ' ')
  if (!ten) loi.tenDanhMuc = 'Vui lòng nhập tên danh mục.'
  else if (ten.length > 100) loi.tenDanhMuc = 'Tên danh mục tối đa 100 ký tự.'
  else if (danhSach.some((muc) => chuanHoaTuKhoa(muc.tenDanhMuc) === chuanHoaTuKhoa(ten))) {
    loi.tenDanhMuc = 'Tên danh mục đã tồn tại, kể cả trong danh sách ngừng sử dụng.'
  }
  if (bieuMau.moTa.trim().length > 500) loi.moTa = 'Mô tả tối đa 500 ký tự.'
  return loi
}
