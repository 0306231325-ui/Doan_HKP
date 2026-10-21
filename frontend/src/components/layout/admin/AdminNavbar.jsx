import { Menu, ShieldCheck, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminNavbar({ menuOpen, onToggleMenu }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 text-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMenu}
            aria-controls="admin-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Đóng menu quản trị' : 'Mở menu quản trị'}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-emerald-900 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
          <Link to="/admin" className="group flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
            <img src="/logo/lacoi.png" alt="Lạc Ơi" className="h-10 w-10 rounded-xl bg-white object-contain p-0.5" />
            <span className="text-xl font-black tracking-tight text-emerald-900 transition-colors group-hover:text-emerald-700 sm:text-2xl">Lạc Ơi</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden items-center gap-2 text-sm font-semibold text-emerald-800 sm:flex">
            <ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            <span>Khu vực quản trị</span>
          </div>
          <span className="h-7 w-px bg-gray-200" aria-hidden="true" />
          <Link to="/" className="rounded-xl bg-[#86efac] px-3 py-2 text-xs font-bold text-emerald-950 shadow-sm transition-colors hover:bg-[#6ee7a0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:px-4 sm:text-sm">
            <span className="sm:hidden">Trang người dùng</span>
            <span className="hidden sm:inline">Xem trang người dùng</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 text-xs font-extrabold text-white ring-2 ring-emerald-100" aria-hidden="true">
              QT
            </span>
            <span className="hidden text-sm font-semibold text-gray-700 sm:inline">Quản trị viên</span>
          </div>
        </div>
      </div>
    </header>
  )
}
