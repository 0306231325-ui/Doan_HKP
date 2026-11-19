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
    traLoi: 'Vào Danh sách để tìm tin nhặt được. Nếu thấy đúng món đồ, chọn Yêu cầu nhận lại đồ, trả lời câu hỏi đối chiếu rồi xem kết quả ở Theo dõi yêu cầu. Bạn cũng có thể vào Đăng tin và chọn loại Báo mất.',
  },
  {
    id: 'nhat-duoc',
    cauHoi: 'Nếu nhặt được đồ, tôi có thể giúp như thế nào?',
    traLoi: 'Bạn có thể đăng tin nhặt được và dùng câu hỏi đối chiếu để giữ kín các đặc điểm nhận biết. Nếu thấy tin báo mất đúng món đồ, chọn Tôi đang giữ đồ này để gửi thông báo kèm tin nhặt được của bạn, hoặc chọn Tạo lịch hẹn trả đồ khi hai bên đã thống nhất lịch.',
  },
  {
    id: 'nhan-lai',
    cauHoi: 'Cần lưu ý gì khi nhận lại hoặc trao trả đồ?',
    traLoi: 'Hai bên đối chiếu đồ vật và thống nhất địa điểm công cộng trong trường. Sau khi giao nhận, người tạo lịch đưa mã bàn giao 6 số cho người còn lại để xác nhận. Giữ kín mật khẩu và mã OTP.',
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
