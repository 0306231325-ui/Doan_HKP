import { ChevronRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { layNgayVietNam } from './hooks/xuLyThongKe'

export default function TinDangGanDay({ tongTin, tinGanDay }) {
  return (
    <section aria-labelledby="tin-dang-gan-day" className="border-t border-[#d6e4db]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-7">
        <h2 id="tin-dang-gan-day" className="flex items-center gap-2.5 text-base font-semibold text-[#1d3026]">
          Tin đăng gần đây
          <span className="rounded-md bg-[#eaf6ee] px-2 py-0.5 text-xs font-medium text-[#607568]">{tongTin}</span>
        </h2>
        <Link to="/admin/tin-dang" className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-emerald-900 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
          Xem tất cả <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      {tinGanDay.length ? (
        <ul className="divide-y divide-[#e4ece7]">
          {tinGanDay.map((tin) => (
            <li key={tin.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-7">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#243c30]">{tin.tieu_de}</p>
                <p className="mt-1 text-xs text-[#687d70]">{tin.danh_muc?.ten_danh_muc || 'Chưa phân loại'}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4 text-xs text-[#687d70]">
                <span className="rounded-md bg-[#edf7f0] px-2 py-1 text-emerald-800">{tin.loai_tin === 'bao_mat' ? 'Báo mất' : 'Nhặt được'}</span>
                <time dateTime={tin.created_at}>{layNgayVietNam(tin.created_at).split('-').reverse().join('/') || 'Chưa rõ ngày'}</time>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center gap-3 px-5 pb-7 pt-2 text-sm text-[#687d70] sm:px-7">
          <FileText className="h-5 w-5 shrink-0 text-[#91a699]" aria-hidden="true" />
          Chưa có tin đăng trong khoảng thời gian này.
        </div>
      )}
    </section>
  )
}
