export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 sm:py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-start gap-3.5">
            <div className="flex items-center gap-3 shrink-0">
              <img
                src="/logo/lacoi.png"
                alt="Logo"
                className="w-11 h-11 object-contain rounded-xl shrink-0"
              />
              <span className="font-black text-2xl text-emerald-900 tracking-tight whitespace-nowrap shrink-0">
                Lạc Ơi
              </span>
            </div>
            <span className="text-gray-300 hidden sm:inline text-lg shrink-0">•</span>
            <span className="text-sm sm:text-base text-gray-600 whitespace-nowrap">
              © 2024 Lạc Ơi - Hệ thống quản lý tài sản thất lạc Đại học.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-2.5 text-sm sm:text-base font-semibold text-gray-700">
            <button type="button" className="text-left hover:text-emerald-700 transition-colors cursor-pointer whitespace-nowrap">
              Quy chế trao trả
            </button>
            <button type="button" className="text-left hover:text-emerald-700 transition-colors cursor-pointer whitespace-nowrap">
              Bảo mật thông tin
            </button>
            <button type="button" className="text-left hover:text-emerald-700 transition-colors cursor-pointer whitespace-nowrap">
              Hướng dẫn xác minh
            </button>
            <button type="button" className="text-left hover:text-emerald-700 transition-colors cursor-pointer whitespace-nowrap">
              Liên hệ Ban quản trị
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
