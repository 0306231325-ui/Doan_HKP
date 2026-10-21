import { useState } from 'react'
import { Menu, Plus, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import ThongBao from '../../thong-bao/ThongBao'

export default function Navbar({ adminView = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function moDongMenuDiDong() {
    setMobileMenuOpen((trangThai) => !trangThai)
  }

  function dongMenuDiDong() {
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3.5">
            <Link to="/" className="flex items-center gap-3 text-left group shrink-0">
              <img
                src="/logo/lacoi.png"
                alt="Logo Lạc Ơi"
                className="w-11 h-11 object-contain rounded-xl group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="flex flex-col shrink-0">
                <span className="text-2xl font-black tracking-tight text-emerald-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                  Lạc Ơi
                </span>
              </div>
            </Link>


          </div>

          <nav className="hidden lg:flex items-center gap-2 lg:gap-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `relative px-4 py-2.5 rounded-xl text-base font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'text-emerald-800'
                    : 'text-gray-700 hover:text-gray-950 hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Trang chủ
                  {isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full" />}
                </>
              )}
            </NavLink>

            <NavLink
              to="/danh-sach-do"
              className={({ isActive }) => `relative rounded-xl px-4 py-2.5 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-emerald-700 ${isActive ? 'text-emerald-800' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-950'}`}
            >
              {({ isActive }) => <><span>Tra cứu</span>{isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-emerald-600" />}</>}
            </NavLink>

            <button
              type="button"
              className="px-4 py-2.5 rounded-xl text-base font-semibold text-gray-700 hover:text-gray-950 hover:bg-gray-50 cursor-pointer"
            >
              Theo dõi đơn
            </button>

          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <ThongBao />
            {!adminView && <Link
              to="/dang-tin?loaiTin=lost"
              onClick={dongMenuDiDong}
              className="inline-flex items-center gap-2 px-2.5 sm:px-5 py-2.5 rounded-xl text-base font-bold bg-[#86efac] text-emerald-950 hover:bg-[#6ee7a0] active:scale-95 transition-all shadow-sm cursor-pointer"
              aria-label="Báo mất đồ"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span className="hidden sm:inline">Báo mất đồ</span>
            </Link>}

            <Link
              to="/dang-nhap"
              onClick={dongMenuDiDong}
              className="rounded-xl bg-emerald-800 px-3 sm:px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 transition-colors whitespace-nowrap"
            >
              Đăng nhập
            </Link>
            <button
              type="button"
              onClick={moDongMenuDiDong}
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-emerald-900 hover:bg-emerald-50 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav id="mobile-navigation" aria-label="Menu chính" className="grid grid-cols-1 gap-2 border-t border-gray-100 py-3 lg:hidden">
            {[
              { to: '/', label: 'Trang chủ', end: true },
              { to: '/danh-sach-do', label: 'Tra cứu' },
            ].map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={dongMenuDiDong}
                className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-emerald-100 text-emerald-900' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
