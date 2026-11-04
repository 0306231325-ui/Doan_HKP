import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api, { prepareCsrf } from '../../../services/api'
import { kiemTraCauTraLoi } from '../../../components/shared/quyTacCauHoi.js'
import { layLoiGui } from '../../tin-dang/hooks/xuLyDangTin.js'

export default function useGuiYeuCauNhanDo() {
  const [thamSo] = useSearchParams()
  const id = thamSo.get('id') || ''
  const dieuHuong = useNavigate()
  const [lanTai, datLanTai] = useState(0)
  const khoa = `${id}#${lanTai}`
  const [nguon, datNguon] = useState({ khoa: '', data: null, loi: '' })
  const [cauTraLoi, datCauTraLoi] = useState({})
  const [loiNhan, datLoiNhan] = useState('')
  const [xacNhan, datXacNhan] = useState(false)
  const [moXacNhan, datMoXacNhan] = useState(false)
  const [loi, datLoi] = useState('')
  const [dangGui, datDangGui] = useState(false)
  const dangXuLy = useRef(false)
  const hopLe = /^[1-9]\d*$/.test(id)
  const dangTai = hopLe && nguon.khoa !== khoa
  const data = nguon.khoa === khoa ? nguon.data : null
  const cauHoi = data?.data || []

  useEffect(function napYeuCau() {
    window.scrollTo(0, 0)
    if (!hopLe) return
    const yeuCau = new AbortController()
    api.get(`/tin-dang/${id}/nhan-lai`, { signal: yeuCau.signal }).then(({ data: ketQua }) => {
      if (!yeuCau.signal.aborted) datNguon({ khoa, data: ketQua, loi: '' })
    }).catch((loiTai) => {
      if (!yeuCau.signal.aborted) datNguon({ khoa, data: null, loi: layLoiGui(loiTai) })
    })
    return () => yeuCau.abort()
  }, [id, hopLe, khoa])

  function taiLai() {
    datLanTai((cu) => cu + 1)
  }

  function doiCauTraLoi(suKien) {
    const { name, value } = suKien.target
    datCauTraLoi((cu) => ({ ...cu, [name]: value }))
    datLoi('')
  }

  function yeuCauGui(suKien) {
    suKien.preventDefault()
    if (dangXuLy.current || !data || data.daGui) return
    for (const cau of cauHoi) {
      const thongBao = kiemTraCauTraLoi(cau, cauTraLoi[cau.id])
      if (thongBao) { datLoi(thongBao); return }
    }
    if (!xacNhan) { datLoi('Vui lòng xác nhận thông tin cung cấp là đúng.'); return }
    datLoi('')
    datMoXacNhan(true)
  }

  function dongXacNhan() {
    if (!dangXuLy.current) datMoXacNhan(false)
  }

  async function guiYeuCau() {
    if (dangXuLy.current || !moXacNhan) return
    dangXuLy.current = true
    datDangGui(true)
    datLoi('')
    try {
      await prepareCsrf()
      const { data: ketQua } = await api.post(`/tin-dang/${id}/nhan-lai`, { loiNhan, xacNhan, cauTraLoi: cauHoi.map((cau) => ({ id: cau.id, giaTri: cauTraLoi[cau.id] })) })
      dieuHuong(`/chi-tiet-tin-dang?id=${id}`, { replace: true, state: { authMessage: ketQua.message, authType: 'success' } })
    } catch (loiGui) {
      datLoi(layLoiGui(loiGui))
    } finally {
      dangXuLy.current = false
      datDangGui(false)
    }
  }

  return { tin: data?.tin, daGui: data?.daGui, cauHoi, cauTraLoi, loiNhan, datLoiNhan, xacNhan, datXacNhan, moXacNhan, dongXacNhan, guiYeuCau, yeuCauGui, doiCauTraLoi, dangGui, loi, dangTai, loiTai: !hopLe ? 'Vui lòng chọn một tin nhặt được.' : nguon.khoa === khoa ? nguon.loi : '', taiLai }
}
