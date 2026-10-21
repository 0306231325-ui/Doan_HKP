import { CheckCircle2, MapPin, Plus, Search, X } from 'lucide-react'
import DieuHuongDanhMuc from '../../../components/admin/DieuHuongDanhMuc'
import BangDiaDiem from './BangDiaDiem'
import FormDiaDiem from './FormDiaDiem'
import XacNhanTrangThai from './XacNhanTrangThai'
import useQuanLyDiaDiem from './hooks/useQuanLyDiaDiem'

export default function QuanLyDiaDiem() {
  const diaDiem = useQuanLyDiaDiem()

  return (
    <div className="space-y-5">
      <DieuHuongDanhMuc />
      {diaDiem.thongBao && (
        <div role="status" className="flex items-start gap-2.5 rounded-xl border border-[#c6e2cf] bg-[#f0fbf3] px-4 py-3 text-sm text-emerald-900">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1 break-words leading-6">{diaDiem.thongBao}</span>
          <button type="button" onClick={diaDiem.dongThongBao} aria-label="Đóng thông báo" className="rounded-md p-1 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-700"><X className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      )}
      <section aria-labelledby="tieu-de-dia-diem" className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white">
        <div className="px-5 py-6 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 id="tieu-de-dia-diem" className="text-lg font-bold text-[#1d3026]">Địa điểm trong trường</h2>
              <p className="mt-1.5 text-sm leading-6 text-[#718276]">Quản lý các khu vực tìm kiếm và trao trả đồ thất lạc.</p>
            </div>
            <button type="button" onClick={diaDiem.moThemDiaDiem} className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><Plus className="h-4 w-4" aria-hidden="true" />Thêm địa điểm</button>
          </div>
          <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#718276]">
            <div className="flex items-center gap-1.5"><dt>Tổng địa điểm</dt><dd className="font-semibold text-[#243c30]">{diaDiem.tongDiaDiem}</dd></div>
            <div className="flex items-center gap-1.5"><dt>Đang hoạt động</dt><dd className="font-semibold text-emerald-800">{diaDiem.soHoatDong}</dd></div>
            <div className="flex items-center gap-1.5"><dt>Ngừng sử dụng</dt><dd className="font-semibold text-[#526c5b]">{diaDiem.soNgungSuDung}</dd></div>
          </dl>
        </div>
        <div className="flex flex-col gap-3 border-t border-[#e8efea] px-5 py-4 sm:flex-row sm:px-6">
          <div className="relative flex-1">
            <label htmlFor="tim-dia-diem" className="sr-only">Tìm địa điểm</label>
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#8a9f91]" aria-hidden="true" />
            <input id="tim-dia-diem" type="search" value={diaDiem.tuKhoa} onChange={diaDiem.doiTuKhoa} placeholder="Tìm theo tên hoặc mô tả địa điểm…" className="w-full rounded-xl border border-[#ceded3] bg-[#fafcfb] py-2.5 pl-9 pr-3 text-sm text-[#243c30] outline-none placeholder:text-[#9aaa9f] focus-visible:ring-2 focus-visible:ring-emerald-700" />
          </div>
          <div className="sm:w-48">
            <label htmlFor="loc-trang-thai-dia-diem" className="sr-only">Lọc trạng thái địa điểm</label>
            <select id="loc-trang-thai-dia-diem" value={diaDiem.trangThai} onChange={diaDiem.doiTrangThaiLoc} className="w-full rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-sm text-[#526c5b] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"><option value="tat_ca">Tất cả trạng thái</option><option value="hoat_dong">Đang hoạt động</option><option value="ngung_su_dung">Ngừng sử dụng</option></select>
          </div>
        </div>
        <BangDiaDiem {...diaDiem} />
      </section>
      <p className="flex items-start gap-2 text-xs leading-5 text-[#718276]"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />Bản xem thử: thay đổi được lưu trên trình duyệt hiện tại.</p>
      {diaDiem.bieuMau && <FormDiaDiem {...diaDiem} />}
      {diaDiem.diaDiemDoiTrangThai && <XacNhanTrangThai {...diaDiem} />}
    </div>
  )
}
