import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import api from '../../../services/api'
import { useAuth } from '../../../auth/useAuth'

export default function useChiTietTinDang(tinId) {
  const { user } = useAuth()
  const nguoiXem = user?.id || ''
  const [thamSo] = useSearchParams()
  const viTri = useLocation()
  const id = tinId ?? thamSo.get('id') ?? ''
  const hopLe = /^[1-9]\d{0,18}$/.test(id)
  const [lanTai, datLanTai] = useState(0)
  const khoa = `${id}#${lanTai}#${nguoiXem}`
  const [ketQua, datKetQua] = useState({ khoa: '', tin: null, loi: '' })
  const dangTai = hopLe && ketQua.khoa !== khoa
  const tin = hopLe && !dangTai ? ketQua.tin : null
  const loi = hopLe && !dangTai ? ketQua.loi : ''
  const noiQuayLai = viTri.state?.quayLai
  const quayLai = typeof noiQuayLai === 'string' && /^\/(?:\?|$|(?:danh-sach-do|trang-ca-nhan|tin-da-dang)(?:\?|$))/.test(noiQuayLai) ? noiQuayLai : '/danh-sach-do'

  useEffect(function napChiTiet() {
    window.scrollTo(0, 0)
    if (!hopLe) return
    const yeuCau = new AbortController()
    api.get(`/tra-cuu/${id}`, { signal: yeuCau.signal }).then(({ data }) => {
      if (!yeuCau.signal.aborted) datKetQua({ khoa, tin: data.data, loi: '' })
    }).catch((loiTai) => {
      if (!yeuCau.signal.aborted) datKetQua({ khoa, tin: null, loi: loiTai.response?.status === 404 ? '' : 'Không tải được tin đăng. Vui lòng thử lại.' })
    })
    return () => yeuCau.abort()
  }, [id, hopLe, khoa])

  function taiLai() {
    datLanTai((cu) => cu + 1)
  }

  return { tin, dangTai, loi, taiLai, quayLai }
}
