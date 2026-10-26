import { Link } from 'react-router-dom'
import { FileEdit, Search, ShieldCheck, Clock, Building2 } from 'lucide-react'
import TrinhChieuAnh from '../shared/TrinhChieuAnh'

const bannerImages = [
  { src: '/banner/bannr2.png', alt: 'Banner 1' },
  { src: '/banner/banner3.png', alt: 'Banner 2' },
  { src: '/banner/banner4.png', alt: 'Banner 3' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl sm:rounded-[32px] p-6 sm:p-10 lg:p-12 text-white bg-[#153e35]/85 backdrop-blur-xl border border-white/15 shadow-xl shadow-emerald-950/10">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-5">
            Mất Gì Hay Nhặt Được Gì
            <span className="text-[#a3e635] block">Báo Ngay Tại Đây Nhen.</span>
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-xl mb-8">
            Tra cứu đồ bị mất, đồ nhặt được và gửi yêu cầu nhận lại an toàn. Mọi tin đăng đều được bộ phận hỗ trợ sinh viên và ban quản lý kiểm duyệt 24/7.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
            <Link
              to="/dang-tin"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#a3e635] text-[#12382f] hover:bg-[#bbf758] active:scale-95 transition-all shadow-lg shadow-[#a3e635]/25 cursor-pointer"
            >
              <FileEdit className="w-4.5 h-4.5 stroke-[2.2]" />
              <span>Đăng tin ngay</span>
            </Link>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <Search className="w-4.5 h-4.5" />
              <span>Tra cứu đồ thất lạc</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4 border-t border-white/15 w-full text-xs sm:text-sm text-emerald-200/90">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-[#a3e635]" />
              <span>100% Xác thực SV</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-[#a3e635]" />
              <span>Lưu kho an toàn</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4.5 h-4.5 text-[#a3e635]" />
              <span>Ngay Tại Cơ Sở Của Bạn</span>
            </div>
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
