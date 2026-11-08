import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api, { prepareCsrf } from '../../../services/api'
import useAnhBieuMau from '../../../components/shared/hooks/useAnhBieuMau'
import { kiemTraCauTraLoi } from '../../../components/shared/quyTacCauHoi.js'
import { layLoiGui } from '../../tin-dang/hooks/xuLyDangTin.js'

const cacBuoc = ['/yeu-cau-nhan-do', '/yeu-cau-nhan-do/cau-hoi', '/yeu-cau-nhan-do/anh-va-loi-nhan']

export default function useGuiYeuCauNhanDo(id) {
  const { pathname } = useLocation()
  const buoc = cacBuoc.indexOf(pathname.toLowerCase().replace(/\/+$/, '')) + 1
  const dieuHuong = useNavigate()
  const anhBieuMau = useAnhBieuMau()
  const [lanTai, datLanTai] = useState(0)
  const khoa = `${id}#${lanTai}`
  const [nguon, datNguon] = useState({ khoa: '', data: null, loi: '' })
  const [cauTraLoi, datCauTraLoi] = useState({})
  const [loiNhan, datLoiNhan] = useState('')
  const [xacNhan, datXacNhan] = useState(false)
  const [buocDaMo, datBuocDaMo] = useState(1)
  const [moXacNhan, datMoXacNhan] = useState(false)
  const [loi, datLoi] = useState('')
  const [dangGui, datDangGui] = useState(false)
  const dangXuLy = useRef(false)
  const hopLe = /^[1-9]\d*$/.test(id)
  const dangTai = hopLe && nguon.khoa !== khoa
  const data = nguon.khoa === khoa ? nguon.data : null
  const cauHoi = data?.data || []
  const duongDanBuoc = cacBuoc.map((duongDan) => `${duongDan}?id=${id}`)
  const duongDanVeBuoc = hopLe && (buoc < 1 || buoc > buocDaMo) ? duongDanBuoc[buoc < 1 ? 0 : buocDaMo - 1] : null

  useEffect(function napYeuCau() {
    window.scrollTo(0, 0)
    if (!hopLe) return
    const yeuCau = new AbortController()
    api.get(`/tin-dang/${id}/nhan-lai`, { signal: yeuCau.signal }).then(({ data: ketQua }) => {
      if (!yeuCau.signal.aborted) datNguon({ khoa, data: ketQua, loi: '' })
    }).catch((loiTai) => {
      if (!yeuCau.signal.aborted) datNguon({ khoa, data: null, loi: layLoiGui(loiTai), maLoi: loiTai.response?.status })
    })
    return () => yeuCau.abort()
  }, [id, hopLe, khoa])

  function taiLai() {
    datLanTai((cu) => cu + 1)
  }

  function doiCauTraLoi(suKien) {
    const { name, value } = suKien.target
    datCauTraLoi((cu) => ({ ...cu, [name]: value }))
    datBuocDaMo(2)
    datMoXacNhan(false)
    datLoi('')
  }

  function yeuCauGui(suKien) {
    suKien.preventDefault()
    if (dangXuLy.current || !data || data.daGui || duongDanVeBuoc) return
    if (buoc === 1) {
      datLoi('')
      datBuocDaMo((cu) => Math.max(cu, 2))
      dieuHuong(duongDanBuoc[1])
      return
    }

    for (const cau of cauHoi) {
      const thongBao = kiemTraCauTraLoi(cau, cauTraLoi[cau.id])
      if (thongBao) {
        if (buoc === 3) dieuHuong(duongDanBuoc[1], { replace: true })
        datLoi(thongBao)
        return
      }
    }
    if (buoc === 2) {
      datLoi('')
      datBuocDaMo(3)
      dieuHuong(duongDanBuoc[2])
      return
    }

    if (!xacNhan) { datLoi('Vui lòng xác nhận thông tin cung cấp là đúng.'); return }
    datLoi('')
    datMoXacNhan(true)
  }

  function quayLaiBuocTruoc() {
    datLoi('')
    datMoXacNhan(false)
    dieuHuong(duongDanBuoc[buoc - 2], { replace: true })
  }

  function dongXacNhan() {
    if (!dangXuLy.current) datMoXacNhan(false)
  }

  async function guiYeuCau() {
    if (dangXuLy.current || !moXacNhan || buoc !== 3) return
    dangXuLy.current = true
    datDangGui(true)
    datLoi('')
    try {
      const mau = new FormData()
      mau.append('xacNhan', xacNhan ? '1' : '0')
      mau.append('loiNhan', loiNhan)
      mau.append('cauTraLoi', JSON.stringify(cauHoi.map((cau) => ({ id: cau.id, giaTri: cauTraLoi[cau.id] }))))
      anhBieuMau.anh.forEach(({ tep }) => mau.append('anh[]', tep))
      await prepareCsrf()
      const { data: ketQua, status } = await api.post(`/tin-dang/${id}/nhan-lai`, mau, { headers: { 'Content-Type': undefined } })
      if (status === 201) window.dispatchEvent(new Event('thong-bao:cap-nhat'))
      const authAction = ketQua.yeuCauId ? { to: `/chi-tiet-yeu-cau?id=${ketQua.yeuCauId}`, label: 'Xem trạng thái yêu cầu' } : undefined
      dieuHuong('/theo-doi-yeu-cau', { replace: true, state: { authMessage: ketQua.message, authType: 'success', authAction } })
    } catch (loiGui) {
      datLoi(layLoiGui(loiGui))
    } finally {
      dangXuLy.current = false
      datDangGui(false)
    }
  }

  const loiTai = !hopLe ? 'Vui lòng chọn một tin nhặt được.' : nguon.khoa === khoa ? nguon.loi : ''
  const coTheTaiLai = hopLe && nguon.maLoi !== 409
  return { idTin: hopLe ? id : null, tin: data?.tin, daGui: data?.daGui, yeuCauId: data?.yeuCauId, cauHoi, cauTraLoi, anhBieuMau, loiNhan, datLoiNhan, xacNhan, datXacNhan, buoc, duongDanVeBuoc, quayLaiBuocTruoc, moXacNhan: buoc === 3 && moXacNhan, dongXacNhan, guiYeuCau, yeuCauGui, doiCauTraLoi, dangGui, loi, dangTai, loiTai, coTheTaiLai, taiLai }
}
