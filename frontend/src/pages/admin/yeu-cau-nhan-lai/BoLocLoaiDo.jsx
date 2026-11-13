import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react'

export default function BoLocLoaiDo({ danhSach, giaTri, khiChon, loi, tuKhoa, khiTimKiem, trangThai, khiLocTrangThai }) {
  return <section aria-label="Lọc theo loại đồ" className="rounded-2xl border border-[#d6e4db] bg-white p-4 sm:px-5">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <label htmlFor="loai-do-yeu-cau" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#315a43]"><SlidersHorizontal size={17} aria-hidden="true" />Loại đồ vật</label>
      <div className="relative w-full sm:w-52">
        <select id="loai-do-yeu-cau" value={giaTri} onChange={(e) => khiChon(e.target.value)} className="min-h-11 w-full appearance-none rounded-xl border border-[#ceded3] bg-white py-2.5 pl-3.5 pr-10 text-sm text-[#315a43] transition-colors hover:border-emerald-600 focus-visible:outline-2 focus-visible:outline-emerald-700">
          <option value="">Tất cả loại đồ</option>
          {danhSach.map((loai) => <option key={loai.id} value={loai.id}>{loai.tenDanhMuc}</option>)}
        </select>
        <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#718276]" />
      </div>
      </div>
      <label className="block w-full lg:w-52 lg:shrink-0">
        <span className="sr-only">Trạng thái đồ vật</span>
        <select value={trangThai} onChange={(e) => khiLocTrangThai(e.target.value)} className="min-h-11 w-full rounded-xl border border-[#ceded3] bg-white px-3 text-sm text-[#315a43] focus-visible:outline-2 focus-visible:outline-emerald-700">
          <option value="">Tất cả trạng thái</option>
          <option value="cho_duyet">Chờ duyệt</option>
          <option value="cho_ban_giao">Đã duyệt</option>
          <option value="tu_choi">Từ chối</option>
        </select>
      </label>
      <label className="relative block w-full lg:ml-auto lg:max-w-sm">
        <span className="sr-only">Tìm đồ vật hoặc người yêu cầu</span>
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718276]" />
        <input type="search" value={tuKhoa} onChange={(e) => khiTimKiem(e.target.value)} placeholder="Tên đồ, người gửi hoặc mã yêu cầu…" className="min-h-11 w-full rounded-xl border border-[#ceded3] bg-white py-2.5 pl-10 pr-3 text-sm text-[#315a43] transition-colors hover:border-emerald-600 focus-visible:outline-2 focus-visible:outline-emerald-700" />
      </label>
    </div>
    {loi && <p role="alert" className="mt-3 text-sm text-rose-700">Không tải được danh mục. Nhấn Làm mới để thử lại.</p>}
  </section>
}
