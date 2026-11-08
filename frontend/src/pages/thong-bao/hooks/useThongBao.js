import { useCallback, useEffect, useId, useRef, useState } from 'react'
import api, { prepareCsrf } from '../../../services/api'
import { layQuyenThongBao, xinQuyenThongBao } from './xuLyQuyenThongBao.js'

export default function useThongBao() {
  const [moBang, datMoBang] = useState(false)
  const [moLoiMoi, datMoLoiMoi] = useState(false)
  const [quyen, datQuyen] = useState(layQuyenThongBao)
  const [dangXinQuyen, datDangXinQuyen] = useState(false)
  const [loi, datLoi] = useState('')
  const [danhSach, datDanhSach] = useState([])
  const [soChuaDoc, datSoChuaDoc] = useState(0)
  const [dangTai, datDangTai] = useState(true)
  const [loiHopThu, datLoiHopThu] = useState('')
  const [dangDanhDauTatCa, datDangDanhDauTatCa] = useState(false)
  const thamChieuKhung = useRef(null)
  const thamChieuChuong = useRef(null)
  const thamChieuBang = useRef(null)
  const dangXuLy = useRef(false)
  const yeuCauTai = useRef(null)
  const phienHopThu = useRef(null)
  const maBang = useId()
  const maTieuDe = useId()

  const taiThongBao = useCallback(function taiThongBao() {
    yeuCauTai.current?.abort()
    const yeuCau = new AbortController()
    yeuCauTai.current = yeuCau
    return api.get('/thong-bao', { signal: yeuCau.signal })
      .then(({ data }) => {
        if (yeuCau.signal.aborted) return
        datDanhSach(data.data)
        datSoChuaDoc(data.soChuaDoc)
        datLoiHopThu('')
      }).catch(() => {
        if (!yeuCau.signal.aborted) datLoiHopThu('Chưa tải được thông báo. Vui lòng thử lại.')
      }).finally(() => {
        if (!yeuCau.signal.aborted) datDangTai(false)
      })
  }, [])

  useEffect(function khoiTaoHopThu() {
    const phien = new AbortController()
    phienHopThu.current = phien
    taiThongBao()
    window.addEventListener('focus', taiThongBao)
    return function huyHopThu() {
      phien.abort()
      yeuCauTai.current?.abort()
      window.removeEventListener('focus', taiThongBao)
    }
  }, [taiThongBao])

  useEffect(function theoDoiQuyen() {
    function capNhatQuyen() {
      datQuyen(layQuyenThongBao())
    }
    window.addEventListener('focus', capNhatQuyen)
    document.addEventListener('visibilitychange', capNhatQuyen)
    return function huyTheoDoiQuyen() {
      window.removeEventListener('focus', capNhatQuyen)
      document.removeEventListener('visibilitychange', capNhatQuyen)
    }
  }, [])

  useEffect(function theoDoiBang() {
    if (!moBang) return
    thamChieuBang.current?.focus()
    function nhanNgoaiBang(suKien) {
      if (!thamChieuKhung.current?.contains(suKien.target)) datMoBang(false)
    }
    function nhanPhimDong(suKien) {
      if (suKien.key === 'Escape') {
        datMoBang(false)
        thamChieuChuong.current?.focus()
      }
    }
    document.addEventListener('pointerdown', nhanNgoaiBang)
    document.addEventListener('keydown', nhanPhimDong)
    return function huyTheoDoiBang() {
      document.removeEventListener('pointerdown', nhanNgoaiBang)
      document.removeEventListener('keydown', nhanPhimDong)
    }
  }, [moBang])

  function doiMoBang() {
    datQuyen(layQuyenThongBao())
    if (!moBang) taiThongBao()
    datMoBang(!moBang)
  }

  async function danhDauDaDoc(id) {
    const signal = phienHopThu.current?.signal
    if (!signal || signal.aborted) return
    if (!id) datDangDanhDauTatCa(true)
    try {
      await prepareCsrf()
      await api.patch(id ? `/thong-bao/${id}/da-doc` : '/thong-bao/da-doc', undefined, { signal })
      if (!signal.aborted) await taiThongBao()
    } catch {
      if (!signal.aborted) datLoiHopThu('Chưa đánh dấu được thông báo. Vui lòng thử lại.')
    } finally {
      if (!id && !signal.aborted) datDangDanhDauTatCa(false)
    }
  }

  function dongBang() {
    datMoBang(false)
    thamChieuChuong.current?.focus()
  }

  function roiKhung(suKien) {
    if (!suKien.currentTarget.contains(suKien.relatedTarget)) datMoBang(false)
  }

  function moHopThoaiMoi() {
    datMoBang(false)
    datQuyen(layQuyenThongBao())
    datLoi('')
    datMoLoiMoi(true)
  }

  function dongLoiMoi() {
    datMoLoiMoi(false)
    datLoi('')
    requestAnimationFrame(() => thamChieuChuong.current?.focus())
  }

  async function batThongBao() {
    if (dangXuLy.current) return
    dangXuLy.current = true
    datDangXinQuyen(true)
    datLoi('')
    try {
      const ketQua = await xinQuyenThongBao()
      datQuyen(ketQua)
      if (ketQua === 'default') datLoi('Bạn chưa chọn cho phép. Có thể thử lại khi sẵn sàng.')
    } catch {
      datLoi('Chưa thể xin quyền thông báo. Vui lòng thử lại hoặc kiểm tra cài đặt trình duyệt.')
    } finally {
      dangXuLy.current = false
      datDangXinQuyen(false)
    }
  }

  return { moBang, moLoiMoi, quyen, dangXinQuyen, loi, thamChieuKhung, thamChieuChuong, thamChieuBang, maBang, maTieuDe,
    doiMoBang, dongBang, roiKhung, moHopThoaiMoi, dongLoiMoi, batThongBao,
    danhSach, soChuaDoc, dangTai, loiHopThu, dangDanhDauTatCa, taiThongBao, danhDauDaDoc }
}
