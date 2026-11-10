export function layTienDo(yc) {
  const duyet = yc.trang_thai === 'da_xac_minh'
  const cacHen = yc.cuoc_hen || []
  const hoanTat = duyet && (yc.tin_dang?.trang_thai === 'da_hoan_tat'
    || cacHen.some((h) => h.trang_thai === 'da_hoan_tat' || h.ban_giao?.thoi_gian_ban_giao))
  const coLich = duyet && cacHen.some((h) => ['cho_xac_nhan', 'da_xac_nhan'].includes(h.trang_thai))
  const tuChoi = ['tu_choi', 'da_huy'].includes(yc.trang_thai)
  const daDong = !duyet && yc.tin_dang?.trang_thai === 'da_hoan_tat'
  const tamDung = !duyet && !tuChoi && yc.tin_dang?.trang_thai === 'cho_ban_giao'
  return {
    soBuocXong: hoanTat ? 4 : coLich ? 3 : duyet ? 2 : 1,
    dungLai: tuChoi || daDong || tamDung,
    thongBao: tuChoi ? (yc.trang_thai === 'da_huy' ? 'Yêu cầu đã hủy.' : 'Yêu cầu bị từ chối.')
      : daDong ? 'Yêu cầu đã đóng vì đồ vật đã được trả cho người khác.'
        : tamDung ? 'Tạm dừng xét duyệt vì đồ vật đã có người được duyệt.' : '',
    tuChoi,
  }
}
