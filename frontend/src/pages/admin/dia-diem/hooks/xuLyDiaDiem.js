const maDiaDiemMauCu = new Set(['library', 'canteen_a3', 'lab_hg02', 'parking_gate2', 'lecture_b4', 'exam_room_302'])

const khoaLuuTru = 'lacoi.admin.dia-diem.v1'

export function chuanHoaTuKhoa(giaTri) {
  return giaTri.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim().replace(/\s+/g, ' ')
}

export function taoDiaDiemBanDau() {
  return []
}

export function docDanhSachDiaDiem(khoLuu) {
  try {
    const kho = khoLuu ?? window.localStorage
    const duLieu = kho.getItem(khoaLuuTru)
    if (duLieu === null) return taoDiaDiemBanDau()
    const danhSach = JSON.parse(duLieu)
    const cacMa = new Set()
    if (!Array.isArray(danhSach) || !danhSach.every((muc) => {
      if (!muc || typeof muc.id !== 'string' || !muc.id || cacMa.has(muc.id)) return false
      cacMa.add(muc.id)
      return typeof muc.tenDiaDiem === 'string' && muc.tenDiaDiem.trim().length > 0 && muc.tenDiaDiem.length <= 150
        && typeof muc.moTa === 'string' && muc.moTa.length <= 500 && typeof muc.dangHoatDong === 'boolean'
    })) return taoDiaDiemBanDau()
    return danhSach.filter((muc) => !maDiaDiemMauCu.has(muc.id))
  } catch {
    return taoDiaDiemBanDau()
  }
}

export function luuDanhSachDiaDiem(danhSach, khoLuu) {
  try {
    const kho = khoLuu ?? window.localStorage
    kho.setItem(khoaLuuTru, JSON.stringify(danhSach))
    return true
  } catch {
    return false
  }
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
