import { useEffect, useMemo, useRef, useState } from 'react'
import { phanTrangDanhSach } from '../../../../components/shared/xuLyPhanTrang.js'
import { locNguoiDung } from './xuLyNguoiDung.js'
import api, { prepareCsrf } from '../../../../services/api'
import useThongBaoThaoTac from '../../../../components/shared/hooks/useThongBaoThaoTac'

export default function useQuanLyNguoiDung() {
  const [lanTai, datLanTai] = useState(0)
  const [nguon, datNguon] = useState({ lan: -1, data: [], loi: '' })
  const danhSach = nguon.data
  const dangTai = nguon.lan !== lanTai
  const loiTai = dangTai ? '' : nguon.loi
  const [dangLuu, datDangLuu] = useState(false)
  const khoaGui = useRef(false)
  const [lyDoKhoa, datLyDoKhoa] = useState('')
  const [loiLuu, datLoiLuu] = useState('')
  const hienThongBao = useThongBaoThaoTac()
  const [boLoc, datBoLoc] = useState({ tuKhoa: '', trangThai: 'tat_ca' })
  const [trang, datTrang] = useState(1)
  const [hopThoai, datHopThoai] = useState(null)
  const ketQua = useMemo(() => locNguoiDung(danhSach, boLoc), [danhSach, boLoc])
  const phanTrang = phanTrangDanhSach(ketQua, trang, 8)
  const nguoiDungChon = danhSach.find((nguoiDung) => nguoiDung.id === hopThoai?.id)
  const thongKe = {
    tong: danhSach.length,
    hoatDong: danhSach.filter((nguoiDung) => nguoiDung.trang_thai === 'hoat_dong').length,
    biKhoa: danhSach.filter((nguoiDung) => nguoiDung.trang_thai === 'bi_khoa').length,
  }

  useEffect(function napNguoiDung() {
    const yeuCau = new AbortController()
    api.get('/admin/nguoi-dung', { signal: yeuCau.signal }).then(({ data }) => {
      if (!yeuCau.signal.aborted) datNguon({ lan: lanTai, data: data.data, loi: '' })
    }).catch((loi) => {
      if (!yeuCau.signal.aborted) datNguon({ lan: lanTai, data: [], loi: loi.response?.data?.message || 'Không tải được người dùng. Vui lòng thử lại.' })
    })
    return () => yeuCau.abort()
  }, [lanTai])

  function taiLai() {
    datHopThoai(null)
    datLanTai((cu) => cu + 1)
  }

  async function xacNhanTrangThai(suKien) {
    suKien.preventDefault()
    if (khoaGui.current || !nguoiDungChon) return
    if (nguoiDungChon.trang_thai !== 'bi_khoa' && !lyDoKhoa.trim()) {
      datLoiLuu('Vui lòng nhập lý do khóa tài khoản.')
      return
    }
    khoaGui.current = true
    datDangLuu(true)
    datLoiLuu('')
    try {
      await prepareCsrf()
      const { data } = await api.patch(`/admin/nguoi-dung/${nguoiDungChon.id}/trang-thai`, {
        trang_thai: nguoiDungChon.trang_thai === 'bi_khoa' ? 'hoat_dong' : 'bi_khoa',
        trang_thai_hien_tai: nguoiDungChon.trang_thai,
        ly_do_khoa: lyDoKhoa.trim() || null,
      })
      datNguon((cu) => ({ ...cu, data: cu.data.map((muc) => muc.id === data.user.id ? data.user : muc) }))
      datHopThoai(null)
      hienThongBao(data.message, data.updated ? 'success' : 'info')
    } catch (loi) {
      const noiDung = Object.values(loi.response?.data?.errors || {}).flat().join(' ') || loi.response?.data?.message || 'Không lưu được trạng thái tài khoản. Vui lòng thử lại.'
      datLoiLuu(noiDung)
      if ([404, 409].includes(loi.response?.status)) {
        taiLai()
        hienThongBao(noiDung, 'error')
      }
    } finally {
      khoaGui.current = false
      datDangLuu(false)
    }
  }

  function doiBoLoc(suKien) {
    const { name, value } = suKien.target
    datBoLoc((hienTai) => ({ ...hienTai, [name]: value }))
    datTrang(1)
  }

  function xoaBoLoc() {
    datBoLoc({ tuKhoa: '', trangThai: 'tat_ca' })
    datTrang(1)
  }

  function chuyenTrang(trangMoi) {
    datTrang(Math.max(1, Math.min(trangMoi, phanTrang.tongTrang)))
  }

  function moChiTiet(nguoiDung) {
    if (khoaGui.current) return
    datHopThoai({ loai: 'chi_tiet', id: nguoiDung.id })
  }

  function dongChiTiet() {
    if (khoaGui.current) return
    datHopThoai(null)
  }

  function moDoiTrangThai(nguoiDung) {
    if (khoaGui.current || !nguoiDung.co_the_doi_trang_thai) return
    datLyDoKhoa('')
    datLoiLuu('')
    datHopThoai({ loai: 'trang_thai', id: nguoiDung.id, quayLaiChiTiet: hopThoai?.loai === 'chi_tiet' })
  }

  function dongDoiTrangThai() {
    if (khoaGui.current) return
    datHopThoai(hopThoai?.quayLaiChiTiet ? { loai: 'chi_tiet', id: hopThoai.id } : null)
  }

  return {
    ...phanTrang, cacNguoiDung: phanTrang.cacMuc, boLoc, thongKe, nguoiDungChon,
    dangTai, loiTai, taiLai, dangLuu, lyDoKhoa, datLyDoKhoa, loiLuu, xacNhanTrangThai,
    hopThoai, doiBoLoc, xoaBoLoc, chuyenTrang,
    moChiTiet, dongChiTiet, moDoiTrangThai, dongDoiTrangThai,
  }
}
