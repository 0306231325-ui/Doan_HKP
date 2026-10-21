export default function KhungThongTin({ tieuDe, bieuTuong: BieuTuong, children, className = '' }) {
  return (
    <section aria-label={tieuDe} className={`rounded-3xl border border-[#d6e4db] bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      <h2 className="flex items-center gap-2.5 text-lg font-bold text-[#243c30]">
        {BieuTuong && <BieuTuong className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />}
        {tieuDe}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}
