import { ShieldCheck } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useDieuHuongQuanTri from './hooks/useDieuHuongQuanTri'

export default function BoCucQuanTri() {
  const { cacMucQuanTri, mucHienTai } = useDieuHuongQuanTri()

  return (
    <div className="min-h-screen bg-[#e8f4ec] text-gray-800 flex flex-col antialiased">
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-white focus:p-3 focus:text-emerald-900 focus:shadow-lg"
      >
        Đến nội dung quản trị
      </a>
      <Navbar adminView />

      <main id="admin-content" className="w-full max-w-7xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[248px_minmax(0,1fr)] gap-7 lg:gap-8">
          <aside aria-label="Điều hướng quản trị" className="min-w-0">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-950 to-green-800 px-6 py-6 text-white shadow-[0_4px_12px_rgba(20,83,45,0.08)]">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-green-200">
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                Khu vực quản trị
              </div>
              <p className="mt-2 text-xl font-extrabold tracking-tight">Lạc Ơi</p>
            </div>

            <nav className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1.5">
              {cacMucQuanTri.map(({ duongDan, nhan, bieuTuong: BieuTuong, ketThuc }) => (
                <NavLink
                  key={duongDan}
                  to={duongDan}
                  end={ketThuc}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-2xl px-3 py-3.5 text-sm lg:text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
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

          <section aria-labelledby="admin-title" className="min-w-0">
            <header className="mb-6 border-b border-[#dce7dd] pb-5">
              <p className="text-sm font-bold uppercase tracking-wide text-[#607568]">Quản trị</p>
              <h1 id="admin-title" className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-900">
                {mucHienTai.nhan}
              </h1>
            </header>
            <Outlet />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
