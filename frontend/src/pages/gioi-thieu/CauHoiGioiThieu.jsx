import { ChevronDown, MessageCircleQuestion } from 'lucide-react'
import useGioiThieu from './hooks/useGioiThieu'

export default function CauHoiGioiThieu() {
  const { cacCauHoi, cauHoiDangMo, doiCauHoi, maVung } = useGioiThieu()

  return (
    <section aria-labelledby="cau-hoi-gioi-thieu" className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
      <div>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-800"><MessageCircleQuestion className="h-5 w-5" aria-hidden="true" /></span>
        <h2 id="cau-hoi-gioi-thieu" className="mt-4 text-2xl font-extrabold tracking-tight text-emerald-950 sm:text-3xl">Một vài điều bạn có thể muốn biết</h2>
        <p className="mt-3 max-w-sm text-sm leading-7 text-[#607568]">Bắt đầu với Lạc Ơi từ những điều đơn giản nhất.</p>
      </div>
      <div className="divide-y divide-[#e1eae4] overflow-hidden rounded-3xl border border-[#d6e4db] bg-white">
        {cacCauHoi.map(({ id, cauHoi, traLoi }) => {
          const dangMo = cauHoiDangMo === id
          const maCauHoi = `${maVung}-${id}`
          return (
            <div key={id}>
              <h3><button type="button" id={maCauHoi} onClick={() => doiCauHoi(id)} aria-expanded={dangMo} aria-controls={`${maCauHoi}-noi-dung`} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-sm font-bold leading-6 text-[#243c30] hover:bg-emerald-50/50 focus-visible:-outline-offset-4 focus-visible:outline-2 focus-visible:outline-emerald-700 sm:px-6"><span>{cauHoi}</span><ChevronDown className={`h-4 w-4 shrink-0 text-emerald-700 transition-transform ${dangMo ? 'rotate-180' : ''}`} aria-hidden="true" /></button></h3>
              <div id={`${maCauHoi}-noi-dung`} role="region" aria-labelledby={maCauHoi} hidden={!dangMo} className="px-5 pb-5 text-sm leading-7 text-[#607568] sm:px-6">{traLoi}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
