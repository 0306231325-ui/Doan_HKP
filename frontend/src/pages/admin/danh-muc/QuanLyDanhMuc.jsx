import { Plus } from 'lucide-react'
import BangDanhMuc from './BangDanhMuc'
import FormDanhMuc from './FormDanhMuc'
import XacNhanThaoTac from './XacNhanThaoTac'
import useQuanLyDanhMuc from './hooks/useQuanLyDanhMuc'

export default function QuanLyDanhMuc() {
  const danhMuc = useQuanLyDanhMuc()

  return (
    <section aria-labelledby="tieu-de-danh-muc" className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8efea] px-5 py-5 sm:px-6">
        <h2 id="tieu-de-danh-muc" className="text-lg font-bold text-[#1d3026]">Danh mục đồ vật</h2>
        <button type="button" aria-haspopup="dialog" disabled={Boolean(danhMuc.danhMucDangDoi)} onClick={danhMuc.moThemDanhMuc} className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-60"><Plus className="h-4 w-4" aria-hidden="true" />Thêm danh mục</button>
      </div>
      {danhMuc.dangTai ? <p role="status" className="px-6 py-10 text-center text-sm text-[#607568]">Đang tải danh mục…</p> : danhMuc.loiTai ? <div role="alert" className="space-y-3 p-6 text-center text-sm text-rose-700"><p>{danhMuc.loiTai}</p><button type="button" onClick={danhMuc.taiLai} className="rounded-lg bg-emerald-900 px-4 py-2 font-semibold text-white">Thử lại</button></div> : <BangDanhMuc {...danhMuc} />}
      {danhMuc.bieuMau && !danhMuc.thaoTacChoXacNhan && <FormDanhMuc {...danhMuc} />}
      {danhMuc.thaoTacChoXacNhan && <XacNhanThaoTac {...danhMuc} />}
    </section>
  )
}
