import { Power, RotateCcw } from 'lucide-react'
import HopThoai from '../../../components/shared/HopThoai'

export default function XacNhanTrangThai({ danhMucDoiTrangThai, loiLuu, dongDoiTrangThai, xacNhanDoiTrangThai }) {
  const dangHoatDong = danhMucDoiTrangThai.dangHoatDong
  const BieuTuong = dangHoatDong ? Power : RotateCcw

  return (
    <HopThoai tieuDe={dangHoatDong ? 'Ngừng sử dụng danh mục?' : 'Mở lại danh mục?'} khiDong={dongDoiTrangThai}>
      <div className="px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${dangHoatDong ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-800'}`}>
            <BieuTuong className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold leading-6 text-[#243c30]">{danhMucDoiTrangThai.tenDanhMuc}</p>
            <p className="mt-2 text-sm leading-6 text-[#687d70]">{dangHoatDong ? 'Bạn có thể mở lại danh mục bất cứ lúc nào. Danh mục sẽ được giữ trong danh sách ngừng sử dụng.' : 'Danh mục sẽ được chuyển về danh sách đang hoạt động.'}</p>
          </div>
        </div>
        {loiLuu && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm leading-6 text-red-700">{loiLuu}</p>}
      </div>
      <div className="flex justify-end gap-3 border-t border-[#e1eae4] bg-[#f9fbfa] px-5 py-4 sm:px-6">
        <button type="button" onClick={dongDoiTrangThai} className="rounded-xl border border-[#ceded3] bg-white px-5 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Hủy</button>
        <button type="button" onClick={xacNhanDoiTrangThai} className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${dangHoatDong ? 'bg-amber-700 hover:bg-amber-800' : 'bg-emerald-900 hover:bg-emerald-800'}`}>{dangHoatDong ? 'Ngừng sử dụng' : 'Mở lại danh mục'}</button>
      </div>
    </HopThoai>
  )
}
