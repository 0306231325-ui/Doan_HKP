import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../../services/api'
import { dinhDangNgay } from '../../danh-sach-do/hooks/xuLyDanhSachDo.js'

export default function useTinDaDang(nguoiDungId) {
  const [thamSo, datThamSo] = useSearchParams()
  const [lanTai, datLanTai] = useState(0)
  const [ketQua, datKetQua] = useState(null)
  const tuKhoa = (thamSo.get('tuKhoa') ?? '').trim()
  const trangNhap = Number(thamSo.get('trang'))
  const trang = Number.isSafeInteger(trangNhap) ? Math.max(1, Math.min(trangNhap, 1000000)) : 1
  const khoa = `${nguoiDungId}:${trang}:${lanTai}:${tuKhoa}`
  const dangTai = ketQua?.khoa !== khoa

  useEffect(function napTinDaDang() {
    const yeuCau = new AbortController()
    api.get('/me/tin-dang', { params: { trang, tuKhoa: tuKhoa || undefined }, signal: yeuCau.signal }).then(({ data }) => {
      if (yeuCau.signal.aborted) return
      const danhSachDo = data.data.map((tin) => ({ ...tin, time: dinhDangNgay(tin.date) }))
      datKetQua({ khoa, danhSachDo, meta: data.meta })
    }).catch(() => {
      if (!yeuCau.signal.aborted) datKetQua({ khoa, loiTai: 'Không tải được tin đã đăng. Vui lòng thử lại.' })
    })
    return () => yeuCau.abort()
  }, [khoa, trang, tuKhoa])

  function taiLai() {
    datLanTai((cu) => cu + 1)
  }

  function chuyenTrang(trangMoi) {
    datThamSo((cu) => {
      const moi = new URLSearchParams(cu)
      if (trangMoi === 1) moi.delete('trang')
      else moi.set('trang', String(trangMoi))
      return moi
    })
  }

  function timKiem(suKien) {
    suKien.preventDefault()
    const tuKhoaMoi = String(new FormData(suKien.currentTarget).get('tuKhoa') ?? '').trim()
    datThamSo(tuKhoaMoi ? { tuKhoa: tuKhoaMoi } : {}, { replace: true })
    if (tuKhoaMoi === tuKhoa && trang === 1) taiLai()
  }

  function xoaTimKiem() {
    datThamSo({}, { replace: true })
  }

  return { ...(dangTai ? {} : ketQua), dangTai, taiLai, chuyenTrang, tuKhoa, timKiem, xoaTimKiem }
}
