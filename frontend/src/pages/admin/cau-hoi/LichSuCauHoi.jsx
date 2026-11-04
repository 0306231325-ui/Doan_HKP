import { cacKieuNhap } from '../../../components/shared/quyTacCauHoi.js'
import { ChevronDown } from 'lucide-react'
import { layNhanPhamVi } from './hooks/xuLyCauHoi.js'

export default function LichSuCauHoi({ lichSu, danhMuc }) {
  return (
    <details className="group rounded-xl border border-[#d6e4db]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-700 [&::-webkit-details-marker]:hidden"><span>Lịch sử chỉnh sửa ({lichSu.length})</span><ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
      <ol className="space-y-4 border-t border-[#d6e4db] p-3">
        {lichSu.map((muc, viTri) => <li key={muc.id} className="rounded-xl border border-[#d6e4db] p-4">
          <p className="text-xs font-semibold text-emerald-800">Bản {muc.phienBan}{viTri === 0 ? ' · Mới nhất' : ''}</p>
          <h3 className="mt-2 break-words text-sm font-semibold leading-6 text-[#243c30]">{muc.nhanDangTin}</h3>
          <p className="mt-1 text-xs text-[#607568]">{layNhanPhamVi(muc, danhMuc)}</p>
          <p className="mt-1 text-xs leading-6 text-[#718276]">{cacKieuNhap[muc.kieuNhap] || 'Kiểu cũ'} · Thứ tự {muc.thuTu}</p>
        </li>)}
      </ol>
    </details>
  )
}
