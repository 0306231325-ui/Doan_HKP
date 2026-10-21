export function layQuyenThongBao(moiTruong = globalThis) {
  if (moiTruong.isSecureContext === false || typeof moiTruong.Notification?.requestPermission !== 'function') return 'khong_ho_tro'
  return ['default', 'granted', 'denied'].includes(moiTruong.Notification.permission) ? moiTruong.Notification.permission : 'default'
}

export async function xinQuyenThongBao(moiTruong = globalThis) {
  const quyen = layQuyenThongBao(moiTruong)
  if (quyen !== 'default') return quyen
  const ketQua = await moiTruong.Notification.requestPermission()
  return ['default', 'granted', 'denied'].includes(ketQua) ? ketQua : 'default'
}
