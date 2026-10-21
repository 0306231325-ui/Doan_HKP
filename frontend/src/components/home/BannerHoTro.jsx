import { ClipboardList, Megaphone } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function BannerHoTro() {
  return (
    <section className="bg-[#edf6f0] border border-[#d4ebd8] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#86efac] text-[#065f46] tracking-wide mb-4">
            HỖ TRỢ TRAO TRẢ
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-3">
            Bạn vừa nhặt được đồ của bạn bè trong trường?
          </h2>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Chỉ mất 1 phút để đăng tải hình ảnh và thông tin bàn giao. Bạn có thể tự giữ đồ hoặc chuyển trực tiếp đến Phòng Bảo vệ tại Cổng 1 hoặc Phòng Công tác Sinh viên để được cấp biên nhận.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <Link
            to="/dang-tin?loaiTin=found"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#13382c] hover:bg-[#0c2620] text-white active:scale-95 transition-all shadow-md shadow-[#13382c]/10 cursor-pointer"
          >
            <ClipboardList className="w-4.5 h-4.5" />
            <span>Đăng tin nhặt được</span>
          </Link>

          <Link
            to="/dang-tin?loaiTin=lost"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <Megaphone className="w-4.5 h-4.5 text-rose-500" />
            <span>Báo mất đồ của bạn</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
