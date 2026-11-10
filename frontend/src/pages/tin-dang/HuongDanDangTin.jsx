import HuongDanThaoTac from '../../components/shared/HuongDanThaoTac'
import { SO_ANH_TOI_DA } from './hooks/xuLyDangTin.js'

const CAC_BUOC_DANG_TIN = [
  ['Chọn thông tin ban đầu.', 'Chọn loại tin, danh mục và kiểm tra liên hệ ở bước đầu.'],
  ['Điền thông tin chính xác.', 'Trả lời các câu hỏi hiển thị và mô tả rõ đặc điểm, nơi và thời gian mất hoặc nhặt được đồ.'],
  ['Thêm ảnh rõ nét.', `Chọn tối đa ${SO_ANH_TOI_DA} ảnh JPG, PNG hoặc WebP, mỗi ảnh không quá 5 MB.`],
  ['Kiểm tra trước khi gửi.', 'Bấm Xem trước tin đăng để kiểm tra nội dung công khai.'],
]

export default function HuongDanDangTin() {
  return (
    <HuongDanThaoTac
      goiY="Bạn có thể đọc hướng dẫn trước khi đăng tin."
      tieuDe="Hướng dẫn đăng tin"
      cacBuoc={CAC_BUOC_DANG_TIN}
      ghiChu="Đăng thông tin trung thực và chỉ chia sẻ những thông tin cần thiết để liên hệ, nhận lại đồ."
    />
  )
}
