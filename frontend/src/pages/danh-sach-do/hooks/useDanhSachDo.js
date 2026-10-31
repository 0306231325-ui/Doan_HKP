import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../../services/api'
import { boLocBanDau, dinhDangNgay, docBoLoc, kiemTraNgay, taoThamSoTraCuu } from './xuLyDanhSachDo.js'

const PHAN_TRANG_RONG = { trangHienTai: 1, tongTrang: 1, tongTin: 0, tuViTri: 0, denViTri: 0 }

export default function useDanhSachDo() {
  const [thamSo, datThamSo] = useSearchParams()
  const [ketQuaBoLoc, datKetQuaBoLoc] = useState({ lan: -1, data: null, loi: '' })
  const [ketQua, datKetQua] = useState({ khoa: '', data: [], meta: PHAN_TRANG_RONG, loi: '' })
  const tuyChon = ketQuaBoLoc.data
  const [lanTai, datLanTai] = useState(0)
  const danhMuc = useMemo(() => [{ id: 'all', name: 'Tất cả danh mục' }, ...(tuyChon?.danhMuc ?? [])], [tuyChon])
  const diaDiem = useMemo(() => [{ id: 'all', name: 'Tất cả địa điểm' }, ...(tuyChon?.diaDiem ?? [])], [tuyChon])
  const boLoc = useMemo(() => docBoLoc(thamSo, danhMuc, diaDiem), [thamSo, danhMuc, diaDiem])
  const [tuKhoaNhap, datTuKhoaNhap] = useState(boLoc.tuKhoa)
  const [tuKhoaDaNap, datTuKhoaDaNap] = useState(boLoc.tuKhoa)
  const loiNgay = kiemTraNgay(boLoc.tuNgay, boLoc.denNgay)
  const chuoiTruyVan = taoThamSoTraCuu(boLoc, thamSo.get('trang'))
  const coBoLoc = Boolean(tuKhoaNhap) || Object.entries(boLoc).some(([ten, giaTri]) => ten !== 'sapXep' && giaTri !== boLocBanDau[ten])
  const khoaYeuCau = `${chuoiTruyVan}#${lanTai}`
  const dangTaiBoLoc = ketQuaBoLoc.lan !== lanTai
  const loiBoLoc = dangTaiBoLoc ? '' : ketQuaBoLoc.loi
  const loiTai = loiBoLoc || (ketQua.khoa === khoaYeuCau ? ketQua.loi : '')
  const dangTai = !loiNgay && !loiTai && (dangTaiBoLoc || ketQua.khoa !== khoaYeuCau)
  const phanTrang = loiNgay || loiTai || dangTai ? PHAN_TRANG_RONG : ketQua.meta
  const cacDoVat = loiNgay || loiTai || dangTai ? [] : ketQua.data.map((muc) => ({ ...muc, time: dinhDangNgay(muc.date) }))

  if (tuKhoaDaNap !== boLoc.tuKhoa) {
    datTuKhoaDaNap(boLoc.tuKhoa)
    datTuKhoaNhap(boLoc.tuKhoa)
  }

  useEffect(function napBoLoc() {
    const yeuCau = new AbortController()
    api.get('/tra-cuu/bo-loc', { signal: yeuCau.signal }).then(({ data }) => {
      if (!yeuCau.signal.aborted) datKetQuaBoLoc({ lan: lanTai, data, loi: '' })
    }).catch(() => {
      if (!yeuCau.signal.aborted) datKetQuaBoLoc((cu) => ({ ...cu, lan: lanTai, loi: 'Không tải được danh mục và địa điểm. Vui lòng thử lại.' }))
    })
    return () => yeuCau.abort()
  }, [lanTai])

  useEffect(function napTinDang() {
    if (!tuyChon || dangTaiBoLoc || loiBoLoc || loiNgay) return
    const yeuCau = new AbortController()
    api.get(`/tra-cuu?${chuoiTruyVan}`, { signal: yeuCau.signal }).then(({ data }) => {
      if (!yeuCau.signal.aborted) datKetQua({ ...data, khoa: khoaYeuCau, loi: '' })
    }).catch((loi) => {
      if (yeuCau.signal.aborted) return
      const chiTiet = loi.response?.status === 422 ? Object.values(loi.response.data.errors || {}).flat().join(' ') : ''
      datKetQua({ khoa: khoaYeuCau, data: [], meta: PHAN_TRANG_RONG, loi: chiTiet || 'Không tải được tin đăng. Vui lòng thử lại.' })
    })
    return () => yeuCau.abort()
  }, [tuyChon, dangTaiBoLoc, loiBoLoc, loiNgay, chuoiTruyVan, khoaYeuCau])

  function taiLai() {
    datLanTai((hienTai) => hienTai + 1)
  }

  function doiTuKhoaNhap(suKien) {
    datTuKhoaNhap(suKien.target.value)
  }

  function timKiem(suKien) {
    suKien.preventDefault()
    const tuKhoa = tuKhoaNhap.trim()
    datTuKhoaNhap(tuKhoa)
    doiBoLoc('tuKhoa', tuKhoa)
    if (tuKhoa === boLoc.tuKhoa) taiLai()
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

  return { ...phanTrang, cacDoVat, boLoc, tuKhoaNhap, coBoLoc, loiNgay, danhMuc, diaDiem, dangTai, loiTai, taiLai,
    doiBoLoc, doiTruongLoc, doiTuKhoaNhap, timKiem, chuyenTrang, xoaBoLoc }
}
