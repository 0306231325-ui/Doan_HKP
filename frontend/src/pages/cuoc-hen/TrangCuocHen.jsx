import { ArrowRight, CalendarPlus, Clock3, KeyRound } from 'lucide-react'
import { Link } from 'react-router-dom'

const CAC_THAO_TAC = [
  { to: 'tao', ten: 'Tạo cuộc hẹn', moTa: 'Ghi lại giờ và địa điểm hai bên đã chốt, rồi lấy mã để đưa cho người còn lại khi giao nhận đồ.', BieuTuong: CalendarPlus },
  { to: 'nhap-ma', ten: 'Nhập mã bàn giao', moTa: 'Dùng mã 6 số do người tạo lịch đưa để xác nhận sau khi hai bên đã giao nhận đồ.', BieuTuong: KeyRound },
]

export default function TrangCuocHen() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 py-4 sm:space-y-8 sm:py-8">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <h1 className="sr-only">Cuộc hẹn</h1>
        {CAC_THAO_TAC.map(({ to, ten, moTa, BieuTuong }) => (
          <Link key={to} to={to} className="group flex min-h-52 flex-col rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition-colors hover:border-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 sm:p-7">
            <BieuTuong className="size-12 rounded-2xl bg-emerald-50 p-3 text-emerald-800" aria-hidden="true" />
            <h2 className="mt-5 text-xl font-extrabold text-emerald-950">{ten}</h2>
            <p className="mb-5 mt-2 text-sm leading-6 text-[#526c5b]">{moTa}</p>
            <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-emerald-800">Tiếp tục <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
          </Link>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900 sm:p-5">
        <Clock3 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <p>Mã có hiệu lực từ <strong>giờ hẹn</strong> đến <strong>24 giờ sau</strong>. Nếu mã hết hạn, hai bên cần đặt lại lịch.</p>
      </div>
    </div>
  )
}
