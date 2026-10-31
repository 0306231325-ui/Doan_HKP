import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import api from '../../../services/api'

export default function useChiTietTinDang() {
  const [thamSo] = useSearchParams()
  const viTri = useLocation()
  const id = thamSo.get('id') || ''
  const hopLe = /^[1-9]\d{0,18}$/.test(id)
  const [lanTai, datLanTai] = useState(0)
  const khoa = `${id}#${lanTai}`
  const [ketQua, datKetQua] = useState({ khoa: '', tin: null, loi: '' })
  const dangTai = hopLe && ketQua.khoa !== khoa
  const tin = hopLe && !dangTai ? ketQua.tin : null
  const loi = hopLe && !dangTai ? ketQua.loi : ''
  const noiQuayLai = viTri.state?.quayLai
  const quayLai = typeof noiQuayLai === 'string' && /^\/(?:\?|$|danh-sach-do(?:\?|$))/.test(noiQuayLai) ? noiQuayLai : '/danh-sach-do'

  useEffect(function napChiTiet() {
    window.scrollTo(0, 0)
    if (!hopLe) return
    const yeuCau = new AbortController()
    api.get('/tra-cuu', { params: { tuKhoa: `TIN-${id}` }, signal: yeuCau.signal }).then(({ data }) => {
      if (!yeuCau.signal.aborted) datKetQua({ khoa, tin: data.data.find((muc) => String(muc.id) === id) || null, loi: '' })
    }).catch(() => {
      if (!yeuCau.signal.aborted) datKetQua({ khoa, tin: null, loi: 'Không tải được tin đăng. Vui lòng thử lại.' })
    })
    return () => yeuCau.abort()
  }, [id, hopLe, khoa])

  function taiLai() {
    datLanTai((cu) => cu + 1)
  }

  return { tin, dangTai, loi, taiLai, quayLai }
}
