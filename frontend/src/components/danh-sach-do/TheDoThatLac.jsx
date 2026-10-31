import { Link, useLocation } from 'react-router-dom'
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react'

export default function TheDoThatLac({ doVat }) {
  const viTri = useLocation()
  const laDoNhatDuoc = doVat.type === 'found'

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <img
          src={doVat.imageUrl}
          alt={doVat.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(suKien) => {
            suKien.currentTarget.onerror = null
            suKien.currentTarget.src = '/do-vat-trong.svg'
          }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <h3 className="line-clamp-2 text-base font-bold text-gray-900">{doVat.title}</h3>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${laDoNhatDuoc ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${laDoNhatDuoc ? 'bg-emerald-500' : 'bg-rose-500'}`} aria-hidden="true" />
            {doVat.typeName}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <time dateTime={doVat.date}>{doVat.time}</time>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{doVat.location}</span>
        </div>

        <Link
          to={`/chi-tiet-tin-dang?id=${doVat.id}`}
          state={{ quayLai: viTri.pathname + viTri.search }}
          className="mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#eef7f1] px-4 py-2.5 text-xs font-semibold text-[#133f32] transition-colors hover:bg-[#deede3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:text-sm"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
