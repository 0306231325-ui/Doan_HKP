import { useMemo, useState } from 'react'
import { docDanhSachDiaDiem, luuDanhSachDiaDiem, kiemTraDiaDiem, locDanhSachDiaDiem, phanTrangDiaDiem } from './xuLyDiaDiem.js'

export default function useQuanLyDiaDiem() {
  const [danhSach, datDanhSach] = useState(docDanhSachDiaDiem)
  const [tuKhoa, datTuKhoa] = useState('')
  const [trangThai, datTrangThai] = useState('tat_ca')
  const [trang, datTrang] = useState(1)
  const [bieuMau, datBieuMau] = useState(null)
  const [loiBieuMau, datLoiBieuMau] = useState({})
  const [loiLuu, datLoiLuu] = useState('')
  const [diaDiemDoiTrangThai, datDiaDiemDoiTrangThai] = useState(null)
  const [thongBao, datThongBao] = useState('')
  const ketQuaLoc = useMemo(() => locDanhSachDiaDiem(danhSach, tuKhoa, trangThai), [danhSach, tuKhoa, trangThai])
  const phanTrang = phanTrangDiaDiem(ketQuaLoc, trang)
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

  function moThemDiaDiem() {
    datBieuMau({ id: '', tenDiaDiem: '', moTa: '', dangHoatDong: true })
    datLoiBieuMau({})
    datLoiLuu('')
  }

  function moSuaDiaDiem(diaDiem) {
    datBieuMau({ ...diaDiem })
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
    if (!luuDanhSachDiaDiem(danhSachMoi)) {
      datLoiLuu('Chưa lưu được thay đổi trên thiết bị này. Vui lòng kiểm tra quyền lưu trữ hoặc thử lại.')
      return false
    }
    datDanhSach(danhSachMoi)
    return true
  }

  function luuDiaDiem(suKien) {
    suKien.preventDefault()
    const cacLoi = kiemTraDiaDiem(bieuMau, danhSach)
    datLoiBieuMau(cacLoi)
    if (Object.keys(cacLoi).length) return
    const laThemMoi = !bieuMau.id
    const diaDiem = {
      ...bieuMau,
      id: bieuMau.id || crypto.randomUUID(),
      tenDiaDiem: bieuMau.tenDiaDiem.trim().replace(/\s+/g, ' '),
      moTa: bieuMau.moTa.trim(),
    }
    const danhSachMoi = laThemMoi ? [...danhSach, diaDiem] : danhSach.map((muc) => muc.id === diaDiem.id ? diaDiem : muc)
    if (!ghiDanhSach(danhSachMoi)) return
    if (laThemMoi) {
      datTuKhoa('')
      datTrangThai('tat_ca')
      const viTri = locDanhSachDiaDiem(danhSachMoi, '', 'tat_ca').findIndex((muc) => muc.id === diaDiem.id)
      datTrang(Math.floor(viTri / 8) + 1)
    }
    datThongBao(`Đã ${laThemMoi ? 'thêm' : 'cập nhật'} địa điểm “${diaDiem.tenDiaDiem}”.`)
    dongBieuMau()
  }

  function moDoiTrangThai(diaDiem) {
    datDiaDiemDoiTrangThai(diaDiem)
    datLoiLuu('')
  }

  function dongDoiTrangThai() {
    datDiaDiemDoiTrangThai(null)
    datLoiLuu('')
  }

  function xacNhanDoiTrangThai() {
    const diaDiem = diaDiemDoiTrangThai
    const danhSachMoi = danhSach.map((muc) => muc.id === diaDiem.id ? { ...muc, dangHoatDong: !muc.dangHoatDong } : muc)
    if (!ghiDanhSach(danhSachMoi)) return
    datThongBao(`Đã ${diaDiem.dangHoatDong ? 'ngừng sử dụng' : 'mở lại'} địa điểm “${diaDiem.tenDiaDiem}”.`)
    dongDoiTrangThai()
  }

  function dongThongBao() {
    datThongBao('')
  }

  return {
    ...phanTrang, tuKhoa, trangThai, bieuMau, loiBieuMau, loiLuu, diaDiemDoiTrangThai, thongBao,
    tongDiaDiem: danhSach.length, soHoatDong, soNgungSuDung: danhSach.length - soHoatDong,
    doiTuKhoa, doiTrangThaiLoc, xoaBoLoc, chuyenTrang, moThemDiaDiem, moSuaDiaDiem,
    dongBieuMau, thayDoiBieuMau, luuDiaDiem, moDoiTrangThai, dongDoiTrangThai, xacNhanDoiTrangThai, dongThongBao,
  }
}
