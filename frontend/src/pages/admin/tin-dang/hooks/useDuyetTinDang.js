import { useEffect, useState } from 'react'
import api, { prepareCsrf } from '../../../../services/api'

export const CAC_TRANG_THAI = { hien_thi: 'Đang hiển thị', da_an: 'Đã ẩn' }

function thongDiep(loi) {
  if (loi.response?.status === 401) return 'Bạn cần đăng nhập tài khoản quản trị.'
  if (loi.response?.status === 403) return 'Tài khoản không có quyền quản trị hoặc đã bị khóa.'
  return loi.response?.data?.message || 'Không kết nối được hệ thống. Vui lòng thử lại.'
}

export default function useDuyetTinDang() {
  const [cacTin, datCacTin] = useState([])
  const [thongBao, datThongBao] = useState('')
  const [loi, datLoi] = useState('')
  const [dangTai, datDangTai] = useState(true)
  const [dangLuu, datDangLuu] = useState(false)
  const [lanTai, datLanTai] = useState(0)
  useEffect(() => {
    if (!thongBao) return
    const boDem = window.setTimeout(() => datThongBao(''), 3500)
    return () => window.clearTimeout(boDem)
  }, [thongBao])
  useEffect(() => {
    const controller = new AbortController()
    api.get('/admin/tin-dang', { signal: controller.signal }).then(({ data }) => {
      if (!controller.signal.aborted) { datCacTin(data.data); datLoi(''); datDangTai(false) }
    }).catch((error) => {
      if (!controller.signal.aborted) { datLoi(thongDiep(error)); datDangTai(false) }
    })
    return () => controller.abort()
  }, [lanTai])

  async function xuLyTin(maTin, thaoTac, lyDo) {
    if (dangLuu) return false
    datDangLuu(true)
    datThongBao('')
    datLoi('')
    try {
      await prepareCsrf()
      const hanhDong = thaoTac.maBaoCao ? (thaoTac.ketQua === 'chap_nhan' ? 'chap_nhan_bao_cao' : 'tu_choi_bao_cao') : (thaoTac.trangThai === 'da_an' ? 'an_tin' : 'khoi_phuc')
      const { data } = await api.patch(`/admin/tin-dang/${maTin}`, { hanh_dong: hanhDong, ly_do: lyDo, bao_cao_id: thaoTac.maBaoCao })
      datCacTin((cu) => cu.map((tin) => tin.id === maTin ? data.data : tin))
      datThongBao(`${thaoTac.nhan} thành công.`)
      return true
    } catch (error) { datLoi(thongDiep(error)); return false }
    finally { datDangLuu(false) }
  }
  return { cacTin, thongBao, loi, dangTai, dangLuu, taiLai: () => { datDangTai(true); datLanTai((cu) => cu + 1) }, dongThongBao: () => datThongBao(''), xuLyTin }
}
