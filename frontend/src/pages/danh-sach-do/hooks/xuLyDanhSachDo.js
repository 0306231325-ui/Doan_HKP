export const boLocBanDau = { tuKhoa: '', loaiTin: 'all', danhMuc: 'all', diaDiem: 'all', tuNgay: '', denNgay: '', sapXep: 'moi_nhat' }

export function chuanHoaTimKiem(giaTri) {
  return String(giaTri ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim().replace(/\s+/g, ' ')
}

export function kiemTraNgay(tuNgay, denNgay) {
  for (const ngay of [tuNgay, denNgay]) {
    if (ngay && (!/^\d{4}-\d{2}-\d{2}$/.test(ngay) || Number.isNaN(Date.parse(`${ngay}T00:00:00Z`)) || new Date(`${ngay}T00:00:00Z`).toISOString().slice(0, 10) !== ngay)) return 'Vui lòng chọn ngày hợp lệ.'
  }
  if (tuNgay && denNgay && tuNgay > denNgay) return 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.'
  return ''
}

export function docBoLoc(thamSo, danhMuc, diaDiem) {
  const loaiTin = thamSo.get('loaiTin')
  const sapXep = thamSo.get('sapXep')
  return {
    tuKhoa: thamSo.get('tuKhoa') || '', loaiTin: ['lost', 'found'].includes(loaiTin) ? loaiTin : 'all',
    danhMuc: danhMuc.some((muc) => muc.id === thamSo.get('danhMuc')) ? thamSo.get('danhMuc') : 'all',
    diaDiem: diaDiem.some((muc) => muc.id === thamSo.get('diaDiem')) ? thamSo.get('diaDiem') : 'all',
    tuNgay: thamSo.get('tuNgay') || '', denNgay: thamSo.get('denNgay') || '',
    sapXep: ['moi_nhat', 'cu_nhat'].includes(sapXep) ? sapXep : 'moi_nhat',
  }
}

export function locDoVat(danhSach, boLoc) {
  if (kiemTraNgay(boLoc.tuNgay, boLoc.denNgay)) return []
  const cacTu = chuanHoaTimKiem(boLoc.tuKhoa).split(/[^\p{L}\p{N}]+/u).filter(Boolean)
  return danhSach.filter((muc) => {
    const noiDung = chuanHoaTimKiem(`${muc.title} ${muc.fullName || ''} ${muc.description} ${muc.location} ${muc.category} ${muc.referenceCode}`)
    const cacTuTrongTin = new Set(noiDung.split(/[^\p{L}\p{N}]+/u))
    return cacTu.every((tu) => cacTuTrongTin.has(tu))
      && (boLoc.loaiTin === 'all' || muc.type === boLoc.loaiTin)
      && (boLoc.danhMuc === 'all' || muc.categoryId === boLoc.danhMuc)
      && (boLoc.diaDiem === 'all' || muc.locationId === boLoc.diaDiem)
      && (!boLoc.tuNgay || muc.date >= boLoc.tuNgay)
      && (!boLoc.denNgay || muc.date <= boLoc.denNgay)
  }).sort((a, b) => (boLoc.sapXep === 'cu_nhat' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)) || String(a.id).localeCompare(String(b.id), 'vi', { numeric: true }))
}

export function phanTrangDoVat(danhSach, trang, moiTrang = 6) {
  const tongTrang = Math.max(1, Math.ceil(danhSach.length / moiTrang))
  const trangHienTai = Math.max(1, Math.min(Number.isSafeInteger(Number(trang)) ? Number(trang) : 1, tongTrang))
  const batDau = (trangHienTai - 1) * moiTrang
  return { cacDoVat: danhSach.slice(batDau, batDau + moiTrang), trangHienTai, tongTrang, tongTin: danhSach.length,
    tuViTri: danhSach.length ? batDau + 1 : 0, denViTri: Math.min(batDau + moiTrang, danhSach.length) }
}

export function dinhDangNgay(ngay) {
  return /^\d{4}-\d{2}-\d{2}$/.test(ngay || '') ? ngay.split('-').reverse().join('/') : 'Chưa rõ ngày'
}
