import { useEffect, useId, useRef, useState } from 'react'
import { layQuyenThongBao, xinQuyenThongBao } from './xuLyQuyenThongBao.js'

export default function useThongBao() {
  const [moBang, datMoBang] = useState(false)
  const [moLoiMoi, datMoLoiMoi] = useState(false)
  const [quyen, datQuyen] = useState(layQuyenThongBao)
  const [dangXinQuyen, datDangXinQuyen] = useState(false)
  const [loi, datLoi] = useState('')
  const thamChieuKhung = useRef(null)
  const thamChieuChuong = useRef(null)
  const thamChieuBang = useRef(null)
  const dangXuLy = useRef(false)
  const maBang = useId()
  const maTieuDe = useId()

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
    datMoBang((cu) => !cu)
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
    doiMoBang, dongBang, roiKhung, moHopThoaiMoi, dongLoiMoi, batThongBao }
}
