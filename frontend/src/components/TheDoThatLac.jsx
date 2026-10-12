import { Clock, MapPin, ArrowRight, MessageSquare, Shield, AlertCircle, Key, BookOpen } from 'lucide-react'

export default function TheDoThatLac({ doVat }) {
  const laDoNhatDuoc = doVat.type === 'found'

  const layIconTrangThai = (loaiTrangThai) => {
    switch (loaiTrangThai) {
      case 'safe':
        return <Shield className="w-3 h-3 text-emerald-600" />
      case 'urgent':
        return <AlertCircle className="w-3 h-3 text-rose-500" />
      case 'secure':
        return <Key className="w-3 h-3 text-amber-600" />
      default:
        return <BookOpen className="w-3 h-3 text-gray-500" />
    }
  }

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
          <img
            src={doVat.imageUrl}
            alt={doVat.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
            }}
          />

          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                laDoNhatDuoc
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                  : 'bg-rose-50 text-rose-800 border border-rose-200/80'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  laDoNhatDuoc ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              {doVat.typeName}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-md text-gray-700 shadow-sm border border-white/50">
              <Clock className="w-3 h-3 text-gray-400" />
              {doVat.time}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600">
              {doVat.category}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-100">
              {layIconTrangThai(doVat.statusType)}
              {doVat.statusBadge}
            </span>
          </div>

          <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-800 transition-colors line-clamp-1 mb-2">
            {doVat.title}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
            {doVat.description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-2 border-t border-gray-50">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{doVat.location}</span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 pt-0">
        {laDoNhatDuoc ? (
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#eef7f1] text-[#133f32] hover:bg-[#deede3] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Xem chi tiết / Nhận lại đồ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#fdf2f2] text-[#991b1b] hover:bg-[#fae1e1] active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Báo tin cho chủ nhân</span>
          </button>
        )}
      </div>
    </article>
  )
}
