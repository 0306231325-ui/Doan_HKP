import { Bell, HelpCircle, Plus } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3.5">
            <Link to="/" className="flex items-center gap-3 text-left group shrink-0">
              <img
                src="/logo/lacoi.png"
                alt="Logo"
                className="w-11 h-11 object-contain rounded-xl group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="flex flex-col shrink-0">
                <span className="text-2xl font-black tracking-tight text-emerald-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                  Lạc Ơi
                </span>
              </div>
            </Link>


          </div>

          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative px-4 py-2.5 rounded-xl text-base font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'text-emerald-800'
                    : 'text-gray-700 hover:text-gray-950 hover:bg-gray-50'
                }`
              }
            >
              Trang chủ
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full" />
            </NavLink>

            <button
              type="button"
              className="px-4 py-2.5 rounded-xl text-base font-semibold text-gray-700 hover:text-gray-950 hover:bg-gray-50 cursor-pointer"
            >
              Tra cứu
            </button>

            <button
              type="button"
              className="px-4 py-2.5 rounded-xl text-base font-semibold text-gray-700 hover:text-gray-950 hover:bg-gray-50 cursor-pointer"
            >
              Theo dõi đơn
            </button>

            <button
              type="button"
              className="px-4 py-2.5 rounded-xl text-base font-semibold text-gray-700 hover:text-gray-950 hover:bg-gray-50 cursor-pointer"
            >
              Bảng quản trị
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer relative"
              aria-label="Thông báo"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </button>



            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-bold bg-[#86efac] text-emerald-950 hover:bg-[#6ee7a0] active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Báo mất đồ</span>
            </button>

            <div className="flex items-center pl-1">
              <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold text-sm flex items-center justify-center ring-2 ring-emerald-100 select-none shadow-sm cursor-pointer">
                SV
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
