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

export function dinhDangNgay(ngay) {
  return /^\d{4}-\d{2}-\d{2}$/.test(ngay || '') ? ngay.split('-').reverse().join('/') : 'Chưa rõ ngày'
}

export function taoThamSoTraCuu(boLoc, trang) {
  const thamSo = new URLSearchParams()
  for (const [ten, giaTri] of Object.entries(boLoc)) {
    if (giaTri && giaTri !== boLocBanDau[ten]) thamSo.set(ten, giaTri)
  }
  const soTrang = Number(trang)
  if (Number.isSafeInteger(soTrang) && soTrang > 1) thamSo.set('trang', String(Math.min(soTrang, 1000000)))
  return thamSo.toString()
}
