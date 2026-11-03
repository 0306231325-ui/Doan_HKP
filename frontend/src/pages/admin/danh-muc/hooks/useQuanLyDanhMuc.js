import { useRef, useState } from 'react'
import api, { prepareCsrf } from '../../../../services/api'
import useDanhMuc from '../../../../components/shared/hooks/useDanhMuc'
import useThongBaoThaoTac from '../../../../components/shared/hooks/useThongBaoThaoTac'
import { kiemTraDanhMuc } from './xuLyDanhMuc.js'

export default function useQuanLyDanhMuc() {
  const { danhSach, datDanhSach, dangTai, loiTai, taiLai } = useDanhMuc(true)
  const [bieuMau, datBieuMau] = useState(null)
  const [loiBieuMau, datLoiBieuMau] = useState({})
  const [dangLuu, datDangLuu] = useState(false)
  const [danhMucDangDoi, datDanhMucDangDoi] = useState('')
  const [thaoTacChoXacNhan, datThaoTacChoXacNhan] = useState(null)
  const [loiThaoTac, datLoiThaoTac] = useState('')
  const khoaGui = useRef(false)
  const hienThongBao = useThongBaoThaoTac()

  function moThemDanhMuc() {
    if (khoaGui.current) return
    datBieuMau({ tenDanhMuc: '', moTa: '' })
    datLoiBieuMau({})
  }

  function dongBieuMau() {
    if (khoaGui.current) return
    datBieuMau(null)
  }

  function thayDoiBieuMau(suKien) {
    const { name, value } = suKien.target
    datBieuMau((cu) => ({ ...cu, [name]: value }))
    datLoiBieuMau((cu) => ({ ...cu, [name]: '' }))
  }

  function yeuCauThemDanhMuc(suKien) {
    suKien.preventDefault()
    if (khoaGui.current) return
    const cacLoi = kiemTraDanhMuc(bieuMau, danhSach)
    datLoiBieuMau(cacLoi)
    if (Object.keys(cacLoi).length) return
    datLoiThaoTac('')
    datThaoTacChoXacNhan({ loai: 'them', danhMuc: { tenDanhMuc: bieuMau.tenDanhMuc.trim().replace(/\s+/g, ' '), moTa: bieuMau.moTa.trim() } })
  }

  function moXacNhanThaoTac(danhMuc, loai) {
    if (khoaGui.current) return
    datThaoTacChoXacNhan({ danhMuc, loai })
    datLoiThaoTac('')
  }

  function dongXacNhanThaoTac() {
    if (khoaGui.current) return
    datThaoTacChoXacNhan(null)
    datLoiThaoTac('')
  }

  async function xacNhanThaoTac() {
    if (khoaGui.current || !thaoTacChoXacNhan) return
    const { danhMuc, loai } = thaoTacChoXacNhan
    khoaGui.current = true
    if (loai === 'them') datDangLuu(true)
    else datDanhMucDangDoi(danhMuc.id)
    datLoiThaoTac('')
    try {
      await prepareCsrf()
      if (loai === 'them') {
        const { data } = await api.post('/admin/danh-muc', danhMuc)
        datDanhSach((cu) => [data.data, ...cu])
        datBieuMau(null)
        if (loiTai || dangTai) taiLai()
      } else if (loai === 'xoa') {
        await api.delete(`/admin/danh-muc/${danhMuc.id}`)
        datDanhSach((cu) => cu.filter((muc) => muc.id !== danhMuc.id))
      } else {
        const { data } = await api.patch(`/admin/danh-muc/${danhMuc.id}/trang-thai`, { dangHoatDong: loai === 'mo', trangThaiHienTai: danhMuc.dangHoatDong })
        datDanhSach((cu) => cu.map((muc) => muc.id === data.data.id ? data.data : muc))
      }
      datThaoTacChoXacNhan(null)
      hienThongBao(`Đã ${loai === 'them' ? 'thêm' : loai === 'xoa' ? 'xóa' : loai === 'mo' ? 'mở' : 'ẩn'} danh mục “${danhMuc.tenDanhMuc}”.`, 'success')
    } catch (loi) {
      const noiDung = loi.response?.data?.message || 'Không thực hiện được thao tác. Vui lòng thử lại.'
      if (loai === 'them' && loi.response?.data?.errors) {
        datLoiBieuMau(Object.fromEntries(Object.entries(loi.response.data.errors).map(([ten, noiDung]) => [ten, noiDung[0]])))
        datThaoTacChoXacNhan(null)
      } else if (loi.response?.status === 404 || (loi.response?.status === 409 && loai !== 'xoa')) {
        datThaoTacChoXacNhan(null)
        taiLai()
        hienThongBao(noiDung, 'error')
      } else datLoiThaoTac(noiDung)
    } finally {
      khoaGui.current = false
      datDanhMucDangDoi('')
      datDangLuu(false)
    }
  }

  return { danhSach, dangTai, loiTai, taiLai, bieuMau, loiBieuMau, dangLuu, danhMucDangDoi, thaoTacChoXacNhan, loiThaoTac, moXacNhanThaoTac, dongXacNhanThaoTac, xacNhanThaoTac, moThemDanhMuc, dongBieuMau, thayDoiBieuMau, yeuCauThemDanhMuc }
}
