import { Link } from 'react-router-dom'

export default function BannerHoTro() {
  return (
    <section aria-labelledby="tieu-de-ho-tro" className="flex flex-col gap-5 border-t border-[#ceded3] py-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 id="tieu-de-ho-tro" className="text-xl font-semibold text-[#243c30]">Nhặt được đồ trong trường?</h2>
        <p className="mt-2 text-sm leading-6 text-[#607568]">Đăng tin để người mất tìm và liên hệ với bạn.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
        <Link
          to="/dang-tin?loaiTin=found"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Đăng tin nhặt được
        </Link>
        <Link
          to="/dang-tin?loaiTin=lost"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#bacfc1] px-5 py-2.5 text-sm font-semibold text-[#315a43] transition-colors hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Báo mất đồ
        </Link>
      </div>
    </section>
  )
}
