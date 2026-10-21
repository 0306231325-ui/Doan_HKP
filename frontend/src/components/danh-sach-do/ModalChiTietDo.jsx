import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Clock, MapPin, Calendar, Package, User, CheckCircle2, ShieldAlert, Send, Check } from 'lucide-react'

export default function ModalChiTietDo({ doVat, onClose }) {
  const [hoTen, setHoTen] = useState('')
  const [mssv, setMssv] = useState('')
  const [sdt, setSdt] = useState('')
  const [ghiChuXacMinh, setGhiChuXacMinh] = useState('')
  const [daGui, setDaGui] = useState(false)

  if (!doVat) return null

  const laDoNhatDuoc = doVat.type === 'found'

  const handleSubmit = (e) => {
    e.preventDefault()
    setDaGui(true)
    setTimeout(() => {
      if (onClose) onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-gray-900 flex items-center justify-center shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={doVat.imageUrl}
                  alt={doVat.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                      laDoNhatDuoc
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
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

                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/95 backdrop-blur-md text-gray-700 shadow-md border border-white/60">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {doVat.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                  Mã tin: {doVat.referenceCode}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-100">
                  {doVat.statusBadge}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {doVat.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                  {doVat.fullName || doVat.title}
                </h2>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2.5 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Vị trí:</strong> {doVat.location} ({doVat.campus})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Thời gian ghi nhận:</strong> {doVat.time} ({doVat.date})</span>
                </div>
                {doVat.storageLocation && (
                  <div className="flex items-center gap-2 text-emerald-900">
                    <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Nơi giữ tài sản:</strong> {doVat.storageLocation}</span>
                  </div>
                )}
                {doVat.contactPerson && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Người liên hệ:</strong> {doVat.contactPerson} - {doVat.contactPhone}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Mô tả chi tiết
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-100">
                  {doVat.description}
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tin đăng đã được ban quản trị kiểm duyệt tính hợp lệ.</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            {laDoNhatDuoc ? (
              <Link to={`/yeu-cau-nhan-do?id=${doVat.id}`} onClick={onClose} className="flex items-center justify-center gap-2 rounded-xl bg-[#254e2d] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1c3e23]">
                Đây là đồ của tôi — Yêu cầu nhận lại đồ
              </Link>
            ) : daGui ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <h4 className="text-sm font-bold text-emerald-950">Gửi yêu cầu thành công!</h4>
                <p className="text-xs text-emerald-800">
                  Ban quản lý sẽ liên hệ kiểm tra và hướng dẫn bạn nhận lại tài sản tại bàn trực tiếp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-800 uppercase tracking-wide">
                  <ShieldAlert className="w-4 h-4 text-emerald-700" />
                  <span>{laDoNhatDuoc ? 'Xác minh nhận lại đồ' : 'Gửi thông tin cho chủ nhân'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Họ và tên</label>
                    <input
                      type="text"
                      required
                      value={hoTen}
                      onChange={(e) => setHoTen(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mã số sinh viên (MSSV)</label>
                    <input
                      type="text"
                      required
                      value={mssv}
                      onChange={(e) => setMssv(e.target.value)}
                      placeholder="2021xxxx"
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    required
                    value={sdt}
                    onChange={(e) => setSdt(e.target.value)}
                    placeholder="0987 xxx xxx"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {laDoNhatDuoc ? 'Đặc điểm nhận dạng riêng biệt (chi tiết mật)' : 'Lời nhắn cho người nhặt được'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={ghiChuXacMinh}
                    onChange={(e) => setGhiChuXacMinh(e.target.value)}
                    placeholder={
                      laDoNhatDuoc
                        ? 'Ví dụ: Mật khẩu mở khóa máy, màu thẻ bên trong ví, vết xước riêng...'
                        : 'Mô tả vị trí bạn nhặt được hoặc thời gian có thể hẹn gặp...'
                    }
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#13382c] hover:bg-[#0c2620] text-white active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{laDoNhatDuoc ? 'Gửi yêu cầu nhận lại đồ' : 'Gửi thông tin cho chủ nhân'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
