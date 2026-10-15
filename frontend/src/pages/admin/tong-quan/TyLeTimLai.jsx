import { HandHeart } from 'lucide-react'

export default function TyLeTimLai({ tongTin, soDaTra, tyLeTimLai }) {
  return (
    <section aria-labelledby="ty-le-tim-lai" className="border-t border-[#d6e4db] p-5 sm:p-7 xl:border-t-0 xl:border-l">
      <div className="flex items-center justify-between gap-3">
        <h2 id="ty-le-tim-lai" className="text-lg font-bold text-[#1d3026]">Tỷ lệ tìm lại</h2>
        <HandHeart className="h-5 w-5 text-[#6b8073]" aria-hidden="true" />
      </div>
      <div className="mt-9 flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <p className="text-5xl font-bold tracking-tight text-emerald-900 tabular-nums">{tyLeTimLai}%</p>
        <p className="text-sm leading-6 text-[#687d70]">tin đăng đã ghi nhận trao trả</p>
      </div>
      <div role="progressbar" aria-label="Tỷ lệ tin ghi nhận trao trả" aria-valuemin={0} aria-valuemax={100} aria-valuenow={tyLeTimLai} className="mt-7 h-2 overflow-hidden rounded-full bg-[#e8f7ee]">
        <div className="h-full rounded-full bg-emerald-800 transition-[width]" style={{ width: `${tyLeTimLai}%` }} />
      </div>
      <div className="mt-4 flex justify-between gap-4 text-xs text-[#687d70] sm:text-sm">
        <span>Đã trao trả <strong className="font-semibold text-emerald-900">{soDaTra}</strong></span>
        <span>Tổng tin <strong className="font-semibold text-emerald-900">{tongTin}</strong></span>
      </div>
    </section>
  )
}
