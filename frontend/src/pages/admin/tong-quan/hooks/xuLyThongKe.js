export function layNgayVietNam(giaTri) {
  if (!giaTri) return ''
  if (typeof giaTri === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(giaTri)) {
    return laNgayHopLe(giaTri) ? giaTri : ''
  }
  const ngay = new Date(giaTri)
  if (Number.isNaN(ngay.getTime())) return ''
  const cacPhan = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(ngay)
  const giaTriNgay = Object.fromEntries(cacPhan.map(({ type, value }) => [type, value]))
  return `${giaTriNgay.year}-${giaTriNgay.month}-${giaTriNgay.day}`
}

export function laNgayHopLe(ngay) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay)) return false
  const giaTri = new Date(`${ngay}T00:00:00Z`)
  return !Number.isNaN(giaTri.getTime()) && giaTri.toISOString().slice(0, 10) === ngay
}

export function chuyenNgaySangISO(giaTri) {
  const cacPhan = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(giaTri.trim())
  if (!cacPhan) return ''

  const [, ngay, thang, nam] = cacPhan
  const ngayISO = `${nam}-${thang.padStart(2, '0')}-${ngay.padStart(2, '0')}`
  return nam !== '0000' && laNgayHopLe(ngayISO) ? ngayISO : ''
}

export function dinhDangNgay(ngayISO) {
  return ngayISO.split('-').reverse().join('/')
}

export function kiemTraKhoangNgay(tuNgay, denNgay, homNay) {
  if (!laNgayHopLe(tuNgay) || !laNgayHopLe(denNgay)) return 'Vui lòng nhập hoặc chọn đủ hai ngày hợp lệ theo dd/mm/yyyy.'
  if (tuNgay > denNgay) return 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.'
  if (denNgay > homNay) return 'Ngày kết thúc không được sau hôm nay.'
  return ''
}
