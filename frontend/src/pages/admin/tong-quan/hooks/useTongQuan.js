import { useMemo, useState } from 'react'
import { chuyenNgaySangISO, dinhDangNgay, kiemTraKhoangNgay, layNgayVietNam, taoThongKe } from './xuLyThongKe'

const danhSachMacDinh = []
const tatCaThoiGian = { tuNgay: '', denNgay: '' }

export default function useTongQuan(danhSachTinDang = danhSachMacDinh) {
  const [khoangDangXem, datKhoangDangXem] = useState(tatCaThoiGian)
  const [tuNgay, datTuNgay] = useState('')
  const [denNgay, datDenNgay] = useState('')
  const [loiKhoangNgay, datLoiKhoangNgay] = useState('')
  const homNay = layNgayVietNam(new Date())

  const thongKe = useMemo(
    () => taoThongKe(danhSachTinDang, khoangDangXem),
    [danhSachTinDang, khoangDangXem],
  )

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
    ...thongKe,
    tuNgay, denNgay, homNay, loiKhoangNgay,
    nhanKhoangThoiGian, doiTuNgay, doiDenNgay,
    apDungKhoangNgay, xoaKhoangNgay,
  }
}
