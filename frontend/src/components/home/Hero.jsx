import { Link } from 'react-router-dom'
import TrinhChieuAnh from '../shared/TrinhChieuAnh'

const bannerImages = [
  { src: '/banner/banner1.png', alt: 'Banner 1' },
  { src: '/banner/banner2.png', alt: 'Banner 2' },
  { src: '/banner/banner3.png', alt: 'Banner 3' },
]

const lopNut = 'inline-flex min-h-12 items-center justify-center px-4 py-3 rounded-xl text-sm font-bold bg-[#86efac] text-emerald-950 hover:bg-[#6ee7a0] active:scale-95 transition-all shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl sm:rounded-[32px] p-6 sm:p-10 lg:p-12 text-white bg-[#153e35]/85 backdrop-blur-xl border border-white/15 shadow-xl shadow-emerald-950/10">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-8 lg:col-span-7">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
            Mất Gì Hay Nhặt Được Gì
            <span className="text-white block">Báo Ngay Tại Đây Nhen.</span>
          </h1>

          <div className="grid w-full max-w-md gap-3 sm:grid-cols-2 sm:gap-4">
            <Link to="/dang-tin" className={lopNut}>
              Đăng tin ngay
            </Link>

            <Link to="/danh-sach-do" className={lopNut}>
              Tra cứu đồ thất lạc
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl relative overflow-hidden group">
            <TrinhChieuAnh
              danhSachAnh={bannerImages}
              chuKy={3500}
              tocDoChuyen="duration-700"
              mauCham="bg-[#a3e635]"
              lapDay
              nhan="Ảnh nổi bật trên trang chủ"
              className="aspect-[4/3] rounded-xl border border-white/10 bg-black/20 sm:rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
