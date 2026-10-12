import { Search, ChevronDown, Calendar } from 'lucide-react'
import { CATEGORIES, LOCATIONS, TIME_RANGES } from '../data/mockData'

export default function ThanhTimKiem() {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên đồ vật, mô tả, vị trí... (ví dụ: ví da, thẻ sinh viên K21, chìa khoá xe Smartkey, tai nghe)"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50/80 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all"
          />
        </div>

        <button
          type="button"
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#13382c] hover:bg-[#0c2620] text-white text-sm font-semibold transition-all active:scale-95 shadow-sm cursor-pointer whitespace-nowrap"
        >
          Tìm kiếm
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 border-t border-gray-50">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white shadow-sm cursor-pointer whitespace-nowrap"
          >
            Tất cả
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Mất đồ
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Nhặt được
          </button>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <select
              defaultValue="all"
              className="appearance-none w-full sm:w-auto bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium pl-3.5 pr-8 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 cursor-pointer transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative flex-1 sm:flex-none">
            <select
              defaultValue="all"
              className="appearance-none w-full sm:w-auto bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium pl-3.5 pr-8 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 cursor-pointer transition-colors"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative flex-1 sm:flex-none">
            <select
              defaultValue="all"
              className="appearance-none w-full sm:w-auto bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium pl-7 pr-8 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 cursor-pointer transition-colors"
            >
              {TIME_RANGES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
