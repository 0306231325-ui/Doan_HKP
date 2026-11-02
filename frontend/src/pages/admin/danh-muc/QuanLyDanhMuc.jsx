import { CheckCircle2, FolderTree, Plus, Power, RefreshCw, Search, X } from 'lucide-react'
import BangDanhMuc from './BangDanhMuc'
import FormDanhMuc from './FormDanhMuc'
import XacNhanTrangThai from './XacNhanTrangThai'
import useQuanLyDanhMuc from './hooks/useQuanLyDanhMuc'

export default function QuanLyDanhMuc() {
  const danhMuc = useQuanLyDanhMuc()

  return (
    <div className="space-y-5">
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[{ nhan: 'Tổng danh mục', soLuong: danhMuc.tongDanhMuc, bieuTuong: FolderTree }, { nhan: 'Đang hoạt động', soLuong: danhMuc.soHoatDong, bieuTuong: CheckCircle2 }, { nhan: 'Ngừng sử dụng', soLuong: danhMuc.soNgungSuDung, bieuTuong: Power }].map(({ nhan, soLuong, bieuTuong: BieuTuong }) => <div key={nhan} className="flex items-center justify-between rounded-2xl border border-[#d6e4db] bg-white px-5 py-4"><div><dt className="text-xs text-[#607568]">{nhan}</dt><dd className="mt-1 text-2xl font-bold text-[#243c30]">{danhMuc.dangTai || danhMuc.loiTai ? '—' : soLuong}</dd></div><BieuTuong className="h-5 w-5 text-[#718276]" aria-hidden="true" /></div>)}
      </dl>
      {danhMuc.thongBao && (
        <div role="status" className="flex items-start gap-2.5 rounded-xl border border-[#c6e2cf] bg-[#f0fbf3] px-4 py-3 text-sm text-emerald-900">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1 break-words leading-6">{danhMuc.thongBao}</span>
          <button type="button" onClick={danhMuc.dongThongBao} aria-label="Đóng thông báo" className="rounded-md p-1 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-700"><X className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      )}
      <section aria-labelledby="tieu-de-danh-muc" className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white">
        <div className="px-5 py-6 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 id="tieu-de-danh-muc" className="text-lg font-bold text-[#1d3026]">Danh mục đồ vật</h2>
              <p className="mt-1.5 text-sm leading-6 text-[#718276]">Phân loại đồ vật để sinh viên dễ đăng tin và tìm kiếm.</p>
            </div>
            <div className="flex flex-wrap gap-2"><button type="button" onClick={danhMuc.taiLai} disabled={danhMuc.dangTai} className="inline-flex items-center gap-2 rounded-xl border border-[#ceded3] px-3 py-2.5 text-sm font-semibold text-[#526c5b] disabled:opacity-40"><RefreshCw className="h-4 w-4" aria-hidden="true" />Tải lại</button><button type="button" disabled={danhMuc.dangTai || Boolean(danhMuc.loiTai)} onClick={danhMuc.moThemDanhMuc} className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><Plus className="h-4 w-4" aria-hidden="true" />Thêm danh mục</button></div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-[#e8efea] px-5 py-4 sm:flex-row sm:px-6">
          <div className="relative flex-1">
            <label htmlFor="tim-danh-muc" className="sr-only">Tìm danh mục</label>
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#8a9f91]" aria-hidden="true" />
            <input id="tim-danh-muc" type="search" value={danhMuc.tuKhoa} onChange={danhMuc.doiTuKhoa} placeholder="Tìm theo tên hoặc mô tả danh mục…" className="w-full rounded-xl border border-[#ceded3] bg-[#fafcfb] py-2.5 pl-9 pr-3 text-sm text-[#243c30] outline-none placeholder:text-[#9aaa9f] focus-visible:ring-2 focus-visible:ring-emerald-700" />
          </div>
          <div className="sm:w-48">
            <label htmlFor="loc-trang-thai-danh-muc" className="sr-only">Lọc trạng thái danh mục</label>
            <select id="loc-trang-thai-danh-muc" value={danhMuc.trangThai} onChange={danhMuc.doiTrangThaiLoc} className="w-full rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-sm text-[#526c5b] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"><option value="tat_ca">Tất cả trạng thái</option><option value="hoat_dong">Đang hoạt động</option><option value="ngung_su_dung">Ngừng sử dụng</option></select>
          </div>
          {danhMuc.coBoLoc && <button type="button" onClick={danhMuc.xoaBoLoc} className="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#607568] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700"><X className="h-4 w-4" aria-hidden="true" />Xóa bộ lọc</button>}
        </div>
        {danhMuc.dangTai ? <p role="status" className="p-10 text-center text-sm text-[#607568]">Đang tải danh mục…</p> : danhMuc.loiTai ? <div role="alert" className="space-y-4 p-10 text-center text-sm text-rose-700"><p>{danhMuc.loiTai}</p><button type="button" onClick={danhMuc.taiLai} className="rounded-xl bg-emerald-900 px-4 py-2.5 font-semibold text-white">Thử lại</button></div> : <BangDanhMuc {...danhMuc} />}
      </section>
      {danhMuc.bieuMau && <FormDanhMuc {...danhMuc} />}
      {danhMuc.danhMucDoiTrangThai && <XacNhanTrangThai {...danhMuc} />}
    </div>
  )
}
