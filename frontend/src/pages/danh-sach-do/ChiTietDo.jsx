import { CalendarDays, MapPin, Phone, UserRound } from 'lucide-react'
import HopThoai from '../../components/HopThoai'
import { dinhDangNgay } from './hooks/xuLyDanhSachDo.js'

export default function ChiTietDo({ doVatChon, dongChiTiet }) {
  return (
    <HopThoai tieuDe="Chi tiết đồ thất lạc" moTa={`Mã tin: ${doVatChon.referenceCode}`} khiDong={dongChiTiet}>
      <div className="space-y-5 px-5 py-5 sm:px-6">
        <img src={doVatChon.imageUrl} alt={doVatChon.title} className="aspect-[16/10] w-full rounded-xl bg-[#f0f6f2] object-cover" />
        <div><div className="mb-3 flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${doVatChon.type === 'found' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>{doVatChon.typeName}</span><span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{doVatChon.category}</span></div><h3 className="text-lg font-bold leading-7 text-[#243c30]">{doVatChon.fullName || doVatChon.title}</h3></div>
        <dl className="space-y-3 rounded-xl bg-[#f5f9f6] p-4 text-sm leading-6 text-[#526c5b]">
          <div><dt className="flex items-center gap-2 text-xs font-semibold text-[#718276]"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />Địa điểm</dt><dd className="mt-1">{doVatChon.location} · {doVatChon.campus}</dd></div>
          <div><dt className="flex items-center gap-2 text-xs font-semibold text-[#718276]"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />Ngày ghi nhận</dt><dd className="mt-1">{dinhDangNgay(doVatChon.date)}</dd></div>
          <div><dt className="text-xs font-semibold text-[#718276]">Tình trạng</dt><dd className="mt-1">{doVatChon.statusBadge}</dd></div>
          {doVatChon.storageLocation && <div><dt className="text-xs font-semibold text-[#718276]">Nơi giữ đồ</dt><dd className="mt-1">{doVatChon.storageLocation}</dd></div>}
        </dl>
        <div><h4 className="mb-2 text-sm font-semibold text-[#243c30]">Mô tả đồ vật</h4><p className="whitespace-pre-line text-sm leading-7 text-[#687d70]">{doVatChon.description}</p></div>
        <div className="border-t border-[#e1eae4] pt-4"><h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#243c30]"><UserRound className="h-4 w-4" aria-hidden="true" />{doVatChon.contactPerson}</h4><p className="flex items-center gap-2 text-sm text-[#687d70]"><Phone className="h-4 w-4" aria-hidden="true" />{doVatChon.contactPhone}</p><p className="mt-3 text-xs leading-5 text-[#718276]">Thông tin mẫu để xem giao diện. Chức năng gửi yêu cầu nhận lại và báo nhặt được sẽ được bổ sung sau.</p></div>
      </div>
    </HopThoai>
  )
}
