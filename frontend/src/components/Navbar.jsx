import { Bell, HelpCircle, Plus, Archive } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 text-left group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <Archive className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors">
                  Tìm Đồ Campus
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-100/80">
              Cổng thông tin sinh viên
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-emerald-800 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              Trang chủ
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full" />
            </NavLink>

            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
            >
              Tra cứu
            </button>

            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
            >
              Theo dõi đơn
            </button>

            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
            >
              Bảng quản trị
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer relative"
              aria-label="Thông báo"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </button>

            <button
              type="button"
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Trợ giúp"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-[#86efac] text-emerald-950 hover:bg-[#6ee7a0] active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Báo mất đồ</span>
            </button>

            <div className="flex items-center pl-1">
              <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-100 select-none shadow-sm cursor-pointer">
                SV
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
