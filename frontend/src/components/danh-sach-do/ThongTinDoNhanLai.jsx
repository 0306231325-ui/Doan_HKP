import { Link } from 'react-router-dom'

export default function ThongTinDoNhanLai({ item }) {
  return (
    <aside className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white">
      <img src={item.imageUrl} alt={item.title} className="aspect-[4/3] w-full bg-[#f5faf7] object-contain" />
      <div className="space-y-3 p-5">
        <p className="text-xs font-semibold text-emerald-800">Nhặt được · {item.category}</p>
        <h2 className="break-words text-lg font-bold text-[#243c30]">{item.title}</h2>
        <p className="text-xs text-[#718276]">{item.referenceCode}</p>
        <p className="text-sm text-[#607568]">{item.date} · {item.locationDetail || item.location}</p>
        <Link to={`/chi-tiet-tin-dang?id=${item.id}`} className="inline-block text-sm font-semibold text-emerald-800 underline">Xem tin đăng</Link>
      </div>
    </aside>
  )
}
