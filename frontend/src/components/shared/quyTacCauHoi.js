export const cacKieuNhap = { van_ban: 'Văn bản', so: 'Số' }

export function kiemTraCauTraLoi(cauHoi, giaTri) {
  const noiDung = String(giaTri ?? '').trim()
  if (!noiDung) return `Vui lòng trả lời: ${cauHoi.nhanDangTin}`
  if (noiDung.length > 2000) return 'Mỗi câu trả lời tối đa 2000 ký tự.'
  if (cauHoi.kieuNhap === 'so' && (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(noiDung) || !Number.isFinite(Number(noiDung)))) return `Vui lòng nhập số hợp lệ cho: ${cauHoi.nhanDangTin}`
  return ''
}
