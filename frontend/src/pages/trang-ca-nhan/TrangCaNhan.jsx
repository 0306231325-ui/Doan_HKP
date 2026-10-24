import { ArrowLeft, ArrowRight, Camera, ClipboardList, HandHeart, Plus, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThongBaoTrong from '../../components/shared/ThongBaoTrong'
import ThongTinCaNhan from './ThongTinCaNhan'
import useTrangCaNhan from './hooks/useTrangCaNhan'

export default function TrangCaNhan() {
  const { cacMuc, mucHienTai, chonMuc } = useTrangCaNhan()
  const laTinDang = mucHienTai === 'tin-dang'

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-6 sm:space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-[#526c5b] hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Về trang chủ</Link>

      <header className="overflow-hidden rounded-3xl border border-[#d6e4db] bg-white shadow-sm">
        <div className="relative overflow-hidden bg-emerald-900 bg-linear-to-br from-emerald-950 via-emerald-900 to-emerald-700 px-6 pb-12 pt-7 sm:px-8 sm:pt-9">
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-24 h-64 w-64 rounded-full border-[40px] border-white/5" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">Góc của bạn</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Trang cá nhân</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-emerald-100">Quản lý thông tin, tin đăng và hành trình tìm lại đồ của bạn.</p>
          </div>
        </div>
        <div className="relative flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
            <div className="relative -mt-8 w-fit shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-[#e8f4ec] text-[#6d9480] shadow-sm"><UserRound className="h-11 w-11" strokeWidth={1.5} aria-label="Chưa có ảnh đại diện" role="img" /></div>
              <button type="button" disabled title="Chưa kết nối tài khoản" aria-label="Đổi ảnh đại diện" className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-[#e8f4ec] text-[#607568] shadow-sm disabled:cursor-not-allowed"><Camera className="h-4 w-4" aria-hidden="true" /></button>
            </div>
            <div className="min-w-0 sm:pb-1">
              <h2 className="text-lg font-bold text-[#243c30]">Thông tin người dùng</h2>
              <p className="mt-1 text-sm text-[#718276]">Chưa có thông tin tài khoản</p>
            </div>
          </div>
          <Link to="/dang-tin" className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#86efac] px-5 py-3 text-sm font-bold text-emerald-950 transition-colors hover:bg-[#6ee7a0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 sm:self-auto"><Plus className="h-4 w-4" aria-hidden="true" />Đăng tin mới</Link>
        </div>
      </header>

      <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="rounded-3xl border border-[#d6e4db] bg-white p-3 shadow-sm lg:w-60 lg:shrink-0">
          <p className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-wider text-[#718276]">Quản lý cá nhân</p>
          <nav aria-label="Quản lý cá nhân" className="space-y-1">
            {cacMuc.map(({ id, nhan, bieuTuong: BieuTuong }) => <button key={id} type="button" aria-pressed={mucHienTai === id} aria-controls="noi-dung-ca-nhan" onClick={() => chonMuc(id)} className={`flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${mucHienTai === id ? 'bg-emerald-900 text-white shadow-sm' : 'text-[#607568] hover:bg-emerald-50 hover:text-emerald-900'}`}><BieuTuong className="h-4 w-4 shrink-0" aria-hidden="true" />{nhan}</button>)}
          </nav>
        </aside>

        <div id="noi-dung-ca-nhan" className="min-w-0 flex-1">
          {mucHienTai === 'thong-tin' ? <ThongTinCaNhan /> : (
            <section aria-label={laTinDang ? 'Tin đã đăng' : 'Yêu cầu nhận đồ'} className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-emerald-900">{laTinDang ? 'Tin đã đăng' : 'Yêu cầu nhận đồ'}</h2>
                <p className="mt-2 text-sm leading-6 text-[#607568]">{laTinDang ? 'Theo dõi và quản lý các tin báo mất, nhặt được của bạn.' : 'Theo dõi trạng thái các yêu cầu nhận lại đồ của bạn.'}</p>
              </div>
              <ThongBaoTrong bieuTuong={laTinDang ? ClipboardList : HandHeart} tieuDe={laTinDang ? 'Chưa có tin đăng để hiển thị' : 'Chưa có yêu cầu để hiển thị'} moTa={laTinDang ? 'Các tin đăng của bạn sẽ được hiển thị tại đây khi có dữ liệu.' : 'Các yêu cầu nhận lại đồ của bạn sẽ được hiển thị tại đây khi có dữ liệu.'} />
              <Link to={laTinDang ? '/dang-tin' : '/danh-sach-do'} className="inline-flex items-center gap-2 rounded-xl px-1 py-2 text-sm font-bold text-emerald-800 hover:text-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">{laTinDang ? 'Đăng tin mới' : 'Tra cứu đồ thất lạc'}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
