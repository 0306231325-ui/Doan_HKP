import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useThongBaoThaoTac from '../../../components/shared/hooks/useThongBaoThaoTac'
import api, { prepareCsrf } from '../../../services/api'
import { layLoiGui } from '../../tin-dang/hooks/xuLyDangTin.js'

export default function useGiuDo(tinMatId, khiDong) {
  const hienThongBao = useThongBaoThaoTac()
  const dieuHuong = useNavigate()
  const [trang, datTrang] = useState(1)
  const [lanTai, datLanTai] = useState(0)
  const [ketQua, datKetQua] = useState(null)
  const [tinDaChon, datTinDaChon] = useState('')
  const [thaoTac, datThaoTac] = useState('')
  const [dangGui, datDangGui] = useState(false)
  const [loiGui, datLoiGui] = useState('')
  const khoaGui = useRef(false)
  const yeuCauHienTai = useRef(null)
  const url = `/tin-dang/${tinMatId}/giu-do`
  const khoa = `${tinMatId}:${trang}:${lanTai}`
  const dangTai = ketQua?.khoa !== khoa
  const tinXacNhan = dangTai ? null : ketQua.danhSach?.find((tin) => String(tin.id) === tinDaChon)

  useEffect(function napTinCoTheGui() {
    const yeuCau = new AbortController()
    yeuCauHienTai.current = yeuCau
    api.get(url, { params: { trang }, signal: yeuCau.signal }).then(({ data }) => {
      if (!yeuCau.signal.aborted) datKetQua({ khoa, danhSach: data.data, meta: data.meta })
    }).catch((loi) => {
      if (!yeuCau.signal.aborted) datKetQua({ khoa, loiTai: loi.response?.status < 500 && loi.response?.data?.message || 'Không tải được tin nhặt được. Vui lòng thử lại.' })
    })
    return () => yeuCau.abort()
  }, [khoa, trang, url])

  function chonTin(id) {
    datTinDaChon(id)
    datLoiGui('')
  }

  function chuyenTrang(trangMoi) {
    chonTin('')
    datTrang(trangMoi)
  }

  function taiLai() {
    chonTin('')
    datLanTai((cu) => cu + 1)
  }

  function dongHopThoai() {
    if (khoaGui.current) return
    datLoiGui('')
    datThaoTac(thaoTac ? '' : 'huy')
  }

  function moXacNhanGui(suKien) {
    suKien.preventDefault()
    if (!tinXacNhan || thaoTac || khoaGui.current) return
    datThaoTac('gui')
  }

  async function guiThongBao() {
    const signal = yeuCauHienTai.current?.signal
    if (thaoTac !== 'gui' || khoaGui.current || !tinXacNhan || !signal || signal.aborted) return
    khoaGui.current = true
    datDangGui(true)
    datLoiGui('')
    try {
      await prepareCsrf()
      const { data, status } = await api.post(url, { tinNhatId: tinDaChon }, { signal })
      if (!signal.aborted) {
        hienThongBao(data.message, status === 201 ? 'success' : 'info')
        khiDong()
        if (data.yeuCauId) dieuHuong(`/chi-tiet-yeu-cau?id=${data.yeuCauId}`)
      }
    } catch (loi) {
      if (!signal.aborted) datLoiGui(layLoiGui(loi))
    } finally {
      khoaGui.current = false
      if (!signal.aborted) datDangGui(false)
    }
  }

  return { ...(dangTai ? {} : ketQua), dangTai, tinDaChon, tinXacNhan, thaoTac, dangGui, loiGui, chonTin, chuyenTrang, taiLai, dongHopThoai, moXacNhanGui, guiThongBao }
}
