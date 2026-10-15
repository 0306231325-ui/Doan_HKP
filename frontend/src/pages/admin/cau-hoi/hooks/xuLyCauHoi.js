import { chuanHoaTuKhoa } from '../../danh-muc/hooks/xuLyDanhMuc.js'

export const cacKieuNhap = { van_ban: 'Văn bản ngắn', doan_van: 'Đoạn văn', so: 'Số', chon_mot: 'Chọn một đáp án' }
const khoaLuuTru = 'lacoi.admin.cau-hoi.v1'

export function taoCauHinh(suDung = true) {
  return { suDung, batBuoc: false, congKhai: suDung, dungXacMinh: false, batBuocNhanLai: false }
}

export function taoBieuMau(danhMucId) {
  return { id: '', danhMucId, nhanDangTin: '', nhanNhanLai: '', kieuNhap: 'van_ban', luaChon: [], thuTu: 1, dangHoatDong: true, apDung: { mat: taoCauHinh(), nhat: taoCauHinh() } }
}

export function taoCauHoiBanDau() {
  const cauRieng = {
    cards: 'Đó là loại giấy tờ hoặc thẻ gì?', bags: 'Túi hoặc ví thuộc thương hiệu nào?',
    personal: 'Đó là loại tư trang gì?', keys: 'Chùm chìa khóa có bao nhiêu chìa?',
    electronics: 'Thiết bị thuộc hãng nào?', books: 'Tên sách hoặc môn học là gì?',
  }
  return Object.entries(cauRieng).flatMap(([danhMucId, nhanDangTin]) => [
    { ...taoBieuMau(danhMucId), id: `${danhMucId}-loai-1`, maCauHoi: `${danhMucId}-loai`, phienBan: 1, nhanDangTin, kieuNhap: danhMucId === 'keys' ? 'so' : 'van_ban' },
    { ...taoBieuMau(danhMucId), id: `${danhMucId}-dac-diem-1`, maCauHoi: `${danhMucId}-dac-diem`, phienBan: 1, thuTu: 2,
      nhanDangTin: 'Đồ vật có đặc điểm riêng nào để nhận biết?', nhanNhanLai: 'Hãy mô tả đặc điểm riêng của đồ vật để chứng minh quyền sở hữu.',
      apDung: { mat: taoCauHinh(), nhat: { ...taoCauHinh(), congKhai: false, dungXacMinh: true, batBuocNhanLai: true } } },
  ])
}

export function layCauHoiHienHanh(danhSach) {
  const theoMa = new Map()
  for (const cauHoi of danhSach) {
    if (!theoMa.has(cauHoi.maCauHoi) || theoMa.get(cauHoi.maCauHoi).phienBan < cauHoi.phienBan) theoMa.set(cauHoi.maCauHoi, cauHoi)
  }
  return [...theoMa.values()]
}

export function kiemTraCauHoi(bieuMau, danhSach, danhMuc) {
  const loi = {}
  const nhan = bieuMau.nhanDangTin.trim()
  if (!danhMuc.some((muc) => muc.id === bieuMau.danhMucId)) loi.danhMucId = 'Danh mục không còn tồn tại.'
  if (!nhan || nhan.length > 250) loi.nhanDangTin = 'Nhập câu hỏi từ 1 đến 250 ký tự.'
  else if (layCauHoiHienHanh(danhSach).some((muc) => muc.danhMucId === bieuMau.danhMucId && muc.maCauHoi !== bieuMau.maCauHoi && chuanHoaTuKhoa(muc.nhanDangTin) === chuanHoaTuKhoa(nhan))) loi.nhanDangTin = 'Câu hỏi đã tồn tại trong danh mục, kể cả câu hỏi ngừng sử dụng.'
  if (!Object.hasOwn(cacKieuNhap, bieuMau.kieuNhap)) loi.kieuNhap = 'Chọn kiểu trả lời hợp lệ.'
  if (!Number.isInteger(Number(bieuMau.thuTu)) || Number(bieuMau.thuTu) < 1 || Number(bieuMau.thuTu) > 999) loi.thuTu = 'Thứ tự phải là số nguyên từ 1 đến 999.'
  if (bieuMau.nhanNhanLai.trim().length > 250) loi.nhanNhanLai = 'Câu hỏi nhận lại tối đa 250 ký tự.'
  const { mat, nhat } = bieuMau.apDung
  if (!mat.suDung && !nhat.suDung) loi.apDung = 'Chọn ít nhất một loại tin áp dụng.'
  if (mat.dungXacMinh || mat.batBuocNhanLai) loi.apDung = 'Xác minh nhận lại chỉ áp dụng cho tin nhặt được.'
  for (const cauHinh of [mat, nhat]) {
    if (!cauHinh.suDung && (cauHinh.batBuoc || cauHinh.congKhai || cauHinh.dungXacMinh || cauHinh.batBuocNhanLai)) loi.apDung = 'Cấu hình đang chứa tùy chọn cho loại tin không áp dụng.'
  }
  if (nhat.dungXacMinh && nhat.congKhai) loi.apDung = 'Câu trả lời dùng để xác minh phải được giữ kín.'
  if (nhat.batBuocNhanLai && !nhat.dungXacMinh) loi.apDung = 'Bật dùng để xác minh trước khi bắt buộc trả lời lúc nhận lại.'
  if (nhat.dungXacMinh && !bieuMau.nhanNhanLai.trim()) loi.nhanNhanLai = 'Nhập câu hỏi dành cho người xin nhận lại đồ.'
  if (bieuMau.kieuNhap === 'chon_mot') {
    const nhanLuaChon = bieuMau.luaChon.map((muc) => chuanHoaTuKhoa(muc.nhan))
    if (nhanLuaChon.length < 2 || nhanLuaChon.length > 20 || bieuMau.luaChon.some((muc) => !muc.nhan.trim() || muc.nhan.trim().length > 100)) loi.luaChon = 'Cần từ 2 đến 20 lựa chọn, mỗi lựa chọn từ 1 đến 100 ký tự.'
    else if (new Set(nhanLuaChon).size !== nhanLuaChon.length) loi.luaChon = 'Các lựa chọn không được trùng nhau.'
  }
  return loi
}

