import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import api from '../../../services/api'
import { useAuth } from '../../../auth/useAuth'

export default function useChiTietTinDang() {
  const { user } = useAuth()
  const nguoiXem = user?.id || ''
  const [thamSo] = useSearchParams()
  const viTri = useLocation()
  const id = thamSo.get('id') || ''
  const hopLe = /^[1-9]\d{0,18}$/.test(id)
  const [lanTai, datLanTai] = useState(0)
  const khoa = `${id}#${lanTai}#${nguoiXem}`
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
    api.get(`/tra-cuu/${id}`, { signal: yeuCau.signal }).then(async ({ data }) => {
      const banTin = data.data
      if (nguoiXem) {
        try {
          const lienHe = await api.get(`/tin-dang/${id}/lien-he`, { signal: yeuCau.signal })
          banTin.contactPhone = lienHe.data.data.soDienThoai || ''
          banTin.contactEmail = lienHe.data.data.email || ''
          banTin.contactUnlocked = true
          banTin.hasClaim = lienHe.data.data.daGui
          banTin.canClaim = banTin.canClaim && !lienHe.data.data.laChuTin
        } catch (loiLienHe) {
          if (![401, 403, 404].includes(loiLienHe.response?.status) && !yeuCau.signal.aborted) banTin.contactError = 'Chưa tải được liên hệ. Vui lòng thử lại.'
        }
      }
      if (!yeuCau.signal.aborted) datKetQua({ khoa, tin: banTin, loi: '' })
    }).catch((loiTai) => {
      if (!yeuCau.signal.aborted) datKetQua({ khoa, tin: null, loi: loiTai.response?.status === 404 ? '' : 'Không tải được tin đăng. Vui lòng thử lại.' })
    })
    return () => yeuCau.abort()
  }, [id, hopLe, khoa, nguoiXem])

  function taiLai() {
    datLanTai((cu) => cu + 1)
  }

  return { tin, dangTai, loi, taiLai, quayLai }
}
