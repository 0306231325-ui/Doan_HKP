import { useEffect, useState } from 'react'
import api from '../../../services/api'

export default function useDanhSachYeuCauHen() {
  const [lanTai, datLanTai] = useState(0)
  const [nguon, datNguon] = useState({ lan: -1, danhSach: [], loi: '' })
  const dangTai = nguon.lan !== lanTai

  useEffect(function napYeuCau() {
    const yeuCau = new AbortController()
    const { signal } = yeuCau

    async function taiDanhSach() {
      try {
        const danhSach = []
        let trang = 1
        let trangCuoi
        do {
          const { data } = await api.get('/me/yeu-cau', { params: { page: trang }, signal })
          const ketQua = data.data
          danhSach.push(...ketQua.data.filter((muc) => muc.trang_thai === 'da_xac_minh' && muc.coTheDatLich))
          trangCuoi = ketQua.last_page
          trang += 1
        } while (trang <= trangCuoi && !signal.aborted)

        if (!signal.aborted) datNguon({ lan: lanTai, danhSach, loi: '' })
      } catch {
        if (!signal.aborted) datNguon({ lan: lanTai, danhSach: [], loi: 'Không tải được yêu cầu. Vui lòng thử lại.' })
      }
    }

    taiDanhSach()
    return () => yeuCau.abort()
  }, [lanTai])

  function taiLai() {
    datLanTai((cu) => cu + 1)
  }

  return { danhSach: nguon.danhSach, dangTai, loi: dangTai ? '' : nguon.loi, taiLai }
}
