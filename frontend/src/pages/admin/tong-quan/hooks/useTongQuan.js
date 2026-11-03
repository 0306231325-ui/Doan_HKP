import { useMemo, useState } from 'react'
import { layNgayVietNam, taoKhoangThoiGian, taoThongKe, kiemTraKhoangNgay } from './xuLyThongKe'

const danhSachMacDinh = []

export default function useTongQuan(danhSachTinDang = danhSachMacDinh) {
  const [mocThoiGian, datMocThoiGian] = useState('tat_ca')
  const [khoangDangXem, datKhoangDangXem] = useState({ tuNgay: '', denNgay: '' })
  const [tuNgay, datTuNgay] = useState('')
  const [denNgay, datDenNgay] = useState('')
  const [loiKhoangNgay, datLoiKhoangNgay] = useState('')
  const homNay = layNgayVietNam(new Date())

  const thongKe = useMemo(
    () => taoThongKe(danhSachTinDang, khoangDangXem),
    [danhSachTinDang, khoangDangXem],
  )

  function chonMocThoiGian(suKien) {
    const mocMoi = suKien.target.value
    datMocThoiGian(mocMoi)
    datLoiKhoangNgay('')

    if (mocMoi === 'tuy_chinh') {
      const khoangGoiY = taoKhoangThoiGian('30_ngay', homNay)
      datTuNgay(khoangDangXem.tuNgay || khoangGoiY.tuNgay)
      datDenNgay(khoangDangXem.denNgay || homNay)
      return
    }

    datKhoangDangXem(taoKhoangThoiGian(mocMoi, homNay))
  }

  function doiTuNgay(suKien) {
    datTuNgay(suKien.target.value)
    datLoiKhoangNgay('')
  }

  function doiDenNgay(suKien) {
    datDenNgay(suKien.target.value)
    datLoiKhoangNgay('')
  }

  function apDungKhoangNgay(suKien) {
    suKien.preventDefault()
    const loi = kiemTraKhoangNgay(tuNgay, denNgay, homNay)
    datLoiKhoangNgay(loi)
    if (!loi) datKhoangDangXem({ tuNgay, denNgay })
  }

  const nhanKhoangThoiGian = khoangDangXem.tuNgay
    ? `${khoangDangXem.tuNgay.split('-').reverse().join('/')} – ${khoangDangXem.denNgay.split('-').reverse().join('/')}`
    : 'Tất cả thời gian'

  return {
    ...thongKe,
    mocThoiGian, tuNgay, denNgay, homNay, loiKhoangNgay,
    nhanKhoangThoiGian, chonMocThoiGian, doiTuNgay, doiDenNgay,
    apDungKhoangNgay,
  }
}
