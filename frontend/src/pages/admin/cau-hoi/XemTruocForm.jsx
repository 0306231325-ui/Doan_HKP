import HopThoai from '../../../components/shared/HopThoai'
import TruongCauHoi from '../../../components/shared/TruongCauHoi'
import { locCauHoi } from './hooks/xuLyCauHoi.js'

export default function XemTruocForm({ danhSach, danhMucChon, dongXemTruoc }) {
  const coTheXem = danhMucChon.dangHoatDong
  const cauHoi = coTheXem ? locCauHoi(danhSach, danhMucChon.id, '', 'hoat_dong') : []

  return (
    <HopThoai tieuDe={`Xem thử form: ${danhMucChon.tenDanhMuc}`} moTa="Bộ câu hỏi này dùng khi đăng tin. Khi xin nhận đồ, người mất trả lời đúng bộ câu hỏi đã lưu với tin nhặt được. Các ô nhập thử không lưu." khiDong={dongXemTruoc}>
      <div className="space-y-5 px-5 py-5 sm:px-6">
        {!cauHoi.length && <p className="rounded-xl bg-[#f5f9f6] px-4 py-5 text-sm leading-6 text-[#718276]">{coTheXem ? 'Chưa có câu hỏi đang hoạt động cho biểu mẫu này.' : 'Danh mục đã ngừng sử dụng hoặc không còn tồn tại.'}</p>}
        <div className="space-y-5">
          {cauHoi.map((muc) => <TruongCauHoi key={muc.id} cauHoi={muc} />)}
        </div>
      </div>
      <div className="flex justify-end border-t border-[#e1eae4] px-5 py-4 sm:px-6"><button type="button" onClick={dongXemTruoc} className="rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-700">Đóng</button></div>
    </HopThoai>
  )
}
