import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function PhanTrang({ trangHienTai = 1, tongTrang = 1, tongTin = 0, tuViTri = 0, denViTri = 0, chuyenTrang, donVi = 'tin', nhanDieuHuong = 'Phân trang danh sách đồ' }) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-[#d6e4db] py-5 sm:flex-row">
      <p aria-live="polite" className="text-xs text-[#687d70]">{tongTin > 0 ? <>Hiển thị {tuViTri}–{denViTri} trong <strong className="font-bold text-emerald-900 underline decoration-emerald-700 underline-offset-4">{tongTin} {donVi}</strong>.</> : `Không có ${donVi} phù hợp`}</p>
      <nav aria-label={nhanDieuHuong} className="flex items-center gap-3">
        <button type="button" disabled={trangHienTai === 1} onClick={() => chuyenTrang(trangHienTai - 1)} className="inline-flex items-center gap-1 rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-xs font-semibold text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-35"><ChevronLeft className="h-4 w-4" aria-hidden="true" />Trang trước</button>
        <span aria-current="page" className="whitespace-nowrap rounded-xl bg-emerald-900 px-3 py-2.5 text-xs font-semibold text-white">Trang {trangHienTai} / {tongTrang}</span>
        <button type="button" disabled={trangHienTai === tongTrang} onClick={() => chuyenTrang(trangHienTai + 1)} className="inline-flex items-center gap-1 rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-xs font-semibold text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-35">Trang sau<ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
      </nav>
    </div>
  )
}
