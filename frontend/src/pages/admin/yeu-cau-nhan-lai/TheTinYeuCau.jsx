import { ArrowRight } from 'lucide-react'

export default function TheTinYeuCau({ nhom, khiChon }) {
  const tin = nhom.tin_dang
  const daTra = tin?.trang_thai === 'da_hoan_tat'
  const choBanGiao = tin?.trang_thai === 'cho_ban_giao'
  return <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#d6e4db] bg-white transition-shadow hover:shadow-md">
    <button type="button" onClick={khiChon} aria-label={`Xem yêu cầu: ${tin?.tieu_de || 'Tin không còn hiển thị'}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-[#f1f6f2] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-700">
      <img src={nhom.anh_bia || '/do-vat-trong.svg'} alt={tin?.tieu_de || 'Đồ vật'} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; if (!e.currentTarget.src.endsWith('/do-vat-trong.svg')) e.currentTarget.src = '/do-vat-trong.svg' }} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
      {(choBanGiao || daTra) && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-sm">{daTra ? 'Đã trả đồ' : 'Chờ bàn giao'}</span>}
    </button>
    <div className="flex flex-1 flex-col p-4 sm:p-5">
      <p className="mb-2 text-xs font-medium text-[#718276]">{tin?.danh_muc?.ten_danh_muc || 'Chưa phân loại'}</p>
      <h3 className="text-base font-bold leading-6 text-[#243c30]"><button type="button" onClick={khiChon} className="line-clamp-2 text-left hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-700">{tin?.tieu_de || 'Tin không còn hiển thị'}</button></h3>
      <p className="mb-4 mt-3 text-sm text-[#718276]">{nhom.so_yeu_cau} yêu cầu</p>
      <button type="button" onClick={khiChon} className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Xem yêu cầu<ArrowRight size={16} aria-hidden="true" /></button>
    </div>
  </article>
}
