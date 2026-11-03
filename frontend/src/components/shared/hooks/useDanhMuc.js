import { useEffect, useState } from 'react'
import api from '../../../services/api'

export default function useDanhMuc(quanTri = false) {
  const [lanTai, datLanTai] = useState(0)
  const [nguon, datNguon] = useState({ lan: -1, data: [], loi: '' })
  const dangTai = nguon.lan !== lanTai

  useEffect(function napDanhMuc() {
    const yeuCau = new AbortController()
    api.get(quanTri ? '/admin/danh-muc' : '/tra-cuu/bo-loc', { signal: yeuCau.signal }).then(({ data }) => {
      if (yeuCau.signal.aborted) return
      const danhSach = quanTri ? data.data : data.danhMuc.map((muc) => ({ id: muc.id, tenDanhMuc: muc.name, moTa: '', dangHoatDong: true }))
      datNguon({ lan: lanTai, data: danhSach, loi: '' })
    }).catch((loi) => {
      if (!yeuCau.signal.aborted) datNguon({ lan: lanTai, data: [], loi: loi.response?.data?.message || 'Không tải được danh mục. Vui lòng thử lại.' })
    })
    return () => yeuCau.abort()
  }, [lanTai, quanTri])

  function datDanhSach(giaTri) {
    datNguon((cu) => ({ ...cu, data: typeof giaTri === 'function' ? giaTri(cu.data) : giaTri }))
  }

  function taiLai() {
    datLanTai((cu) => cu + 1)
  }

  return { danhSach: nguon.data, datDanhSach, dangTai, loiTai: dangTai ? '' : nguon.loi, taiLai }
}
