import { MapPin, CalendarDays, PackageCheck } from 'lucide-react'

export default function ThongTinDoNhanLai({ item }) {
  return (
    <aside className="claim-card claim-item">
      <img src={item.imageUrl} alt={item.fullName || item.title} className="claim-photo" />
      <div className="claim-item-content">
        <span className="claim-badge">Nhặt được · {item.category}</span>
        <h2>{item.fullName || item.title}</h2>
        <p className="claim-muted">Mã tin: {item.referenceCode}</p>
        <dl className="claim-details">
          <div><MapPin size={18} /><dt>Địa điểm</dt><dd>{item.location} · {item.campus}</dd></div>
          <div><CalendarDays size={18} /><dt>Ngày ghi nhận</dt><dd>{item.date.split('-').reverse().join('/')}</dd></div>
          <div><PackageCheck size={18} /><dt>Nơi giữ đồ</dt><dd>{item.storageLocation || 'Liên hệ người đăng để xác nhận'}</dd></div>
        </dl>
        <p className="claim-description">{item.description}</p>
      </div>
    </aside>
  )
}
