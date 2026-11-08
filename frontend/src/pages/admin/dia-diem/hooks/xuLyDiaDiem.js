export function chuanHoaTuKhoa(giaTri) {
  return giaTri.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim().replace(/\s+/g, ' ')
}

export function kiemTraDiaDiem(bieuMau, danhSach) {
  const loi = {}
  const ten = bieuMau.tenDiaDiem.trim().replace(/\s+/g, ' ')
  if (!ten) loi.tenDiaDiem = 'Vui lòng nhập tên địa điểm.'
  else if (ten.length > 150) loi.tenDiaDiem = 'Tên địa điểm tối đa 150 ký tự.'
  else if (danhSach.some((muc) => muc.id !== bieuMau.id && chuanHoaTuKhoa(muc.tenDiaDiem) === chuanHoaTuKhoa(ten))) {
    loi.tenDiaDiem = 'Tên địa điểm đã tồn tại, kể cả trong danh sách ngừng sử dụng.'
  }
  if (bieuMau.moTa.trim().length > 500) loi.moTa = 'Mô tả tối đa 500 ký tự.'
  return loi
}

export function locDanhSachDiaDiem(danhSach, tuKhoa, trangThai) {
  const tuKhoaChuan = chuanHoaTuKhoa(tuKhoa)
  return danhSach.filter((muc) => {
    const khopTuKhoa = chuanHoaTuKhoa(`${muc.tenDiaDiem} ${muc.moTa}`).includes(tuKhoaChuan)
    const khopTrangThai = trangThai === 'tat_ca' || (trangThai === 'hoat_dong' ? muc.dangHoatDong : !muc.dangHoatDong)
    return khopTuKhoa && khopTrangThai
  }).sort((a, b) => a.tenDiaDiem.localeCompare(b.tenDiaDiem, 'vi'))
}
