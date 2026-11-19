import HuongDanThaoTac from '../../components/shared/HuongDanThaoTac'
import { SO_ANH_TOI_DA } from './hooks/xuLyDangTin.js'

const CAC_BUOC_DANG_TIN = [
  ['Chọn thông tin ban đầu.', 'Chọn loại tin, danh mục và kiểm tra liên hệ ở bước đầu.'],
  ['Điền thông tin đồ vật.', 'Mô tả đặc điểm, nơi và thời gian mất hoặc nhặt được đồ. Điền các câu trả lời đối chiếu theo danh mục đã chọn.'],
  ['Thêm ảnh rõ nét.', `Chọn tối đa ${SO_ANH_TOI_DA} ảnh JPG, PNG hoặc WebP, mỗi ảnh không quá 5 MB.`],
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
