import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import AdminNavbar from '../components/layout/admin/AdminNavbar'
import AdminFooter from '../components/layout/admin/AdminFooter'
import useDieuHuongQuanTri from './hooks/useDieuHuongQuanTri'

export default function BoCucQuanTri() {
  const { cacMucQuanTri, mucHienTai } = useDieuHuongQuanTri()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#e8f4ec] text-gray-800 flex flex-col antialiased">
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-white focus:p-3 focus:text-emerald-900 focus:shadow-lg"
      >
        Đến nội dung quản trị
      </a>
      <AdminNavbar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((trangThaiHienTai) => !trangThaiHienTai)} />

      <main id="admin-content" className="w-full max-w-7xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Đóng menu quản trị"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-x-0 bottom-0 top-[76px] z-40 bg-gray-950/30"
            />
            <aside id="admin-navigation" aria-label="Điều hướng quản trị" className="fixed bottom-0 left-0 top-[76px] z-50 w-[min(22rem,88vw)] overflow-y-auto border-r border-gray-100 bg-white p-4 shadow-xl">
              <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wide text-[#607568]">Menu quản trị</p>
              <nav aria-label="Menu quản trị" className="grid grid-cols-1 gap-1.5">
              {cacMucQuanTri.map(({ duongDan, nhan, bieuTuong: BieuTuong, ketThuc }) => (
                <NavLink
                  key={duongDan}
                  to={duongDan}
                  end={ketThuc}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-2xl px-3 py-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                      isActive
                        ? 'bg-emerald-900 text-white shadow-sm'
                        : 'text-[#607568] hover:bg-emerald-50 hover:text-emerald-900'
                    }`
                  }
                >
                  <BieuTuong className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                  <span>{nhan}</span>
                </NavLink>
              ))}
              </nav>
            </aside>
          </>
        )}

        <section aria-labelledby="admin-title" className="min-w-0">
          <header className="mb-6 border-b border-[#dce7dd] pb-5">
            <p className="text-sm font-bold uppercase tracking-wide text-[#607568]">Quản trị</p>
            <h1 id="admin-title" className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-900">
              {mucHienTai.nhan}
            </h1>
          </header>
          <Outlet />
        </section>
      </main>

      <AdminFooter />
    </div>
  )
}
