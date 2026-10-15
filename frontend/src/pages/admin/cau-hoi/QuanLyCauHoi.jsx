import { CheckCircle2, Eye, ListChecks, Plus, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import DanhSachCauHoi from './DanhSachCauHoi'
import FormCauHoi from './FormCauHoi'
import LichSuCauHoi from './LichSuCauHoi'
import XacNhanTrangThai from './XacNhanTrangThai'
import XemTruocForm from './XemTruocForm'
import useQuanLyCauHoi from './hooks/useQuanLyCauHoi'

export default function QuanLyCauHoi() {
  const cauHoi = useQuanLyCauHoi()
  const lopNut = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-40'
  return (
    <div className="space-y-5">
      {cauHoi.thongBao && <div role="status" className="flex items-start gap-2.5 rounded-xl border border-[#c6e2cf] bg-[#f0fbf3] px-4 py-3 text-sm text-emerald-900"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" /><span className="min-w-0 flex-1 break-words leading-6">{cauHoi.thongBao}</span><button type="button" onClick={cauHoi.dongThongBao} aria-label="Đóng thông báo" className="rounded-md p-1 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-700"><X className="h-4 w-4" aria-hidden="true" /></button></div>}
      <section aria-labelledby="tieu-de-cau-hoi" className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white">
        <div className="px-5 py-6 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><h2 id="tieu-de-cau-hoi" className="text-lg font-bold text-[#1d3026]">Câu hỏi theo danh mục</h2><p className="mt-1.5 text-sm leading-6 text-[#718276]">Thiết lập thông tin cần hỏi khi đăng tin và đối chiếu nhận lại đồ.</p></div>
            <div className="flex flex-wrap gap-2"><button type="button" onClick={cauHoi.moXemTruoc} disabled={!cauHoi.danhMucChon} className={`${lopNut} border border-[#ceded3] text-emerald-900 hover:bg-[#f0f6f2]`}><Eye className="h-4 w-4" aria-hidden="true" />Xem trước</button><button type="button" onClick={cauHoi.moThem} disabled={!cauHoi.danhMucChon?.dangHoatDong} className={`${lopNut} bg-emerald-900 text-white hover:bg-emerald-800`}><Plus className="h-4 w-4" aria-hidden="true" />Thêm câu hỏi</button></div>
          </div>
          <div className="mt-6 max-w-md"><label htmlFor="danh-muc-cau-hoi" className="mb-2 block text-xs font-semibold text-[#526c5b]">Danh mục đồ vật</label><select id="danh-muc-cau-hoi" value={cauHoi.danhMucChon?.id || ''} onChange={cauHoi.doiDanhMuc} disabled={!cauHoi.danhMuc.length} className="w-full rounded-xl border border-[#ceded3] bg-[#fafcfb] px-3 py-3 text-sm font-medium text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">{!cauHoi.danhMuc.length && <option value="">Chưa có danh mục</option>}{cauHoi.danhMuc.map((muc) => <option key={muc.id} value={muc.id}>{muc.tenDanhMuc}{muc.dangHoatDong ? '' : ' (Ngừng sử dụng)'}</option>)}</select></div>
          {cauHoi.danhMucChon && <p className="mt-3 text-xs leading-5 text-[#718276]">{cauHoi.tongCauHoi} câu hỏi · Mỗi danh mục có cấu hình riêng cho tin mất và tin nhặt được.</p>}
          {cauHoi.danhMucChon && !cauHoi.danhMucChon.dangHoatDong && <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">Danh mục đã ngừng sử dụng. Mở lại danh mục trước khi thêm hoặc kích hoạt lại câu hỏi.</p>}
        </div>
        {!cauHoi.danhMuc.length ? <div className="border-t border-[#e8efea] px-5 py-8 text-sm leading-6 text-[#687d70]">Tạo danh mục trước khi thiết lập câu hỏi. <Link to="/admin/danh-muc" className="font-semibold text-emerald-900 underline">Đến quản lý danh mục</Link></div> : <>
          <div className="flex flex-col gap-3 border-t border-[#e8efea] px-5 py-4 sm:flex-row sm:px-6">
            <div className="relative flex-1"><label htmlFor="tim-cau-hoi" className="sr-only">Tìm câu hỏi</label><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#8a9f91]" aria-hidden="true" /><input id="tim-cau-hoi" type="search" value={cauHoi.tuKhoa} onChange={cauHoi.doiTuKhoa} placeholder="Tìm nội dung câu hỏi…" className="w-full rounded-xl border border-[#ceded3] bg-[#fafcfb] py-2.5 pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-700" /></div>
            <div className="sm:w-48"><label htmlFor="trang-thai-cau-hoi" className="sr-only">Lọc trạng thái câu hỏi</label><select id="trang-thai-cau-hoi" value={cauHoi.trangThai} onChange={cauHoi.doiTrangThai} className="w-full rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-sm text-[#526c5b] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"><option value="tat_ca">Tất cả trạng thái</option><option value="hoat_dong">Đang dùng</option><option value="ngung_su_dung">Ngừng sử dụng</option></select></div>
          </div>
          <DanhSachCauHoi {...cauHoi} />
          <p aria-live="polite" className="border-t border-[#e1eae4] px-5 py-4 text-xs text-[#718276]">Hiển thị {cauHoi.cacCauHoi.length} trong {cauHoi.tongCauHoi} câu hỏi của danh mục.</p>
        </>}
      </section>
      <p className="flex items-start gap-2 text-xs leading-5 text-[#718276]"><ListChecks className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />Bản xem thử: cấu hình và lịch sử được lưu trên trình duyệt hiện tại, chưa kết nối biểu mẫu đăng tin thực tế.</p>
      {cauHoi.bieuMau && <FormCauHoi {...cauHoi} />}
      {cauHoi.cauHoiDoiTrangThai && <XacNhanTrangThai {...cauHoi} />}
      {cauHoi.lichSu && <LichSuCauHoi {...cauHoi} />}
      {cauHoi.xemTruoc && <XemTruocForm {...cauHoi} />}
    </div>
  )
}
