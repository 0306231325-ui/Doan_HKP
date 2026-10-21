import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { boLocBanDau, dinhDangNgay, docBoLoc, kiemTraNgay, locDoVat, phanTrangDoVat } from './xuLyDanhSachDo.js'

const danhMuc = [{ id: 'all', name: 'Tất cả danh mục' }]
const diaDiem = [{ id: 'all', name: 'Tất cả địa điểm' }]

export default function useDanhSachDo() {
  const [thamSo, datThamSo] = useSearchParams()
  const [doVatChon, datDoVatChon] = useState(null)
  const boLoc = useMemo(() => docBoLoc(thamSo, danhMuc, diaDiem), [thamSo])
  const [tuKhoaNhap, datTuKhoaNhap] = useState(boLoc.tuKhoa)
  const [tuKhoaDaNap, datTuKhoaDaNap] = useState(boLoc.tuKhoa)
  const ketQua = useMemo(() => locDoVat([], boLoc), [boLoc])
  const phanTrang = phanTrangDoVat(ketQua, thamSo.get('trang') || 1)
  const loiNgay = kiemTraNgay(boLoc.tuNgay, boLoc.denNgay)
  const coBoLoc = Boolean(tuKhoaNhap) || Object.entries(boLoc).some(([ten, giaTri]) => ten !== 'sapXep' && giaTri !== boLocBanDau[ten])
  const cacDoVat = phanTrang.cacDoVat.map((muc) => ({ ...muc, time: dinhDangNgay(muc.date) }))

  if (tuKhoaDaNap !== boLoc.tuKhoa) {
    datTuKhoaDaNap(boLoc.tuKhoa)
    datTuKhoaNhap(boLoc.tuKhoa)
  }

  function doiTuKhoaNhap(suKien) {
    datTuKhoaNhap(suKien.target.value)
  }

  function timKiem(suKien) {
    suKien.preventDefault()
    const tuKhoa = tuKhoaNhap.trim()
    datTuKhoaNhap(tuKhoa)
    doiBoLoc('tuKhoa', tuKhoa)
  }

  function doiBoLoc(ten, giaTri) {
    datThamSo((cu) => {
      const moi = new URLSearchParams(cu)
      if (giaTri === boLocBanDau[ten]) moi.delete(ten)
      else moi.set(ten, giaTri)
      moi.delete('trang')
      return moi
    }, { replace: true })
  }

  function doiTruongLoc(suKien) {
    doiBoLoc(suKien.target.name, suKien.target.value)
  }

  function chuyenTrang(trangMoi) {
    datThamSo((cu) => {
      const moi = new URLSearchParams(cu)
      moi.set('trang', String(Math.max(1, Math.min(trangMoi, phanTrang.tongTrang))))
      return moi
    })
  }

  function xoaBoLoc() {
    datTuKhoaNhap('')
    datThamSo({})
  }

  function moChiTiet(doVat) {
    datDoVatChon(doVat)
  }

  function dongChiTiet() {
    datDoVatChon(null)
  }

  return { ...phanTrang, cacDoVat, boLoc, tuKhoaNhap, coBoLoc, loiNgay, doVatChon, danhMuc, diaDiem,
    doiBoLoc, doiTruongLoc, doiTuKhoaNhap, timKiem, chuyenTrang, xoaBoLoc, moChiTiet, dongChiTiet }
}
