import { CalendarDays, ChevronDown } from 'lucide-react'

export default function BoLocThoiGian({ mocThoiGian, tuNgay, denNgay, homNay, loiKhoangNgay, chonMocThoiGian, doiTuNgay, doiDenNgay, apDungKhoangNgay }) {
  return (
    <section aria-label="Bộ lọc thời gian" className="rounded-2xl border border-[#d6e4db] bg-white p-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 shrink-0 text-emerald-800" aria-hidden="true" />
          <div>
            <label htmlFor="moc-thoi-gian" className="block text-sm font-semibold text-[#243c30]">Khoảng thời gian</label>
            <p className="mt-0.5 text-xs text-[#6b7e72]">Thống kê theo ngày đăng tin</p>
          </div>
        </div>
        <div className="relative sm:w-52">
          <select id="moc-thoi-gian" value={mocThoiGian} onChange={chonMocThoiGian} className="w-full appearance-none rounded-xl border border-[#ceded3] bg-[#f8fbf9] py-2.5 pl-3 pr-9 text-sm font-medium text-emerald-950 outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
            <option value="tat_ca">Tất cả thời gian</option>
            <option value="hom_nay">Hôm nay</option>
            <option value="7_ngay">7 ngày qua</option>
            <option value="30_ngay">30 ngày qua</option>
            <option value="thang_nay">Tháng này</option>
            <option value="tuy_chinh">Tùy chỉnh khoảng ngày</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#607568]" aria-hidden="true" />
        </div>
      </div>
      {mocThoiGian === 'tuy_chinh' && (
        <form onSubmit={apDungKhoangNgay} noValidate className="mt-4 border-t border-[#e5ede8] pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div>
              <label htmlFor="tu-ngay" className="mb-1.5 block text-xs font-semibold text-[#607568]">Từ ngày</label>
              <input id="tu-ngay" type="date" value={tuNgay} max={homNay} onChange={doiTuNgay} aria-invalid={Boolean(loiKhoangNgay)} aria-describedby={loiKhoangNgay ? 'loi-khoang-ngay' : undefined} className="min-w-0 w-full rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none focus-visible:ring-2 focus-visible:ring-emerald-700" />
            </div>
            <div>
              <label htmlFor="den-ngay" className="mb-1.5 block text-xs font-semibold text-[#607568]">Đến ngày</label>
              <input id="den-ngay" type="date" value={denNgay} max={homNay} onChange={doiDenNgay} aria-invalid={Boolean(loiKhoangNgay)} aria-describedby={loiKhoangNgay ? 'loi-khoang-ngay' : undefined} className="min-w-0 w-full rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none focus-visible:ring-2 focus-visible:ring-emerald-700" />
            </div>
            <button type="submit" className="rounded-xl bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Áp dụng</button>
          </div>
          {loiKhoangNgay && <p id="loi-khoang-ngay" role="alert" className="mt-3 text-sm text-red-700">{loiKhoangNgay}</p>}
        </form>
      )}
    </section>
  )
}
