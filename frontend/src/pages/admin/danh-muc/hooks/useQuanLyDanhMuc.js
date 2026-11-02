import { useMemo, useRef, useState } from 'react'
import api, { prepareCsrf } from '../../../../services/api'
import useDanhMuc from '../../../../components/shared/hooks/useDanhMuc'
import { kiemTraDanhMuc, locDanhSachDanhMuc, phanTrangDanhMuc } from './xuLyDanhMuc.js'

export default function useQuanLyDanhMuc() {
  const { danhSach, datDanhSach, dangTai, loiTai, taiLai } = useDanhMuc(true)
  const [dangLuu, datDangLuu] = useState(false)
  const khoaGui = useRef(false)
  const [tuKhoa, datTuKhoa] = useState('')
  const [trangThai, datTrangThai] = useState('tat_ca')
  const [trang, datTrang] = useState(1)
  const [bieuMau, datBieuMau] = useState(null)
  const [loiBieuMau, datLoiBieuMau] = useState({})
  const [loiLuu, datLoiLuu] = useState('')
  const [danhMucDoiTrangThai, datDanhMucDoiTrangThai] = useState(null)
  const [thongBao, datThongBao] = useState('')
  const ketQuaLoc = useMemo(() => locDanhSachDanhMuc(danhSach, tuKhoa, trangThai), [danhSach, tuKhoa, trangThai])
  const phanTrang = phanTrangDanhMuc(ketQuaLoc, trang)
  const soHoatDong = danhSach.filter((muc) => muc.dangHoatDong).length

  function doiTuKhoa(suKien) {
    datTuKhoa(suKien.target.value)
    datTrang(1)
  }

  function doiTrangThaiLoc(suKien) {
    datTrangThai(suKien.target.value)
    datTrang(1)
  }

  function xoaBoLoc() {
    datTuKhoa('')
    datTrangThai('tat_ca')
    datTrang(1)
  }

  function chuyenTrang(trangMoi) {
    datTrang(Math.max(1, Math.min(trangMoi, phanTrang.tongTrang)))
  }

  function moThemDanhMuc() {
    datBieuMau({ id: '', tenDanhMuc: '', moTa: '', dangHoatDong: true })
    datLoiBieuMau({})
    datLoiLuu('')
  }

  function moSuaDanhMuc(danhMuc) {
    datBieuMau({ ...danhMuc })
    datLoiBieuMau({})
    datLoiLuu('')
  }

  function dongBieuMau() {
    if (khoaGui.current) return
    datBieuMau(null)
    datLoiBieuMau({})
    datLoiLuu('')
  }

  function thayDoiBieuMau(suKien) {
    const { name, value } = suKien.target
    datBieuMau((hienTai) => ({ ...hienTai, [name]: name === 'dangHoatDong' ? value === '1' : value }))
    datLoiBieuMau((hienTai) => ({ ...hienTai, [name]: '' }))
    datLoiLuu('')
  }

  async function luuDanhMuc(suKien) {
    suKien.preventDefault()
    if (khoaGui.current) return
    const cacLoi = kiemTraDanhMuc(bieuMau, danhSach)
    datLoiBieuMau(cacLoi)
    if (Object.keys(cacLoi).length) return
    khoaGui.current = true
    datDangLuu(true)
    datLoiLuu('')
    const laThemMoi = !bieuMau.id
    try {
      await prepareCsrf()
      const duLieu = { tenDanhMuc: bieuMau.tenDanhMuc, moTa: bieuMau.moTa }
      const { data } = laThemMoi ? await api.post('/admin/danh-muc', duLieu) : await api.put(`/admin/danh-muc/${bieuMau.id}`, duLieu)
      const danhMuc = data.data
      const danhSachMoi = laThemMoi ? [...danhSach, danhMuc] : danhSach.map((muc) => muc.id === danhMuc.id ? danhMuc : muc)
      datDanhSach(danhSachMoi)
      datTuKhoa('')
      datTrangThai('tat_ca')
      const viTri = locDanhSachDanhMuc(danhSachMoi, '', 'tat_ca').findIndex((muc) => muc.id === danhMuc.id)
      datTrang(Math.floor(viTri / 8) + 1)
      datThongBao(`Đã ${laThemMoi ? 'thêm' : 'cập nhật'} danh mục “${danhMuc.tenDanhMuc}”.`)
      datBieuMau(null)
    } catch (loi) {
      const cacLoi = loi.response?.data?.errors
      if (cacLoi) datLoiBieuMau(Object.fromEntries(Object.entries(cacLoi).map(([ten, noiDung]) => [ten, noiDung[0]])))
      else datLoiLuu(loi.response?.data?.message || 'Không lưu được danh mục. Vui lòng thử lại.')
    } finally {
      khoaGui.current = false
      datDangLuu(false)
    }
  }

  function moDoiTrangThai(danhMuc) {
    datDanhMucDoiTrangThai(danhMuc)
    datLoiLuu('')
  }

  function dongDoiTrangThai() {
    if (khoaGui.current) return
    datDanhMucDoiTrangThai(null)
    datLoiLuu('')
  }

  async function xacNhanDoiTrangThai() {
    if (khoaGui.current) return
    khoaGui.current = true
    datDangLuu(true)
    datLoiLuu('')
    const danhMuc = danhMucDoiTrangThai
    try {
      await prepareCsrf()
      const { data } = await api.patch(`/admin/danh-muc/${danhMuc.id}/trang-thai`, { dangHoatDong: !danhMuc.dangHoatDong, trangThaiHienTai: danhMuc.dangHoatDong })
      datDanhSach((cu) => cu.map((muc) => muc.id === data.data.id ? data.data : muc))
      datThongBao(`Đã ${data.data.dangHoatDong ? 'mở lại' : 'ngừng sử dụng'} danh mục “${data.data.tenDanhMuc}”.`)
      datDanhMucDoiTrangThai(null)
    } catch (loi) {
      const noiDung = loi.response?.data?.message || 'Không đổi được trạng thái. Vui lòng thử lại.'
      datLoiLuu(noiDung)
      if ([404, 409].includes(loi.response?.status)) {
        datDanhMucDoiTrangThai(null)
        datThongBao('Danh mục đã thay đổi. Danh sách đang được tải lại.')
        taiLai()
      }
    } finally {
      khoaGui.current = false
      datDangLuu(false)
    }
  }

  function dongThongBao() {
    datThongBao('')
  }

  return {
    ...phanTrang, dangTai, loiTai, taiLai, dangLuu, tuKhoa, trangThai, bieuMau, loiBieuMau, loiLuu, danhMucDoiTrangThai, thongBao,
    coBoLoc: Boolean(tuKhoa.trim()) || trangThai !== 'tat_ca',
    tongDanhMuc: danhSach.length, soHoatDong, soNgungSuDung: danhSach.length - soHoatDong,
    doiTuKhoa, doiTrangThaiLoc, xoaBoLoc, chuyenTrang, moThemDanhMuc, moSuaDanhMuc,
    dongBieuMau, thayDoiBieuMau, luuDanhMuc, moDoiTrangThai, dongDoiTrangThai, xacNhanDoiTrangThai, dongThongBao,
  }
}
