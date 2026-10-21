import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ShieldCheck, CircleCheck } from 'lucide-react'
import { MOCK_ITEMS } from '../../data/mockData'
import ThongTinDoNhanLai from '../../components/danh-sach-do/ThongTinDoNhanLai'
import FormYeuCauNhanDo from '../../components/danh-sach-do/FormYeuCauNhanDo'
import './yeu-cau-nhan-do.css'

export default function YeuCauNhanDo() {
  const [params] = useSearchParams()
  const itemId = params.get('id')
  const item = itemId === null ? MOCK_ITEMS.find((entry) => entry.type === 'found') : MOCK_ITEMS.find((entry) => String(entry.id) === itemId && entry.type === 'found')

  if (!item) return <section className="claim-card claim-empty"><h1>Không tìm thấy đồ vật phù hợp</h1><p>Vui lòng chọn một tin nhặt được để gửi yêu cầu nhận lại đồ.</p><Link to="/">Về trang chủ</Link></section>
  return <NoiDungYeuCau key={item.id} item={item} />
}

function NoiDungYeuCau({ item }) {
  const [submitted, setSubmitted] = useState(false)
  return (
    <div className="claim-page">
      <Link to="/" className="claim-back">← Quay lại danh sách đồ thất lạc</Link>
      <header className="claim-heading"><span className="claim-eyebrow"><ShieldCheck size={16} /> KẾT NỐI ĐÚNG CHỦ NHÂN</span><h1>Yêu cầu nhận lại đồ</h1><p>Chỉ một vài thông tin để đưa món đồ trở về với bạn.</p></header>
      <ol className="claim-steps" aria-label="Quy trình nhận đồ"><li className="current"><span>1</span>Gửi yêu cầu</li><li><span>2</span>Chờ xác minh</li><li><span>3</span>Nhận lại đồ</li></ol>
      <div className="claim-grid">
        <ThongTinDoNhanLai item={item} />
        {submitted ? <section className="claim-card claim-success" role="status"><CircleCheck size={52} /><h2>Đã hoàn tất bản xem thử</h2><p>Thông tin đã được kiểm tra trên giao diện. Yêu cầu chưa được lưu hoặc gửi vì chưa kết nối backend.</p><p>Khi hệ thống hoạt động, yêu cầu sẽ chuyển sang trạng thái <strong>Chờ xác minh</strong>.</p><button type="button" onClick={() => setSubmitted(false)}>Quay lại form</button><Link to="/">Về trang chủ</Link></section> : <FormYeuCauNhanDo onSubmit={() => setSubmitted(true)} />}
      </div>
    </div>
  )
}

