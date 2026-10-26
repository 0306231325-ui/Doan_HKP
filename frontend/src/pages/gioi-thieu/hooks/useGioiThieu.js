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
    traLoi: 'Hãy bắt đầu từ mục Tra cứu để tìm những tin nhặt được có thể liên quan đến món đồ của bạn. Bạn cũng có thể chọn Báo mất đồ để cung cấp thông tin về đồ vật, thời gian và khu vực làm mất.',
  },
  {
    id: 'nhat-duoc',
    cauHoi: 'Nếu nhặt được đồ, tôi có thể giúp như thế nào?',
    traLoi: 'Bạn có thể đăng tin nhặt được, mô tả đặc điểm nhận biết và khu vực tìm thấy. Hãy giữ lại một vài đặc điểm riêng để đối chiếu với người nhận, tránh công khai đầy đủ giấy tờ hoặc thông tin cá nhân của chủ sở hữu.',
  },
  {
    id: 'nhan-lai',
    cauHoi: 'Cần lưu ý gì khi nhận lại hoặc trao trả đồ?',
    traLoi: 'Hai bên nên đối chiếu kỹ đặc điểm đồ vật và thông tin liên quan trước khi trao trả. Ưu tiên hẹn ở nơi công cộng trong trường và không chia sẻ mật khẩu, mã OTP hoặc chuyển tiền theo yêu cầu từ người lạ.',
  },
]

export default function useGioiThieu() {
  const maVung = useId()
  const [cauHoiDangMo, datCauHoiDangMo] = useState(CAC_CAU_HOI[0].id)

  function doiCauHoi(id) {
    datCauHoiDangMo((hienTai) => hienTai === id ? null : id)
  }

  return { cacCauHoi: CAC_CAU_HOI, cauHoiDangMo, doiCauHoi, maVung }
}
