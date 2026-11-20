import HuongDanThaoTac from '../../components/shared/HuongDanThaoTac'
import { SO_ANH_TOI_DA } from './hooks/xuLyDangTin.js'

const CAC_BUOC_DANG_TIN = [
  ['Chọn thông tin ban đầu.', 'Chọn Báo mất hoặc Nhặt được, danh mục và nhập ít nhất số điện thoại hoặc email liên hệ.'],
  ['Điền thông tin đồ vật.', 'Nhập tiêu đề, ngày và vị trí cụ thể. Giờ và khu vực có thể để trống. Trả lời đầy đủ các câu hỏi đối chiếu bằng văn bản; có thể ghi kèm số.'],
  ['Thêm ảnh rõ nét.', `Tin nhặt được bắt buộc có ít nhất 1 ảnh; tin báo mất có thể không có ảnh. Tối đa ${SO_ANH_TOI_DA} ảnh JPG, PNG hoặc WebP, mỗi ảnh không quá 5 MB.`],
  ['Kiểm tra và đăng tin.', 'Bấm Xem trước tin đăng để kiểm tra nội dung công khai. Khi đã sẵn sàng, bấm Đăng tin rồi chọn Xác nhận đăng tin.'],
]

export default function HuongDanDangTin() {
  return (
    <HuongDanThaoTac
      goiY="Bạn có thể đọc hướng dẫn trước khi đăng tin."
      tieuDe="Hướng dẫn đăng tin"
      cacBuoc={CAC_BUOC_DANG_TIN}
      ghiChu="Câu trả lời đối chiếu được giữ kín. Hãy che thông tin cá nhân trên ảnh giấy tờ trước khi đăng."
    />
  )
}
