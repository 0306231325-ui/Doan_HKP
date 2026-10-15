import { FileText, FolderTree, HandHeart, LayoutDashboard, ListChecks } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const cacMucQuanTri = [
  { duongDan: '/admin', nhan: 'Tổng quan', bieuTuong: LayoutDashboard, ketThuc: true },
  { duongDan: '/admin/tin-dang', nhan: 'Duyệt tin đăng', bieuTuong: FileText },
  { duongDan: '/admin/yeu-cau', nhan: 'Yêu cầu nhận lại', bieuTuong: HandHeart },
  { duongDan: '/admin/danh-muc', nhan: 'Danh mục & địa điểm', bieuTuong: FolderTree },
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
