import { useState } from 'react'

export const CAC_TRANG_THAI = { cho_duyet: 'Chờ duyệt', hien_thi: 'Đang hiển thị', da_an: 'Đã ẩn' }

export default function useDuyetTinDang() {
  const [cacTin, datCacTin] = useState([])
  const [thongBao, datThongBao] = useState('')

  function xuLyTin(maTin, thaoTac, lyDo) {
    const thoiGian = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Bangkok', dateStyle: 'short', timeStyle: 'short' }).format(new Date())
    datCacTin((cu) => cu.map((tin) => tin.id !== maTin ? tin : {
      ...tin,
      trangThai: thaoTac.trangThai || tin.trangThai,
      baoCao: tin.baoCao.map((bc) => bc.id === thaoTac.maBaoCao ? { ...bc, trangThai: thaoTac.ketQua, ketQua: lyDo } : bc),
      lichSu: [{ hanhDong: thaoTac.nhan, lyDo, thoiGian }, ...tin.lichSu],
    }))
    datThongBao(`${thaoTac.nhan} thành công.`)
  }

  return { cacTin, thongBao, dongThongBao: () => datThongBao(''), xuLyTin }
}
