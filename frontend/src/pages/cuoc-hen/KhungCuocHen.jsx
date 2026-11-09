import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function KhungCuocHen({ tieuDe, moTa, children, rong = false }) {
  return (
    <div className={`mx-auto space-y-6 py-4 sm:py-8 ${rong ? 'max-w-6xl' : 'max-w-4xl'}`}>
      <Link to="/cuoc-hen" className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-emerald-800 hover:underline focus-visible:outline-2 focus-visible:outline-emerald-700">
        <ArrowLeft className="size-4" aria-hidden="true" /> Về trang Cuộc hẹn
      </Link>
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-emerald-950 sm:text-4xl">{tieuDe}</h1>
        <p className="mt-3 text-sm leading-6 text-[#526c5b] sm:text-base">{moTa}</p>
      </header>
      {children}
    </div>
  )
}
