import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../../services/api'
import { dinhDangNgay } from '../../danh-sach-do/hooks/xuLyDanhSachDo.js'

export default function useTinDaDang(nguoiDungId) {
  const [thamSo, datThamSo] = useSearchParams()
  const [lanTai, datLanTai] = useState(0)
  const [ketQua, datKetQua] = useState(null)
  const trangNhap = Number(thamSo.get('trang'))
  const trang = Number.isSafeInteger(trangNhap) ? Math.max(1, Math.min(trangNhap, 1000000)) : 1
  const khoa = `${nguoiDungId}:${trang}:${lanTai}`
  const dangTai = ketQua?.khoa !== khoa

  useEffect(function napTinDaDang() {
    const yeuCau = new AbortController()
    api.get('/me/tin-dang', { params: { trang }, signal: yeuCau.signal }).then(({ data }) => {
      if (yeuCau.signal.aborted) return
      const danhSachDo = data.data.map((tin) => ({ ...tin, time: dinhDangNgay(tin.date) }))
      datKetQua({ khoa, danhSachDo, meta: data.meta })
    }).catch(() => {
      if (!yeuCau.signal.aborted) datKetQua({ khoa, loiTai: 'Không tải được tin đã đăng. Vui lòng thử lại.' })
    })
    return () => yeuCau.abort()
  }, [khoa, trang])

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

  return { ...(dangTai ? {} : ketQua), dangTai, taiLai, chuyenTrang }
}
