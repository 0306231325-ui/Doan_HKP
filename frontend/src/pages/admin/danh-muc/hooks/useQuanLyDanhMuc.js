import { useMemo, useState } from 'react'
import { docDanhSachDanhMuc, luuDanhSachDanhMuc, kiemTraDanhMuc, locDanhSachDanhMuc, phanTrangDanhMuc } from './xuLyDanhMuc.js'

export default function useQuanLyDanhMuc() {
  const [danhSach, datDanhSach] = useState(docDanhSachDanhMuc)
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

  function ghiDanhSach(danhSachMoi) {
    if (!luuDanhSachDanhMuc(danhSachMoi)) {
      datLoiLuu('Chưa lưu được thay đổi trên thiết bị này. Vui lòng kiểm tra quyền lưu trữ hoặc thử lại.')
      return false
    }
    datDanhSach(danhSachMoi)
    return true
  }

  function luuDanhMuc(suKien) {
    suKien.preventDefault()
    const cacLoi = kiemTraDanhMuc(bieuMau, danhSach)
    datLoiBieuMau(cacLoi)
    if (Object.keys(cacLoi).length) return
    const laThemMoi = !bieuMau.id
    const danhMuc = {
      ...bieuMau,
      id: bieuMau.id || crypto.randomUUID(),
      tenDanhMuc: bieuMau.tenDanhMuc.trim().replace(/\s+/g, ' '),
      moTa: bieuMau.moTa.trim(),
    }
    const danhSachMoi = laThemMoi ? [...danhSach, danhMuc] : danhSach.map((muc) => muc.id === danhMuc.id ? danhMuc : muc)
    if (!ghiDanhSach(danhSachMoi)) return
    if (laThemMoi) {
      datTuKhoa('')
      datTrangThai('tat_ca')
      const viTri = locDanhSachDanhMuc(danhSachMoi, '', 'tat_ca').findIndex((muc) => muc.id === danhMuc.id)
      datTrang(Math.floor(viTri / 8) + 1)
    }
    datThongBao(`Đã ${laThemMoi ? 'thêm' : 'cập nhật'} danh mục “${danhMuc.tenDanhMuc}”.`)
    dongBieuMau()
  }

  function moDoiTrangThai(danhMuc) {
    datDanhMucDoiTrangThai(danhMuc)
    datLoiLuu('')
  }

  function dongDoiTrangThai() {
    datDanhMucDoiTrangThai(null)
    datLoiLuu('')
  }

  function xacNhanDoiTrangThai() {
    const danhMuc = danhMucDoiTrangThai
    const danhSachMoi = danhSach.map((muc) => muc.id === danhMuc.id ? { ...muc, dangHoatDong: !muc.dangHoatDong } : muc)
    if (!ghiDanhSach(danhSachMoi)) return
    datThongBao(`Đã ${danhMuc.dangHoatDong ? 'ngừng sử dụng' : 'mở lại'} danh mục “${danhMuc.tenDanhMuc}”.`)
    dongDoiTrangThai()
  }

  function dongThongBao() {
    datThongBao('')
  }

  return {
    ...phanTrang, tuKhoa, trangThai, bieuMau, loiBieuMau, loiLuu, danhMucDoiTrangThai, thongBao,
    tongDanhMuc: danhSach.length, soHoatDong, soNgungSuDung: danhSach.length - soHoatDong,
    doiTuKhoa, doiTrangThaiLoc, xoaBoLoc, chuyenTrang, moThemDanhMuc, moSuaDanhMuc,
    dongBieuMau, thayDoiBieuMau, luuDanhMuc, moDoiTrangThai, dongDoiTrangThai, xacNhanDoiTrangThai, dongThongBao,
  }
}
