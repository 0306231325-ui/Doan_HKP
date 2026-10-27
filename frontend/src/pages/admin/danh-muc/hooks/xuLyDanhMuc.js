const maDanhMucMauCu = new Set(['cards', 'bags', 'personal', 'keys', 'electronics', 'books'])

const khoaLuuTru = 'lacoi.admin.danh-muc.v1'

export function chuanHoaTuKhoa(giaTri) {
  return giaTri.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim().replace(/\s+/g, ' ')
}

export function taoDanhMucBanDau() {
  return []
}

export function docDanhSachDanhMuc(khoLuu) {
  try {
    const kho = khoLuu ?? window.localStorage
    const duLieu = kho.getItem(khoaLuuTru)
    if (duLieu === null) return taoDanhMucBanDau()
    const danhSach = JSON.parse(duLieu)
    const cacMa = new Set()
    if (!Array.isArray(danhSach) || !danhSach.every((muc) => {
      if (!muc || typeof muc.id !== 'string' || !muc.id || cacMa.has(muc.id)) return false
      cacMa.add(muc.id)
      return typeof muc.tenDanhMuc === 'string' && muc.tenDanhMuc.trim().length > 0 && muc.tenDanhMuc.length <= 100
        && typeof muc.moTa === 'string' && muc.moTa.length <= 500 && typeof muc.dangHoatDong === 'boolean'
    })) return taoDanhMucBanDau()
    return danhSach.filter((muc) => !maDanhMucMauCu.has(muc.id))
  } catch {
    return taoDanhMucBanDau()
  }
}

export function luuDanhSachDanhMuc(danhSach, khoLuu) {
  try {
    const kho = khoLuu ?? window.localStorage
    kho.setItem(khoaLuuTru, JSON.stringify(danhSach))
    return true
  } catch {
    return false
  }
}

export function kiemTraDanhMuc(bieuMau, danhSach) {
  const loi = {}
  const ten = bieuMau.tenDanhMuc.trim().replace(/\s+/g, ' ')
  if (!ten) loi.tenDanhMuc = 'Vui lòng nhập tên danh mục.'
  else if (ten.length > 100) loi.tenDanhMuc = 'Tên danh mục tối đa 100 ký tự.'
  else if (danhSach.some((muc) => muc.id !== bieuMau.id && chuanHoaTuKhoa(muc.tenDanhMuc) === chuanHoaTuKhoa(ten))) {
    loi.tenDanhMuc = 'Tên danh mục đã tồn tại, kể cả trong danh sách ngừng sử dụng.'
  }
  if (bieuMau.moTa.trim().length > 500) loi.moTa = 'Mô tả tối đa 500 ký tự.'
  return loi
}

export function locDanhSachDanhMuc(danhSach, tuKhoa, trangThai) {
  const tuKhoaChuan = chuanHoaTuKhoa(tuKhoa)
  return danhSach.filter((muc) => {
    const khopTuKhoa = chuanHoaTuKhoa(`${muc.tenDanhMuc} ${muc.moTa}`).includes(tuKhoaChuan)
    const khopTrangThai = trangThai === 'tat_ca' || (trangThai === 'hoat_dong' ? muc.dangHoatDong : !muc.dangHoatDong)
    return khopTuKhoa && khopTrangThai
  }).sort((a, b) => a.tenDanhMuc.localeCompare(b.tenDanhMuc, 'vi'))
}

export function phanTrangDanhMuc(danhSach, trang, moiTrang = 8) {
  const tongTrang = Math.max(1, Math.ceil(danhSach.length / moiTrang))
  const trangHienTai = Math.max(1, Math.min(trang, tongTrang))
  const batDau = (trangHienTai - 1) * moiTrang
  return {
    cacDanhMuc: danhSach.slice(batDau, batDau + moiTrang), trangHienTai, tongTrang,
    tongKetQua: danhSach.length, tuViTri: danhSach.length ? batDau + 1 : 0,
    denViTri: Math.min(batDau + moiTrang, danhSach.length),
  }
}