export function docDanhSachCauHoi(khoLuu) {
  try {
    const duLieu = (khoLuu ?? window.localStorage).getItem(khoaLuuTru)
    if (duLieu === null) return taoCauHoiBanDau()
    const danhSach = JSON.parse(duLieu)
    const cacId = new Set()
    const cacPhienBan = new Set()
    if (!Array.isArray(danhSach) || !danhSach.every((muc) => {
      if (!muc || typeof muc.id !== 'string' || !muc.id || cacId.has(muc.id) || typeof muc.maCauHoi !== 'string' || !muc.maCauHoi || !Number.isInteger(muc.phienBan) || muc.phienBan < 1 || typeof muc.danhMucId !== 'string' || !muc.danhMucId) return false
      const khoaPhienBan = JSON.stringify([muc.maCauHoi, muc.phienBan])
      if (cacPhienBan.has(khoaPhienBan)) return false
      cacId.add(muc.id)
      cacPhienBan.add(khoaPhienBan)
      if (typeof muc.nhanDangTin !== 'string' || typeof muc.nhanNhanLai !== 'string' || typeof muc.dangHoatDong !== 'boolean' || !Number.isInteger(muc.thuTu) || !Array.isArray(muc.luaChon) || !muc.luaChon.every((luaChon) => luaChon && typeof luaChon.id === 'string' && luaChon.id && typeof luaChon.nhan === 'string') || new Set(muc.luaChon.map((luaChon) => luaChon.id)).size !== muc.luaChon.length) return false
      if (!muc.apDung || !['mat', 'nhat'].every((loai) => muc.apDung[loai] && ['suDung', 'batBuoc', 'congKhai', 'dungXacMinh', 'batBuocNhanLai'].every((co) => typeof muc.apDung[loai][co] === 'boolean'))) return false
      return Object.keys(kiemTraCauHoi(muc, [], [{ id: muc.danhMucId }])).length === 0
    })) return taoCauHoiBanDau()
    return danhSach
  } catch {
    return taoCauHoiBanDau()
  }
}

export function luuDanhSachCauHoi(danhSach, khoLuu) {
  try {
    (khoLuu ?? window.localStorage).setItem(khoaLuuTru, JSON.stringify(danhSach))
    return true
  } catch {
    return false
  }
}

export function taoPhienBanCauHoi(bieuMau, danhSach, taoMa = () => crypto.randomUUID()) {
  const cu = layCauHoiHienHanh(danhSach).find((muc) => muc.maCauHoi === bieuMau.maCauHoi)
  const cauHoi = { ...structuredClone(bieuMau), nhanDangTin: bieuMau.nhanDangTin.trim(), nhanNhanLai: bieuMau.nhanNhanLai.trim(), thuTu: Number(bieuMau.thuTu),
    luaChon: bieuMau.kieuNhap === 'chon_mot' ? bieuMau.luaChon.map((muc) => ({ ...muc, nhan: muc.nhan.trim() })) : [] }
  if (cu) {
    if (cu.id !== bieuMau.id || cu.danhMucId !== bieuMau.danhMucId) throw new Error('Câu hỏi đã thay đổi. Hãy đóng hộp thoại và mở lại.')
    if (JSON.stringify(cauHoi) === JSON.stringify(cu)) return { danhSachMoi: danhSach, cauHoi: cu, daThayDoi: false }
  } else if (bieuMau.id) throw new Error('Không tìm thấy câu hỏi cần sửa.')
  cauHoi.id = taoMa()
  cauHoi.maCauHoi = cu?.maCauHoi || cauHoi.id
  cauHoi.phienBan = cu ? cu.phienBan + 1 : 1
  return { danhSachMoi: [...danhSach, cauHoi], cauHoi, daThayDoi: true }
}

export function locCauHoi(danhSach, danhMucId, tuKhoa = '', trangThai = 'tat_ca') {
  return layCauHoiHienHanh(danhSach).filter((muc) => muc.danhMucId === danhMucId
    && chuanHoaTuKhoa(`${muc.nhanDangTin} ${muc.nhanNhanLai}`).includes(chuanHoaTuKhoa(tuKhoa))
    && (trangThai === 'tat_ca' || muc.dangHoatDong === (trangThai === 'hoat_dong')))
    .sort((a, b) => a.thuTu - b.thuTu || a.nhanDangTin.localeCompare(b.nhanDangTin, 'vi'))
}

export function layCauHoiXemTruoc(danhSach, danhMucId, loaiForm) {
  return locCauHoi(danhSach, danhMucId, '', 'hoat_dong').filter((muc) => loaiForm === 'nhan_lai' ? muc.apDung.nhat.suDung && muc.apDung.nhat.dungXacMinh : muc.apDung[loaiForm]?.suDung)
}
