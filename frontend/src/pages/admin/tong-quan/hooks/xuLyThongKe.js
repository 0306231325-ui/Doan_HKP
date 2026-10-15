const cacMauPhanBo = ['#145c40', '#438765', '#76ab8c', '#a4cbb2', '#c9e3d2', '#8b9f94']

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

export function congNgay(ngay, soNgay) {
  const giaTri = new Date(`${ngay}T00:00:00Z`)
  giaTri.setUTCDate(giaTri.getUTCDate() + soNgay)
  return giaTri.toISOString().slice(0, 10)
}

export function taoKhoangThoiGian(moc, homNay) {
  if (moc === 'hom_nay') return { tuNgay: homNay, denNgay: homNay }
  if (moc === '7_ngay') return { tuNgay: congNgay(homNay, -6), denNgay: homNay }
  if (moc === '30_ngay') return { tuNgay: congNgay(homNay, -29), denNgay: homNay }
  if (moc === 'thang_nay') return { tuNgay: `${homNay.slice(0, 7)}-01`, denNgay: homNay }
  return { tuNgay: '', denNgay: '' }
}

export function kiemTraKhoangNgay(tuNgay, denNgay, homNay) {
  if (!laNgayHopLe(tuNgay) || !laNgayHopLe(denNgay)) return 'Vui lòng chọn đủ ngày bắt đầu và ngày kết thúc hợp lệ.'
  if (tuNgay > denNgay) return 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.'
  if (denNgay > homNay) return 'Ngày kết thúc không được sau hôm nay.'
  return ''
}

export function locTinTheoNgay(danhSach, { tuNgay, denNgay }) {
  if (!tuNgay && !denNgay) return [...danhSach]
  return danhSach.filter((tin) => {
    const ngay = layNgayVietNam(tin.created_at)
    return ngay && (!tuNgay || ngay >= tuNgay) && (!denNgay || ngay <= denNgay)
  })
}

export function tinhPhanBo(danhSach, kieu) {
  const cacNhom = new Map()
  for (const tin of danhSach) {
    const ten = kieu === 'dia_diem'
      ? tin.dia_diem?.ten_dia_diem || 'Chưa rõ địa điểm'
      : tin.danh_muc?.ten_danh_muc || 'Chưa phân loại'
    cacNhom.set(ten, (cacNhom.get(ten) || 0) + 1)
  }
  const cacMuc = [...cacNhom].map(([ten, soLuong]) => ({ ten, soLuong }))
    .sort((a, b) => b.soLuong - a.soLuong || a.ten.localeCompare(b.ten, 'vi'))
  const cacMucHienThi = cacMuc.slice(0, 5)
  if (cacMuc.length > 5) {
    cacMucHienThi.push({ ten: 'Các nhóm khác', soLuong: cacMuc.slice(5).reduce((tong, muc) => tong + muc.soLuong, 0) })
  }
  let diemBatDau = 0
  return cacMucHienThi.map((muc, viTri) => {
    const tyLe = muc.soLuong / danhSach.length * 100
    const ketQua = { ...muc, tyLe, diemBatDau, mau: cacMauPhanBo[viTri] }
    diemBatDau += tyLe
    return ketQua
  })
}

export function taoThongKe(danhSach, khoangNgay, kieuPhanBo) {
  const cacTin = locTinTheoNgay(danhSach.filter((tin) => !tin.deleted_at), khoangNgay)
  const tongTin = cacTin.length
  const soBaoMat = cacTin.filter((tin) => tin.loai_tin === 'bao_mat').length
  const soNhatDuoc = cacTin.filter((tin) => tin.loai_tin === 'nhat_duoc').length
  const soDaTra = cacTin.filter((tin) => tin.loai_tin === 'nhat_duoc' && ['da_hoan_tat', 'da_ban_giao'].includes(tin.trang_thai)).length
  const soChoDuyet = cacTin.filter((tin) => tin.trang_thai_kiem_duyet === 'cho_duyet').length
  const tyLeTimLai = tongTin ? Math.round(soDaTra / tongTin * 100) : 0
  const tinGanDay = [...cacTin].sort((a, b) => {
    const ngayA = new Date(a.created_at).getTime() || 0
    const ngayB = new Date(b.created_at).getTime() || 0
    return ngayB - ngayA || b.id - a.id
  }).slice(0, 5)

  return { tongTin, soBaoMat, soNhatDuoc, soDaTra, soChoDuyet, tyLeTimLai, tinGanDay, phanBo: tinhPhanBo(cacTin, kieuPhanBo) }
}
