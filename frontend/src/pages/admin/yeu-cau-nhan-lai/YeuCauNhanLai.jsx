import { HandHeart } from 'lucide-react'
import ThongBaoTrong from '../../../components/shared/ThongBaoTrong'

export default function YeuCauNhanLai() {
  return (
    <ThongBaoTrong
      bieuTuong={HandHeart}
      tieuDe="Yêu cầu nhận lại và bàn giao"
      moTa="Danh sách yêu cầu sẽ hiển thị khi chức năng duyệt và bàn giao được kết nối."
    />
  )
}
