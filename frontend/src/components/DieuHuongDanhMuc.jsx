import { FolderTree, MapPin } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function DieuHuongDanhMuc() {
  return (
    <nav aria-label="Quản lý danh mục và địa điểm" className="flex flex-wrap gap-1 rounded-xl border border-[#d6e4db] bg-white p-1.5">
      {[
        { duongDan: '/admin/danh-muc', nhan: 'Danh mục đồ vật', bieuTuong: FolderTree },
        { duongDan: '/admin/danh-muc/dia-diem', nhan: 'Địa điểm trong trường', bieuTuong: MapPin },
      ].map(({ duongDan, nhan, bieuTuong: BieuTuong }) => (
        <NavLink key={duongDan} to={duongDan} end className={({ isActive }) => `inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:flex-none ${isActive ? 'bg-[#eaf6ee] text-emerald-900' : 'text-[#687d70] hover:bg-[#f5f9f6] hover:text-emerald-900'}`}>
          <BieuTuong className="h-4 w-4 shrink-0" aria-hidden="true" />
          {nhan}
        </NavLink>
      ))}
    </nav>
  )
}
