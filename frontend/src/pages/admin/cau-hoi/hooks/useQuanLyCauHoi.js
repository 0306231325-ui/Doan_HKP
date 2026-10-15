import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { docDanhSachDanhMuc } from '../../danh-muc/hooks/xuLyDanhMuc.js'
import { docDanhSachCauHoi, kiemTraCauHoi, locCauHoi, luuDanhSachCauHoi, taoBieuMau, taoCauHinh, taoPhienBanCauHoi } from './xuLyCauHoi.js'

export default function useQuanLyCauHoi() {
  const [danhMuc] = useState(docDanhSachDanhMuc)
  const [danhSach, datDanhSach] = useState(docDanhSachCauHoi)
  const [thamSo, datThamSo] = useSearchParams()
  const danhMucChon = danhMuc.find((muc) => muc.id === thamSo.get('danh_muc')) || danhMuc[0]
  const [tuKhoa, datTuKhoa] = useState('')
  const [trangThai, datTrangThai] = useState('tat_ca')
  const [bieuMau, datBieuMau] = useState(null)
  const [loi, datLoi] = useState({})
  const [loiLuu, datLoiLuu] = useState('')
  const [thongBao, datThongBao] = useState('')
  const [cauHoiDoiTrangThai, datCauHoiDoiTrangThai] = useState(null)
  const [lichSu, datLichSu] = useState(null)
  const [xemTruoc, datXemTruoc] = useState(false)
  const cacCauHoi = useMemo(() => locCauHoi(danhSach, danhMucChon?.id, tuKhoa, trangThai), [danhSach, danhMucChon?.id, tuKhoa, trangThai])
  const tongCauHoi = locCauHoi(danhSach, danhMucChon?.id).length

  function doiDanhMuc(suKien) {
    datThamSo({ danh_muc: suKien.target.value })
    datTuKhoa('')
    datTrangThai('tat_ca')
    datThongBao('')
  }

  function doiTuKhoa(suKien) {
    datTuKhoa(suKien.target.value)
  }

  function doiTrangThai(suKien) {
    datTrangThai(suKien.target.value)
  }

  function moThem() {
    if (!danhMucChon?.dangHoatDong) return
    datBieuMau({ ...taoBieuMau(danhMucChon.id), thuTu: Math.min(999, Math.max(0, ...locCauHoi(danhSach, danhMucChon.id).map((muc) => muc.thuTu)) + 1) })
    datLoi({})
    datLoiLuu('')
  }

  function moSua(cauHoi) {
    datBieuMau(structuredClone(cauHoi))
    datLoi({})
    datLoiLuu('')
  }

  function dongBieuMau() {
    datBieuMau(null)
    datLoiLuu('')
  }

  function doiBieuMau(suKien) {
    const { name, value } = suKien.target
    datBieuMau((cu) => ({ ...cu, [name]: value }))
    datLoi({})
    datLoiLuu('')
  }

  function doiCauHinh(loai, ten, giaTri) {
    datBieuMau((cu) => {
      let cauHinh = { ...cu.apDung[loai], [ten]: giaTri }
      if (ten === 'suDung') cauHinh = taoCauHinh(giaTri)
      if (ten === 'dungXacMinh') cauHinh = { ...cauHinh, congKhai: giaTri ? false : cauHinh.congKhai, batBuocNhanLai: giaTri ? cauHinh.batBuocNhanLai : false }
      return { ...cu, apDung: { ...cu.apDung, [loai]: cauHinh } }
    })
    datLoi({})
    datLoiLuu('')
  }

  function themLuaChon() {
    datBieuMau((cu) => ({ ...cu, luaChon: [...cu.luaChon, { id: crypto.randomUUID(), nhan: '' }] }))
    datLoi({})
  }

  function doiLuaChon(id, nhan) {
    datBieuMau((cu) => ({ ...cu, luaChon: cu.luaChon.map((muc) => muc.id === id ? { ...muc, nhan } : muc) }))
    datLoi({})
  }

  function xoaLuaChon(id) {
    datBieuMau((cu) => ({ ...cu, luaChon: cu.luaChon.filter((muc) => muc.id !== id) }))
    datLoi({})
  }

  function ghiDanhSach(danhSachMoi) {
    if (!luuDanhSachCauHoi(danhSachMoi)) {
      datLoiLuu('Chưa lưu được thay đổi. Vui lòng kiểm tra quyền lưu trữ của trình duyệt và thử lại.')
      return false
    }
    datDanhSach(danhSachMoi)
    return true
  }

  function luuCauHoi(suKien) {
    suKien.preventDefault()
    const cacLoi = kiemTraCauHoi(bieuMau, danhSach, danhMuc)
    datLoi(cacLoi)
    if (Object.keys(cacLoi).length) return
    try {
      const { danhSachMoi, cauHoi, daThayDoi } = taoPhienBanCauHoi(bieuMau, danhSach)
      if (daThayDoi && !ghiDanhSach(danhSachMoi)) return
      datThongBao(daThayDoi ? `Đã lưu câu hỏi “${cauHoi.nhanDangTin}”.${bieuMau.id ? ` Bản ${cauHoi.phienBan} đang được sử dụng; bản cũ được giữ trong lịch sử.` : ''}` : 'Câu hỏi không có thay đổi.')
      datTuKhoa('')
      datTrangThai('tat_ca')
      dongBieuMau()
    } catch (loiPhienBan) {
      datLoiLuu(loiPhienBan.message)
    }
  }

  function moDoiTrangThai(cauHoi) {
    datCauHoiDoiTrangThai(cauHoi)
    datLoiLuu('')
  }

  function dongDoiTrangThai() {
    datCauHoiDoiTrangThai(null)
    datLoiLuu('')
  }

  function xacNhanDoiTrangThai() {
    const cauHoi = cauHoiDoiTrangThai
    if (!cauHoi.dangHoatDong && !danhMucChon?.dangHoatDong) return
    if (!ghiDanhSach(danhSach.map((muc) => muc.id === cauHoi.id ? { ...muc, dangHoatDong: !muc.dangHoatDong } : muc))) return
    datThongBao(`Đã ${cauHoi.dangHoatDong ? 'ngừng sử dụng' : 'mở lại'} câu hỏi “${cauHoi.nhanDangTin}”.`)
    dongDoiTrangThai()
  }

  function moLichSu(cauHoi) {
    datLichSu(danhSach.filter((muc) => muc.maCauHoi === cauHoi.maCauHoi).sort((a, b) => b.phienBan - a.phienBan))
  }

  function dongLichSu() {
    datLichSu(null)
  }

  function moXemTruoc() {
    datXemTruoc(true)
  }

  function dongXemTruoc() {
    datXemTruoc(false)
  }

  function dongThongBao() {
    datThongBao('')
  }

  return { danhMuc, danhMucChon, danhSach, cacCauHoi, tongCauHoi, tuKhoa, trangThai, bieuMau, loi, loiLuu, thongBao, cauHoiDoiTrangThai, lichSu, xemTruoc,
    doiDanhMuc, doiTuKhoa, doiTrangThai, moThem, moSua, dongBieuMau, doiBieuMau, doiCauHinh, themLuaChon, doiLuaChon, xoaLuaChon, luuCauHoi,
    moDoiTrangThai, dongDoiTrangThai, xacNhanDoiTrangThai, moLichSu, dongLichSu, moXemTruoc, dongXemTruoc, dongThongBao }
}
