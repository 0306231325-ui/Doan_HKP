import { useEffect, useState } from 'react'
import api from '../../../../services/api'
import { chuyenNgaySangISO, dinhDangNgay, kiemTraKhoangNgay, layNgayVietNam } from './xuLyThongKe'

const tatCaThoiGian = { tuNgay: '', denNgay: '' }

export default function useTongQuan() {
  const [khoangDangXem, datKhoangDangXem] = useState(tatCaThoiGian)
  const [tuNgay, datTuNgay] = useState('')
  const [denNgay, datDenNgay] = useState('')
  const [loiKhoangNgay, datLoiKhoangNgay] = useState('')
  const [ketQua, datKetQua] = useState(null)
  const [homNay] = useState(() => layNgayVietNam(new Date()))
  const dangTai = ketQua?.khoang !== khoangDangXem

  useEffect(() => {
    const abort = new AbortController()
    api.get('/admin/tin-dang/thong-ke', {
      params: khoangDangXem.tuNgay ? khoangDangXem : undefined, signal: abort.signal,
    }).then(({ data }) => {
      if (!abort.signal.aborted) datKetQua({ khoang: khoangDangXem, thongKe: data.data })
    }).catch(() => {
      if (!abort.signal.aborted) datKetQua({ khoang: khoangDangXem, loi: 'Không tải được thống kê tin đăng.' })
    })
    return () => abort.abort()
  }, [khoangDangXem])

  function doiTuNgay(giaTri) {
    datTuNgay(giaTri)
    datLoiKhoangNgay('')
  }

  function doiDenNgay(giaTri) {
    datDenNgay(giaTri)
    datLoiKhoangNgay('')
  }

  function apDungKhoangNgay(suKien) {
    suKien.preventDefault()
    const tuNgayISO = chuyenNgaySangISO(tuNgay)
    const denNgayISO = chuyenNgaySangISO(denNgay)
    const loi = kiemTraKhoangNgay(tuNgayISO, denNgayISO, homNay)
    datLoiKhoangNgay(loi)
    if (loi) return

    datTuNgay(dinhDangNgay(tuNgayISO))
    datDenNgay(dinhDangNgay(denNgayISO))
    datKhoangDangXem({ tuNgay: tuNgayISO, denNgay: denNgayISO })
  }

  function xoaKhoangNgay() {
    datTuNgay('')
    datDenNgay('')
    datLoiKhoangNgay('')
    datKhoangDangXem(tatCaThoiGian)
  }

  const nhanKhoangThoiGian = khoangDangXem.tuNgay
    ? `${dinhDangNgay(khoangDangXem.tuNgay)} – ${dinhDangNgay(khoangDangXem.denNgay)}`
    : 'Tất cả thời gian'

  return {
    thongKe: ketQua?.thongKe, dangTai, loi: ketQua?.loi,
    tuNgay, denNgay, homNay, loiKhoangNgay,
    nhanKhoangThoiGian, doiTuNgay, doiDenNgay,
    apDungKhoangNgay, xoaKhoangNgay,
  }
}
