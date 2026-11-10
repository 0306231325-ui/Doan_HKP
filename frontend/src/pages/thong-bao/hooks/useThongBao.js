import { useEffect, useId, useRef, useState } from 'react'
import api, { prepareCsrf } from '../../../services/api'
import { layQuyenThongBao, xinQuyenThongBao } from './xuLyQuyenThongBao.js'

export default function useThongBao() {
  const [moBang, datMoBang] = useState(false)
  const [moLoiMoi, datMoLoiMoi] = useState(false)
  const [quyen, datQuyen] = useState(layQuyenThongBao)
  const [dangXinQuyen, datDangXinQuyen] = useState(false)
  const [loi, datLoi] = useState('')
  const [{ danhSach, soChuaDoc }, datHopThu] = useState({ danhSach: [], soChuaDoc: 0 })
  const [dangTai, datDangTai] = useState(true)
  const [loiHopThu, datLoiHopThu] = useState('')
  const [mucChoXoa, datMucChoXoa] = useState(null)
  const [dangXoa, datDangXoa] = useState(false)
  const [loiXoa, datLoiXoa] = useState('')
  const thamChieuKhung = useRef(null)
  const thamChieuChuong = useRef(null)
  const thamChieuBang = useRef(null)
  const dangXuLy = useRef(false)
  const phienHopThu = useRef(null)
  const maBang = useId()
  const maTieuDe = useId()

  useEffect(function khoiTaoHopThu() {
    const phien = new AbortController()
    phienHopThu.current = phien
    let yeuCauTai

    function taiThongBao() {
      yeuCauTai?.abort()
      yeuCauTai = new AbortController()
      const { signal } = yeuCauTai
      api.get('/thong-bao', { signal })
        .then(({ data }) => {
          if (signal.aborted) return
          datHopThu({ danhSach: data.data, soChuaDoc: data.soChuaDoc })
          datLoiHopThu('')
        }).catch(() => {
          if (!signal.aborted) datLoiHopThu('Chưa tải được thông báo. Bấm F5 để thử lại.')
        }).finally(() => {
          if (!signal.aborted) datDangTai(false)
        })
    }

    taiThongBao()
    window.addEventListener('yeu-cau-nhan-do:da-gui', taiThongBao)
    return function huyHopThu() {
      phien.abort()
      yeuCauTai?.abort()
      window.removeEventListener('yeu-cau-nhan-do:da-gui', taiThongBao)
    }
  }, [])

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
    if (!moBang || mucChoXoa) return
    thamChieuBang.current?.focus({ preventScroll: true })
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
  }, [moBang, mucChoXoa])

  function doiMoBang() {
    datQuyen(layQuyenThongBao())
    datMoBang((dangMo) => !dangMo)
  }

  function capNhatMucHopThu(id, xoa) {
    datHopThu((hopThu) => {
      const muc = hopThu.danhSach.find((muc) => muc.id === id)
      if (!muc) return hopThu
      return {
        danhSach: xoa ? hopThu.danhSach.filter((muc) => muc.id !== id)
          : hopThu.danhSach.map((muc) => muc.id === id ? { ...muc, daDoc: true } : muc),
        soChuaDoc: muc.daDoc ? hopThu.soChuaDoc : Math.max(0, hopThu.soChuaDoc - 1),
      }
    })
  }

  async function danhDauDaDoc(id) {
    const signal = phienHopThu.current?.signal
    if (!signal || signal.aborted) return
    try {
      await prepareCsrf()
      await api.patch(`/thong-bao/${id}/da-doc`, undefined, { signal })
      if (!signal.aborted) {
        capNhatMucHopThu(id, false)
        datLoiHopThu('')
      }
    } catch {
      if (!signal.aborted) datLoiHopThu('Chưa đánh dấu được thông báo. Vui lòng thử lại.')
    }
  }

  function moXacNhanXoa(muc = {}) {
    datLoiXoa('')
    datMucChoXoa(muc)
  }

  function dongXacNhanXoa() {
    if (!dangXoa) datMucChoXoa(null)
  }

  async function xacNhanXoa() {
    const signal = phienHopThu.current?.signal
    if (!mucChoXoa || dangXoa || !signal || signal.aborted) return
    const { id } = mucChoXoa
    datDangXoa(true)
    datLoiXoa('')
    try {
      await prepareCsrf()
      await api.delete(id ? `/thong-bao/${id}` : '/thong-bao', {
        signal,
        validateStatus: (status) => status === 204 || (Boolean(id) && status === 404),
      })
      if (!signal.aborted) {
        if (id) capNhatMucHopThu(id, true)
        else datHopThu({ danhSach: [], soChuaDoc: 0 })
        datMucChoXoa(null)
      }
    } catch {
      if (!signal.aborted) datLoiXoa('Chưa xóa được thông báo. Vui lòng thử lại.')
    } finally {
      if (!signal.aborted) datDangXoa(false)
    }
  }

  function dongBang() {
    datMoBang(false)
    thamChieuChuong.current?.focus()
  }

  function roiKhung(suKien) {
    if (!mucChoXoa && !suKien.currentTarget.contains(suKien.relatedTarget)) datMoBang(false)
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
    danhSach, soChuaDoc, dangTai, loiHopThu, danhDauDaDoc,
    mucChoXoa, dangXoa, loiXoa, moXacNhanXoa, dongXacNhanXoa, xacNhanXoa }
}
