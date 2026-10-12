import { FileEdit, Search, ShieldCheck, Clock, Building2 } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#153e35] text-white rounded-3xl sm:rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-xl shadow-emerald-950/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold tracking-wide mb-6 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse"></span>
            Đồ thất lạc trong trường
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-5">
            Mất gì, nhặt được gì —{' '}
            <span className="text-[#a3e635] block sm:inline">báo ngay ở đây.</span>
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-xl mb-8">
            Tra cứu đồ bị mất, đồ nhặt được và gửi yêu cầu nhận lại an toàn. Mọi tin đăng đều được bộ phận hỗ trợ sinh viên và ban quản lý kiểm duyệt 24/7.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#a3e635] text-[#12382f] hover:bg-[#bbf758] active:scale-95 transition-all shadow-lg shadow-[#a3e635]/20 cursor-pointer"
            >
              <FileEdit className="w-4.5 h-4.5 stroke-[2.2]" />
              <span>Đăng tin ngay</span>
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-black/30 hover:bg-black/45 active:scale-95 text-white border border-white/15 transition-all cursor-pointer"
            >
              <Search className="w-4.5 h-4.5" />
              <span>Tra cứu đồ thất lạc</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4 border-t border-white/10 w-full text-xs sm:text-sm text-emerald-200/90">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-[#a3e635]" />
              <span>100% Xác thực SV</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-[#a3e635]" />
              <span>Lưu kho an toàn 30 ngày</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4.5 h-4.5 text-[#a3e635]" />
              <span>Liên kết 5 cơ sở</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-[#1f4e43] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-3 left-4 flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
            </div>

            <div className="mt-4 bg-[#14382f]/80 rounded-xl p-4 border border-white/10 flex flex-col gap-4">
              <div className="h-32 rounded-lg bg-gradient-to-b from-[#1b4b3f] to-[#12362e] border border-white/5 relative flex items-end justify-around px-4 pb-2 overflow-hidden">
                <div className="w-20 h-24 bg-[#52b788] rounded-t-2xl relative flex flex-col items-center justify-center shadow-lg border-t-2 border-emerald-300">
                  <div className="w-6 h-3 rounded-full bg-white/30 mb-2"></div>
                  <div className="w-12 h-10 rounded-lg bg-[#2d6a4f] flex items-center justify-center">
                    <div className="w-4 h-0.5 bg-white/40"></div>
                  </div>
                </div>

                <div className="w-8 h-20 bg-[#a3e635] rounded-t-lg shadow-md flex flex-col items-center justify-start pt-1">
                  <div className="w-3 h-3 rounded-sm bg-[#4d7c0f] mb-1"></div>
                  <div className="w-6 h-0.5 bg-black/20 my-1"></div>
                  <div className="w-6 h-0.5 bg-black/20 my-1"></div>
                </div>

                <div className="w-10 h-16 bg-[#d9f99d] rounded-lg shadow-md flex items-center justify-center">
                  <div className="w-6 h-10 rounded bg-[#4d7c0f]/20 border border-[#4d7c0f]/40"></div>
                </div>
              </div>

              <div className="h-1.5 w-full bg-[#2d6a4f] rounded-full"></div>

              <div className="h-28 rounded-lg bg-gradient-to-b from-[#1b4b3f] to-[#12362e] border border-white/5 relative flex items-end justify-around px-4 pb-2">
                <div className="w-14 h-16 bg-[#2d6a4f] rounded-lg shadow-md border border-white/10 p-2 flex flex-col justify-between">
                  <div className="w-full h-1 bg-white/30 rounded"></div>
                  <div className="w-3/4 h-1 bg-white/20 rounded"></div>
                  <div className="w-1/2 h-1 bg-white/20 rounded"></div>
                </div>

                <div className="w-28 h-6 bg-[#344e41] rounded-full shadow-md flex items-center justify-center">
                  <div className="w-16 h-1.5 bg-[#a3e635] rounded-full"></div>
                </div>

                <div className="w-12 h-14 bg-[#40916c] rounded-md shadow flex flex-col items-center justify-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold text-white">
                    24/7
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-emerald-200/80 px-1">
              <span>Kho lưu trữ tập trung</span>
              <span className="text-[#a3e635] font-semibold">Tự động đối soát</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
