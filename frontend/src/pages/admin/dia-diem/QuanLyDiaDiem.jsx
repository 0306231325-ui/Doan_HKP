import { CheckCircle2, Plus, X } from 'lucide-react'
import ThongKeTrangThaiDanhSach from '../../../components/admin/ThongKeTrangThaiDanhSach'
import BoLocDanhSach from '../../../components/shared/BoLocDanhSach'
import BangDiaDiem from './BangDiaDiem'
import FormDiaDiem from './FormDiaDiem'
import XacNhanTrangThai from './XacNhanTrangThai'
import useQuanLyDiaDiem from './hooks/useQuanLyDiaDiem'

export default function QuanLyDiaDiem() {
  const diaDiem = useQuanLyDiaDiem()

  return (
    <div className="space-y-5">
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
            <button type="button" disabled={diaDiem.dangTai || Boolean(diaDiem.loiTai)} onClick={diaDiem.moThemDiaDiem} className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><Plus className="h-4 w-4" aria-hidden="true" />Thêm địa điểm</button>
          </div>
          <ThongKeTrangThaiDanhSach nhanTong="Tổng địa điểm" tong={diaDiem.tongDiaDiem} soHoatDong={diaDiem.soHoatDong} soNgungSuDung={diaDiem.soNgungSuDung} />
        </div>
        <BoLocDanhSach tuKhoa={diaDiem.tuKhoa} trangThai={diaDiem.trangThai} doiTuKhoa={diaDiem.doiTuKhoa} doiTrangThai={diaDiem.doiTrangThaiLoc} nhanTimKiem="Tìm địa điểm" goiYTimKiem="Tìm theo tên hoặc mô tả địa điểm…" nhanTrangThai="Lọc trạng thái địa điểm" />
        {diaDiem.dangTai ? <p role="status" className="p-5 text-sm">Đang tải địa điểm…</p> : diaDiem.loiTai ? <div role="alert" className="p-5 text-sm text-red-700">{diaDiem.loiTai} <button type="button" onClick={diaDiem.taiLai}>Thử lại</button></div> : <BangDiaDiem {...diaDiem} />}
      </section>
      {diaDiem.bieuMau && <FormDiaDiem {...diaDiem} />}
      {diaDiem.diaDiemDoiTrangThai && <XacNhanTrangThai {...diaDiem} />}
    </div>
  )
}
