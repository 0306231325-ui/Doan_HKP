import { ArrowLeft, Camera, Plus, UserRound } from 'lucide-react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import QuanLyAnhDaiDien from './QuanLyAnhDaiDien'
import ThongTinCaNhan from './ThongTinCaNhan'
import XemTruocAnhDaiDien from './XemTruocAnhDaiDien'
import useAnhDaiDien from './hooks/useAnhDaiDien'

export default function TrangCaNhan() {
  const [thamSo] = useSearchParams()
  const anhDaiDien = useAnhDaiDien()
  const { user, hopThoaiAnh, dangTai, urlAnh, loiTaiAnh, moQuanLyAnh, huyChonAnh, xacNhanAnhDaiDien } = anhDaiDien
  if (thamSo.get('muc') === 'tin-dang') {
    const thamSoTin = new URLSearchParams(thamSo)
    thamSoTin.delete('muc')
    return <Navigate to={{ pathname: '/tin-da-dang', search: thamSoTin.toString() }} replace />
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-6 sm:space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-[#526c5b] hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Về trang chủ</Link>

      <header className="rounded-3xl border border-[#d6e4db] bg-white shadow-sm">
        <div className="relative overflow-hidden rounded-t-3xl bg-white px-6 pb-12 pt-7 sm:px-8 sm:pt-9">
          <div className="relative">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#243c30] sm:text-4xl">Trang cá nhân</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#607568]">Quản lý thông tin, tin đăng và hành trình tìm lại đồ của bạn.</p>
          </div>
        </div>
        <div className="relative flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
            <div className="relative -mt-8 w-fit shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-[#e8f4ec] text-[#6d9480] shadow-sm">{user?.anh_dai_dien ? <img src={user.anh_dai_dien} alt="Ảnh đại diện của bạn" className="h-full w-full rounded-[1.25rem] object-cover" /> : <UserRound className="h-11 w-11" strokeWidth={1.5} aria-label="Chưa có ảnh đại diện" role="img" />}</div>
              <button type="button" onClick={moQuanLyAnh} disabled={dangTai} aria-haspopup="dialog" aria-label="Quản lý ảnh đại diện" className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-[#e8f4ec] text-[#607568] shadow-sm focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed"><Camera className="h-4 w-4" aria-hidden="true" /></button>
            </div>
            <div className="min-w-0 sm:pb-1">
              <h2 className="text-lg font-bold text-[#243c30]">{user?.ho_ten}</h2>
              <p className="mt-1 text-sm text-[#718276]">{user?.email}</p>
            </div>
          </div>
          <Link to="/dang-tin" className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#86efac] px-5 py-3 text-sm font-bold text-emerald-950 transition-colors hover:bg-[#6ee7a0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 sm:self-auto"><Plus className="h-4 w-4" aria-hidden="true" />Đăng tin mới</Link>
        </div>
      </header>

      <div className="min-w-0">
        <ThongTinCaNhan />
      </div>
      {hopThoaiAnh && <QuanLyAnhDaiDien {...anhDaiDien} />}
      {urlAnh && <XemTruocAnhDaiDien key={urlAnh} urlAnh={urlAnh} dangTai={dangTai} loiTaiAnh={loiTaiAnh} khiDong={huyChonAnh} khiXacNhan={xacNhanAnhDaiDien} />}
    </div>
  )
}
