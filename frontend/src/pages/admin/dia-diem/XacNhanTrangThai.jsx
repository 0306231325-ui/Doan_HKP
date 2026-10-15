import { Power, RotateCcw } from 'lucide-react'
import HopThoai from '../../../components/HopThoai'

export default function XacNhanTrangThai({ diaDiemDoiTrangThai, loiLuu, dongDoiTrangThai, xacNhanDoiTrangThai }) {
  const dangHoatDong = diaDiemDoiTrangThai.dangHoatDong
  const BieuTuong = dangHoatDong ? Power : RotateCcw

  return (
    <HopThoai tieuDe={dangHoatDong ? 'Ngừng sử dụng địa điểm?' : 'Mở lại địa điểm?'} khiDong={dongDoiTrangThai}>
      <div className="px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${dangHoatDong ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-800'}`}>
            <BieuTuong className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold leading-6 text-[#243c30]">{diaDiemDoiTrangThai.tenDiaDiem}</p>
            <p className="mt-2 text-sm leading-6 text-[#687d70]">{dangHoatDong ? 'Địa điểm ngừng sử dụng sẽ không được chọn cho tin mới. Thông tin trên các tin cũ vẫn được giữ lại.' : 'Địa điểm sẽ hoạt động trở lại và có thể được chọn khi đăng tin mới.'}</p>
          </div>
        </div>
        {loiLuu && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm leading-6 text-red-700">{loiLuu}</p>}
      </div>
      <div className="flex justify-end gap-3 border-t border-[#e1eae4] bg-[#f9fbfa] px-5 py-4 sm:px-6">
        <button type="button" onClick={dongDoiTrangThai} className="rounded-xl border border-[#ceded3] bg-white px-5 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Hủy</button>
        <button type="button" onClick={xacNhanDoiTrangThai} className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${dangHoatDong ? 'bg-amber-700 hover:bg-amber-800' : 'bg-emerald-900 hover:bg-emerald-800'}`}>{dangHoatDong ? 'Ngừng sử dụng' : 'Mở lại địa điểm'}</button>
      </div>
    </HopThoai>
  )
}
