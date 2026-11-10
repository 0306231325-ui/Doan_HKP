import { useEffect, useState } from 'react'
import api from '../../../services/api'

export default function useChiTietYeuCau(id, lanTai = 0) {
  const [nguon, datNguon] = useState(null)
  const khoa = `${id}-${lanTai}`

  useEffect(() => {
    if (!id) return
    const abort = new AbortController()
    let dangTai = false

    async function tai() {
      if (dangTai) return
      dangTai = true
      try {
        const { data } = await api.get(`/me/yeu-cau/${id}`, { signal: abort.signal })
        if (!abort.signal.aborted) datNguon({ khoa, yc: data.data })
      } catch (loi) {
        if (abort.signal.aborted) return
        const khongTimThay = loi.response?.status === 404
        const thongBao = khongTimThay ? 'Không tìm thấy yêu cầu của bạn.' : 'Không tải được yêu cầu. Vui lòng thử lại.'
        datNguon((cu) => !khongTimThay && cu?.khoa === khoa && cu.yc ? cu : { khoa, loi: thongBao })
      } finally {
        dangTai = false
      }
    }

    tai()
    const timer = window.setInterval(tai, 15000)
    window.addEventListener('focus', tai)
    return () => {
      abort.abort()
      window.clearInterval(timer)
      window.removeEventListener('focus', tai)
    }
  }, [id, khoa])

  return { yc: nguon?.khoa === khoa ? nguon.yc : null, loi: nguon?.khoa === khoa ? nguon.loi : '' }
}
