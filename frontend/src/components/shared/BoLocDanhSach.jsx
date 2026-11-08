import { useId } from 'react'
import { Search } from 'lucide-react'

export default function BoLocDanhSach({ tuKhoa, trangThai, doiTuKhoa, doiTrangThai, nhanTimKiem, goiYTimKiem, nhanTrangThai, nhanHoatDong = 'Đang hoạt động', children }) {
  const ma = useId()

  return (
    <div className="flex flex-col gap-3 border-t border-[#e8efea] px-5 py-4 sm:flex-row sm:px-6">
      <div className="relative min-w-0 flex-1">
        <label htmlFor={`${ma}-tu-khoa`} className="sr-only">{nhanTimKiem}</label>
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#8a9f91]" aria-hidden="true" />
        <input id={`${ma}-tu-khoa`} name="tuKhoa" type="search" value={tuKhoa} onChange={doiTuKhoa} placeholder={goiYTimKiem} className="w-full rounded-xl border border-[#ceded3] bg-[#fafcfb] py-2.5 pl-9 pr-3 text-sm text-[#243c30] outline-none placeholder:text-[#9aaa9f] focus-visible:ring-2 focus-visible:ring-emerald-700" />
      </div>
      {children}
      <div className="sm:w-48">
        <label htmlFor={`${ma}-trang-thai`} className="sr-only">{nhanTrangThai}</label>
        <select id={`${ma}-trang-thai`} name="trangThai" value={trangThai} onChange={doiTrangThai} className="w-full rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-sm text-[#526c5b] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"><option value="tat_ca">Tất cả trạng thái</option><option value="hoat_dong">{nhanHoatDong}</option><option value="ngung_su_dung">Ngừng sử dụng</option></select>
      </div>
    </div>
  )
}
