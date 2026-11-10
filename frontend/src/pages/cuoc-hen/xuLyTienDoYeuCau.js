export function layTienDo(yc, xemLichHen = false) {
  if (yc.trang_thai === 'da_xac_minh') {
    const cacHen = yc.cuoc_hen || []
    const hoanTat = cacHen.some(daXacNhanBanGiao)
    const coLich = cacHen.some((h) => ['cho_xac_nhan', 'da_xac_nhan'].includes(h.trang_thai))
    if (xemLichHen) {
      return { soBuocXong: hoanTat ? 3 : coLich ? 1 : yc.coTheDatLich ? 0 : null }
    }
    return { soBuocXong: hoanTat ? 4 : coLich ? 3 : 2, dungLai: !coLich && !yc.coTheDatLich }
  }

  const tuChoi = ['tu_choi', 'da_huy'].includes(yc.trang_thai)
  const daDong = yc.tin_dang?.trang_thai === 'da_hoan_tat'
  const tamDung = yc.tin_dang?.trang_thai === 'cho_ban_giao'
  return {
    soBuocXong: xemLichHen ? null : 1,
    dungLai: tuChoi || daDong || tamDung,
    thongBao: tuChoi ? (yc.trang_thai === 'da_huy' ? 'Yêu cầu đã hủy.' : 'Yêu cầu bị từ chối.')
      : daDong ? 'Yêu cầu đã đóng vì đồ vật đã được trả cho người khác.'
        : tamDung ? 'Tạm dừng xét duyệt vì đồ vật đã có người được duyệt.' : '',
    tuChoi,
  }
}

function daXacNhanBanGiao(hen) {
  return hen.trang_thai === 'da_hoan_tat' || Boolean(hen.ban_giao?.thoi_gian_ban_giao)
}

export function nhanTrangThaiLichHen(hen) {
  if (daXacNhanBanGiao(hen)) return 'Xác nhận thành công'
  if (hen.trang_thai === 'da_huy') return 'Đã hủy'
  if (hen.dungMaBanGiao) return 'Chờ nhập mã'
  return hen.trang_thai === 'da_xac_nhan' ? 'Đã xác nhận lịch' : 'Chờ xác nhận lịch'
}
