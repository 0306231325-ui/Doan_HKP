import { useState } from 'react'
import { X, Check, HelpCircle, HandHeart, UploadCloud } from 'lucide-react'
import { CATEGORIES } from '../../data/mockData'

export default function ModalBaoMatDo({ loaiBanDau = 'lost', onClose }) {
  const [loaiTin, setLoaiTin] = useState(loaiBanDau)
  const [daThanhCong, setDaThanhCong] = useState(false)
  const [anhXemTruoc, setAnhXemTruoc] = useState(null)
  const [duLieuForm, setDuLieuForm] = useState({
    tieuDe: '',
    danhMuc: '',
    thoiGian: '',
    moTa: '',
    coSo: 'Cơ sở chính',
    viTri: '',
    phuongAnBanGiao: 'guard_gate1',
  })

  const danhMucHopLe = CATEGORIES.filter((c) => c.id !== 'all')

  const handleChange = (e) => {
    const { name, value } = e.target
    setDuLieuForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setDaThanhCong(true)
    setTimeout(() => {
      if (onClose) onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {daThanhCong ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Đăng tin thành công!</h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                Tin của bạn đã được lưu và gửi tới bộ phận trực ban để hiển thị cho cộng đồng sinh viên.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Tạo tin đăng tài sản
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Nhập thông tin chi tiết để sinh viên hoặc bộ phận bảo vệ dễ đối chiếu.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-100/90 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setLoaiTin('lost')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    loaiTin === 'lost'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Tôi bị mất đồ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLoaiTin('found')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    loaiTin === 'found'
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                  }`}
                >
                  <HandHeart className="w-4 h-4" />
                  <span>Tôi nhặt được đồ</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Tên đồ vật / Tiêu đề
                  </label>
                  <input
                    type="text"
                    name="tieuDe"
                    required
                    value={duLieuForm.tieuDe}
                    onChange={handleChange}
                    placeholder="Ví dụ: Ví da nam Calvin Klein, Thẻ sinh viên K21..."
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Danh mục
                    </label>
                    <select
                      name="danhMuc"
                      required
                      value={duLieuForm.danhMuc}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {danhMucHopLe.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Thời điểm
                    </label>
                    <input
                      type="datetime-local"
                      name="thoiGian"
                      required
                      value={duLieuForm.thoiGian}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Cơ sở
                    </label>
                    <select
                      name="coSo"
                      value={duLieuForm.coSo}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    >
                      <option value="Cơ sở chính">Cơ sở chính</option>
                      <option value="Cơ sở 1">Cơ sở 1</option>
                      <option value="Cơ sở 2">Cơ sở 2</option>
                      <option value="Khu KTX">Khu Ký túc xá</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Vị trí chi tiết
                    </label>
                    <input
                      type="text"
                      name="viTri"
                      required
                      value={duLieuForm.viTri}
                      onChange={handleChange}
                      placeholder="Bàn 14 tầng 3 Thư viện, Căn-tin..."
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Mô tả đặc điểm
                  </label>
                  <textarea
                    rows={2}
                    name="moTa"
                    required
                    value={duLieuForm.moTa}
                    onChange={handleChange}
                    placeholder="Màu sắc, hình dạng, phụ kiện đi kèm..."
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                <div
                  onClick={() =>
                    setAnhXemTruoc(
                      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
                    )
                  }
                  className="border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {anhXemTruoc ? 'Đã tải ảnh mẫu' : 'Bấm để tải ảnh minh họa'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#13382c] hover:bg-[#0c2620] text-white active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  Xác nhận đăng tin
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
