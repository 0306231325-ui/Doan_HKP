import { ChevronDown, History } from 'lucide-react'

export default function LichSuKiemDuyet({ lichSu }) {
  return (
    <details className="group rounded-3xl border border-[#d6e4db] bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-3xl p-5 text-sm font-semibold text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:p-6 [&::-webkit-details-marker]:hidden">
        <History className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
        <span className="flex-1"><span className="group-open:hidden">Xem lịch sử kiểm duyệt</span><span className="hidden group-open:inline">Thu gọn lịch sử kiểm duyệt</span></span>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs">{lichSu.length}</span>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-[#e1eae4] p-5 sm:p-6">
        {!lichSu.length ? <p className="text-sm text-[#718276]">Chưa có lịch sử kiểm duyệt.</p> : (
          <ol className="space-y-5 border-l-2 border-[#d6e4db] pl-4">
            {lichSu.map((muc, i) => <li key={i}><h3 className="text-sm font-bold">{muc.hanhDong}</h3><p className="mt-1 text-xs text-[#718276]">{muc.thoiGian} · {muc.nguoiThucHien || 'Không xác định'}</p><p className="mt-2 break-words text-sm leading-6 text-[#526c5b]">{muc.lyDo}</p></li>)}
          </ol>
        )}
      </div>
    </details>
  )
}
