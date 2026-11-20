import { useId, useState } from 'react'

const CAC_CAU_HOI = [
  {
    id: 've-lac-oi',
    cauHoi: 'Lạc Ơi dành cho ai?',
    traLoi: 'Lạc Ơi được xây dựng dành cho sinh viên, giảng viên và cán bộ trong trường. Dù bạn vừa làm mất một món đồ hay tình cờ nhặt được đồ của ai đó, đây là nơi để kết nối và tìm lại nhau.',
  },
  {
    id: 'mat-do',
    cauHoi: 'Tôi nên làm gì khi bị mất đồ?',
    traLoi: 'Vào Danh sách để tìm tin nhặt được. Nếu thấy đúng món đồ, chọn Yêu cầu nhận lại đồ, trả lời câu hỏi đối chiếu và gửi yêu cầu cho admin xét duyệt. Theo dõi kết quả tại Theo dõi yêu cầu; có thể bấm Hủy yêu cầu khi yêu cầu còn chờ duyệt và nút này hiển thị. Bạn cũng có thể đăng tin Báo mất; loại tin này không bắt buộc có ảnh.',
  },
  {
    id: 'nhat-duoc',
    cauHoi: 'Nếu nhặt được đồ, tôi có thể giúp như thế nào?',
    traLoi: 'Đăng tin Nhặt được với ít nhất 1 ảnh và trả lời các câu hỏi đối chiếu. Nếu thấy tin báo mất đúng món đồ, liên hệ chủ tin rồi chọn Tạo lịch hẹn trả đồ. Luồng trả đồ này không cần chọn bài nhặt được hay chờ admin duyệt.',
  },
  {
    id: 'nhan-lai',
    cauHoi: 'Cần lưu ý gì khi nhận lại hoặc trao trả đồ?',
    traLoi: 'Hai bên thống nhất giờ và địa điểm gặp trong trường. Sau khi giao nhận, người tạo lịch đưa mã 6 số cho người còn lại nhập để xác nhận hoàn tất. Cuộc hẹn hết hạn sau 8 giờ tính từ giờ hẹn; mỗi yêu cầu được tạo tối đa 2 cuộc hẹn.',
  },
  {
    id: 'tin-lien-quan',
    cauHoi: 'Đã bàn giao rồi thì bài đăng còn lại xử lý thế nào?',
    traLoi: 'Người gửi yêu cầu nhận đồ hoặc người tạo lịch trả đồ từ tin báo mất mở Chi tiết yêu cầu sau khi bàn giao thành công. Trong Cập nhật bài đăng liên quan, chọn đúng bài của mình để đánh dấu hoàn tất: bài báo mất nếu vừa nhận đồ, hoặc bài nhặt được nếu vừa trả đồ.',
  },
  {
    id: 'sua-xoa-tin',
    cauHoi: 'Tôi có thể sửa hoặc xóa tin đã hoàn tất không?',
    traLoi: 'Tin đã hoàn tất không thể chỉnh sửa. Chủ tin vẫn có thể bấm Xóa tin, nhập lý do rồi xác nhận. Lý do được lưu trong lịch sử tin đăng.',
  },
]

export default function useGioiThieu() {
  const maVung = useId()
  const [cauHoiDangMo, datCauHoiDangMo] = useState(null)

  function doiCauHoi(id) {
    datCauHoiDangMo((hienTai) => hienTai === id ? null : id)
  }

  return { cacCauHoi: CAC_CAU_HOI, cauHoiDangMo, doiCauHoi, maVung }
}
