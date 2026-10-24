import { useState } from 'react'
import { MOCK_ITEMS } from '../../../../data/mockData'

export const CAC_TRANG_THAI = { cho_duyet: 'Chờ duyệt', hien_thi: 'Đang hiển thị', da_an: 'Đã ẩn' }

function taoTinMau() {
  return MOCK_ITEMS.map((tin, i) => ({ ...tin, nguoiDang: ['Nguyễn Minh Anh', 'Trần Đức Minh', 'Lê Thanh Hà'][i % 3], maSinhVien: `20210${148 + i}`, trangThai: ['hien_thi', 'cho_duyet', 'da_an', 'hien_thi', 'hien_thi', 'cho_duyet'][i], baoCao: [0, 2].includes(i) ? [{ id: i + 1, nguoiBaoCao: 'Phạm Hoàng Nam', lyDo: i === 0 ? 'Thông tin không chính xác' : 'Tin đăng trùng lặp', moTa: 'Nội dung có điểm chưa khớp với ảnh và một tin đã đăng trước đó. Nhờ quản trị viên đối chiếu với người đăng.', thoiGian: '23/10/2026, 14:30', trangThai: 'cho_xu_ly', anh: tin.imageUrl }] : [], lichSu: i === 2 ? [{ hanhDong: 'Ẩn tin', lyDo: 'Tạm ẩn để đối chiếu tin trùng lặp.', thoiGian: '23/10/2026, 15:00' }] : [] }))
}

export default function useDuyetTinDang() {
  const [cacTin, datCacTin] = useState(taoTinMau)
  const [thongBao, datThongBao] = useState('')

  function xuLyTin(maTin, thaoTac, lyDo) {
    const thoiGian = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Bangkok', dateStyle: 'short', timeStyle: 'short' }).format(new Date())
    datCacTin((cu) => cu.map((tin) => tin.id !== maTin ? tin : {
      ...tin,
      trangThai: thaoTac.trangThai || tin.trangThai,
      baoCao: tin.baoCao.map((bc) => bc.id === thaoTac.maBaoCao ? { ...bc, trangThai: thaoTac.ketQua, ketQua: lyDo } : bc),
      lichSu: [{ hanhDong: thaoTac.nhan, lyDo, thoiGian }, ...tin.lichSu],
    }))
    datThongBao(`${thaoTac.nhan} thành công trên dữ liệu mẫu.`)
  }
  return { cacTin, thongBao, dongThongBao: () => datThongBao(''), xuLyTin }
}
