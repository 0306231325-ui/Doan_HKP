import { useMemo, useState } from 'react'
import { phanTrangDoVat } from '../../../danh-sach-do/hooks/xuLyDanhSachDo.js'
import { locNguoiDung } from './xuLyNguoiDung.js'

export default function useQuanLyNguoiDung(danhSachBanDau = []) {
  const danhSach = useMemo(() => danhSachBanDau.filter((nguoiDung) => !nguoiDung.deleted_at), [danhSachBanDau])
  const [boLoc, datBoLoc] = useState({ tuKhoa: '', vaiTro: 'tat_ca', trangThai: 'tat_ca' })
  const [trang, datTrang] = useState(1)
  const [hopThoai, datHopThoai] = useState(null)
  const ketQua = useMemo(() => locNguoiDung(danhSach, boLoc), [danhSach, boLoc])
  const phanTrang = phanTrangDoVat(ketQua, trang, 8)
  const nguoiDungChon = danhSach.find((nguoiDung) => nguoiDung.id === hopThoai?.id)
  const thongKe = {
    tong: danhSach.length,
    hoatDong: danhSach.filter((nguoiDung) => nguoiDung.trang_thai === 'hoat_dong').length,
    biKhoa: danhSach.filter((nguoiDung) => nguoiDung.trang_thai === 'bi_khoa').length,
  }

  function doiBoLoc(suKien) {
    const { name, value } = suKien.target
    datBoLoc((hienTai) => ({ ...hienTai, [name]: value }))
    datTrang(1)
  }

  function xoaBoLoc() {
    datBoLoc({ tuKhoa: '', vaiTro: 'tat_ca', trangThai: 'tat_ca' })
    datTrang(1)
  }

  function chuyenTrang(trangMoi) {
    datTrang(Math.max(1, Math.min(trangMoi, phanTrang.tongTrang)))
  }

  function moChiTiet(nguoiDung) {
    datHopThoai({ loai: 'chi_tiet', id: nguoiDung.id })
  }

  function dongChiTiet() {
    datHopThoai(null)
  }

  function moDoiTrangThai(nguoiDung) {
    datHopThoai({ loai: 'trang_thai', id: nguoiDung.id, quayLaiChiTiet: hopThoai?.loai === 'chi_tiet' })
  }

  function dongDoiTrangThai() {
    datHopThoai(hopThoai?.quayLaiChiTiet ? { loai: 'chi_tiet', id: hopThoai.id } : null)
  }

  return {
    ...phanTrang, cacNguoiDung: phanTrang.cacDoVat, boLoc, thongKe, nguoiDungChon,
    hopThoai, doiBoLoc, xoaBoLoc, chuyenTrang,
    moChiTiet, dongChiTiet, moDoiTrangThai, dongDoiTrangThai,
  }
}
