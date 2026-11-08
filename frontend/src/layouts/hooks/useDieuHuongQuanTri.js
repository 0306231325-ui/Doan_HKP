import { FileText, FolderTree, HandHeart, LayoutDashboard, ListChecks, MapPin, UsersRound } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const cacMucQuanTri = [
  { duongDan: '/admin', nhan: 'Tổng quan', bieuTuong: LayoutDashboard, ketThuc: true },
  { duongDan: '/admin/tin-dang', nhan: 'Duyệt tin đăng', bieuTuong: FileText },
  { duongDan: '/admin/yeu-cau', nhan: 'Yêu cầu nhận lại', bieuTuong: HandHeart },
  { duongDan: '/admin/nguoi-dung', nhan: 'Quản lý người dùng', bieuTuong: UsersRound },
  { duongDan: '/admin/danh-muc', nhan: 'Quản lý danh mục', bieuTuong: FolderTree },
  { duongDan: '/admin/dia-diem', nhan: 'Quản lý địa điểm', bieuTuong: MapPin },
  { duongDan: '/admin/cau-hoi', nhan: 'Bộ câu hỏi', bieuTuong: ListChecks },
]

export default function useDieuHuongQuanTri() {
  const { pathname: duongDanHienTai } = useLocation()

  function kiemTraMucHienTai({ duongDan, ketThuc }) {
    return ketThuc
      ? duongDanHienTai === duongDan || duongDanHienTai === `${duongDan}/`
      : duongDanHienTai === duongDan || duongDanHienTai.startsWith(`${duongDan}/`)
  }

  const mucHienTai = cacMucQuanTri.find(kiemTraMucHienTai) || cacMucQuanTri[0]

  return { cacMucQuanTri, mucHienTai }
}
