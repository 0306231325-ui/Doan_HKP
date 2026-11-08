import { ChevronDown, RotateCcw, Search, SlidersHorizontal } from 'lucide-react'

export default function ThanhTimKiem({ boLoc, tuKhoaNhap, danhMuc, diaDiem, coBoLoc, loiNgay, doiTruongLoc, doiTuKhoaNhap, timKiem, xoaBoLoc }) {
  const lopNhap = 'w-full rounded-xl border border-[#ceded3] bg-[#fafcfb] px-3 py-2.5 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'
  return (
    <section id="bo-loc-do-vat" aria-labelledby="tieu-de-bo-loc" className="scroll-mt-28 rounded-2xl border border-[#d6e4db] bg-white p-5 sm:p-6">
      <h2 id="tieu-de-bo-loc" className="mb-5 text-sm font-bold text-[#243c30]">Tìm đồ thất lạc</h2>
      <form role="search" aria-label="Tìm đồ thất lạc" onSubmit={timKiem} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1"><label htmlFor="tu-khoa-do-vat" className="sr-only">Tìm theo tên đồ, mô tả, địa điểm hoặc mã tin</label><Search className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-[#8a9f91]" aria-hidden="true" /><input id="tu-khoa-do-vat" type="search" name="tuKhoa" value={tuKhoaNhap} onChange={doiTuKhoaNhap} placeholder="Nhập tên đồ, đặc điểm, địa điểm hoặc mã tin…" className={`${lopNhap} py-3 pl-11`} /></div>
        <button type="submit" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><Search className="h-4 w-4" aria-hidden="true" />Tìm kiếm</button>
      </form>
      <details className="group mt-5 border-t border-[#e4ece7] pt-4">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg py-1 text-sm font-semibold text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" aria-hidden="true" />Bộ lọc</span>
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <label htmlFor="loai-tin-do-vat" className="mb-2 block text-xs font-semibold text-[#526c5b]">Loại tin</label>
            <select id="loai-tin-do-vat" name="loaiTin" value={boLoc.loaiTin} onChange={doiTruongLoc} className={lopNhap}>
              <option value="all">Tất cả</option>
              <option value="lost">Báo mất</option>
              <option value="found">Nhặt được</option>
            </select>
          </div>
          <div><label htmlFor="danh-muc-do-vat" className="mb-2 block text-xs font-semibold text-[#526c5b]">Danh mục</label><select id="danh-muc-do-vat" name="danhMuc" value={boLoc.danhMuc} onChange={doiTruongLoc} className={lopNhap}>{danhMuc.map((muc) => <option key={muc.id} value={muc.id}>{muc.name}</option>)}</select></div>
          <div><label htmlFor="dia-diem-do-vat" className="mb-2 block text-xs font-semibold text-[#526c5b]">Địa điểm</label><select id="dia-diem-do-vat" name="diaDiem" value={boLoc.diaDiem} onChange={doiTruongLoc} className={lopNhap}>{diaDiem.map((muc) => <option key={muc.id} value={muc.id}>{muc.name}</option>)}</select></div>
          <div><label htmlFor="tu-ngay-do-vat" className="mb-2 block text-xs font-semibold text-[#526c5b]">Ghi nhận từ ngày</label><input id="tu-ngay-do-vat" type="date" name="tuNgay" value={boLoc.tuNgay} onChange={doiTruongLoc} aria-invalid={Boolean(loiNgay)} aria-describedby={loiNgay ? 'loi-ngay-do-vat' : undefined} className={lopNhap} /></div>
          <div><label htmlFor="den-ngay-do-vat" className="mb-2 block text-xs font-semibold text-[#526c5b]">Đến ngày</label><input id="den-ngay-do-vat" type="date" name="denNgay" value={boLoc.denNgay} onChange={doiTruongLoc} aria-invalid={Boolean(loiNgay)} aria-describedby={loiNgay ? 'loi-ngay-do-vat' : undefined} className={lopNhap} /></div>
        </div>
        {loiNgay && <p id="loi-ngay-do-vat" role="alert" className="mt-3 text-xs text-red-700">{loiNgay}</p>}
        <div className="mt-4 flex justify-end border-t border-[#e4ece7] pt-4">
          <button type="button" onClick={xoaBoLoc} disabled={!coBoLoc} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#687d70] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />Xóa bộ lọc</button>
        </div>
      </details>
    </section>
  )
}
