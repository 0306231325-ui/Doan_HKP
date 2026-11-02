import { ArrowLeft, ArrowRight, Camera, ClipboardList, HandHeart, Menu, Plus, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThongBaoTrong from '../../components/shared/ThongBaoTrong'
import ThongTinCaNhan from './ThongTinCaNhan'
import XemTruocAnhDaiDien from './XemTruocAnhDaiDien'
import useTrangCaNhan from './hooks/useTrangCaNhan'
import useAnhDaiDien from './hooks/useAnhDaiDien'

export default function TrangCaNhan() {
  const { cacMuc, mucHienTai, chonMuc, moMenu, doiMoMenu, dongMenuKhiRoiKhung, khungMenu, nutMenu } = useTrangCaNhan()
  const { user, oChonAnh, dangTai, tepAnh, urlAnh, loiTaiAnh, moChonAnh, chonAnh, huyChonAnh, xacNhanDoiAnh } = useAnhDaiDien()
  const laTinDang = mucHienTai === 'tin-dang'

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
              <button type="button" onClick={moChonAnh} disabled={dangTai} aria-label={dangTai ? 'Đang tải ảnh đại diện' : 'Đổi ảnh đại diện'} className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-[#e8f4ec] text-[#607568] shadow-sm disabled:cursor-not-allowed"><Camera className="h-4 w-4" aria-hidden="true" /></button>
              <input ref={oChonAnh} type="file" accept="image/jpeg,image/png,image/webp" onChange={chonAnh} disabled={dangTai} className="hidden" aria-label="Chọn ảnh đại diện" />
            </div>
            <div className="min-w-0 sm:pb-1">
              <h2 className="text-lg font-bold text-[#243c30]">{user?.ho_ten}</h2>
              <p className="mt-1 text-sm text-[#718276]">{user?.email}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 self-start sm:self-auto">
            <Link to="/dang-tin" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#86efac] px-5 py-3 text-sm font-bold text-emerald-950 transition-colors hover:bg-[#6ee7a0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"><Plus className="h-4 w-4" aria-hidden="true" />Đăng tin mới</Link>
            <div ref={khungMenu} onBlur={dongMenuKhiRoiKhung} className="relative">
              <button ref={nutMenu} type="button" onClick={doiMoMenu} aria-label="Quản lý cá nhân" aria-expanded={moMenu} aria-controls="dieu-huong-ca-nhan" className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d6e4db] text-emerald-900 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><Menu className="h-5 w-5" aria-hidden="true" /></button>
              {moMenu && <nav id="dieu-huong-ca-nhan" aria-label="Quản lý cá nhân" className="absolute right-0 top-full z-30 mt-2 w-64 max-w-[calc(100vw-3rem)] space-y-1 rounded-2xl border border-[#d6e4db] bg-white p-2 shadow-xl">
                {cacMuc.map(({ id, nhan, bieuTuong: BieuTuong }) => <button key={id} type="button" aria-pressed={mucHienTai === id} aria-controls="noi-dung-ca-nhan" onClick={() => chonMuc(id)} className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-emerald-700 ${mucHienTai === id ? 'bg-emerald-900 text-white' : 'text-[#607568] hover:bg-emerald-50 hover:text-emerald-900'}`}><BieuTuong className="h-4 w-4 shrink-0" aria-hidden="true" />{nhan}</button>)}
              </nav>}
            </div>
          </div>
        </div>
        {dangTai && <p role="status" className="px-6 pb-5 text-sm text-[#607568] sm:px-8">Đang tải ảnh đại diện…</p>}
      </header>

      <div id="noi-dung-ca-nhan" className="min-w-0">
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
      {tepAnh && <XemTruocAnhDaiDien key={urlAnh} urlAnh={urlAnh} dangTai={dangTai} loiTaiAnh={loiTaiAnh} khiDong={huyChonAnh} khiXacNhan={xacNhanDoiAnh} />}
    </div>
  )
}
