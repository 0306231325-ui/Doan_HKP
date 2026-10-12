import { Archive } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-800 text-white flex items-center justify-center">
              <Archive className="w-3 h-3" />
            </div>
            <span className="font-semibold text-gray-700">Tìm Đồ Campus</span>
            <span>•</span>
            <span>© 2024 Tìm Đồ Campus - Hệ thống quản lý tài sản thất lạc Đại học.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button type="button" className="hover:text-emerald-700 transition-colors cursor-pointer">
              Quy chế trao trả
            </button>
            <button type="button" className="hover:text-emerald-700 transition-colors cursor-pointer">
              Hướng dẫn xác minh
            </button>
            <button type="button" className="hover:text-emerald-700 transition-colors cursor-pointer">
              Bảo mật thông tin
            </button>
            <button type="button" className="hover:text-emerald-700 transition-colors cursor-pointer">
              Liên hệ Ban quản trị
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
