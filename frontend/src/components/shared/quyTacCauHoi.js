export function kiemTraCauTraLoi(cauHoi, giaTri) {
  const noiDung = String(giaTri ?? '').trim()
  if (!noiDung) return `Vui lòng trả lời: ${cauHoi.nhanDangTin}`
  if (noiDung.length > 2000) return 'Mỗi câu trả lời tối đa 2000 ký tự.'
  return ''
}
