import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const CAC_THAO_TAC = [
  { to: 'tao', ten: 'Tạo cuộc hẹn', moTa: 'Ghi lại giờ và địa điểm hai bên đã chốt, rồi lấy mã để đưa cho người còn lại khi giao nhận đồ.' },
  { to: 'nhap-ma', ten: 'Nhập mã bàn giao', moTa: 'Dùng mã 6 số do người tạo lịch đưa để xác nhận sau khi hai bên đã giao nhận đồ.' },
]

export default function TrangCuocHen() {
  return (
    <div className="grid w-full gap-5 sm:grid-cols-2 sm:gap-6">
      <h1 className="sr-only">Cuộc hẹn</h1>
      {CAC_THAO_TAC.map(({ to, ten, moTa }) => (
        <Link key={to} to={to} className="group flex min-h-52 flex-col rounded-3xl border border-emerald-100 bg-white p-7 shadow-sm transition-colors hover:border-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 sm:min-h-60 sm:p-8 lg:min-h-64 lg:p-10">
          <h2 className="text-2xl font-extrabold text-emerald-950 lg:text-3xl">{ten}</h2>
          <p className="mb-6 mt-3 text-base leading-7 text-[#526c5b]">{moTa}</p>
          <span className="mt-auto inline-flex items-center gap-2 text-base font-bold text-emerald-800">Tiếp tục <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
        </Link>
      ))}
    </div>
  )
}
