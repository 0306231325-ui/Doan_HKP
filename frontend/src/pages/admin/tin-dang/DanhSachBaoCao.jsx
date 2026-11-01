import { useRef, useState } from 'react'
import KhungThongTin from '../../../components/shared/KhungThongTin'
import { Flag } from 'lucide-react'
import SoLuongBaoCao from './SoLuongBaoCao'

export default function DanhSachBaoCao({ cacBaoCao }) {
  const [trang, datTrang] = useState(1)
  const vungCuon = useRef(null)
  const moiTrang = 5
  const tongTrang = Math.max(1, Math.ceil(cacBaoCao.length / moiTrang))
  const trangHienTai = Math.min(trang, tongTrang)
  const batDau = (trangHienTai - 1) * moiTrang
  function chuyenTrang(trangMoi) {
    datTrang(Math.max(1, Math.min(trangMoi, tongTrang)))
    if (vungCuon.current) vungCuon.current.scrollTop = 0
  }
  return <KhungThongTin tieuDe={`Báo cáo vi phạm (${cacBaoCao.length})`} bieuTuong={Flag}>
    {cacBaoCao.length > 0 && <div className="mb-5 rounded-xl border border-[#e1eae4] p-3"><SoLuongBaoCao baoCao={cacBaoCao} /><p className="mt-2 text-xs leading-5 text-[#718276]">Các phản ánh giúp quản trị viên xem xét có nên ẩn tin. Số lần báo cáo không phải kết luận vi phạm.</p></div>}
    {!cacBaoCao.length ? <p className="text-sm text-[#718276]">Chưa có báo cáo vi phạm cho tin này.</p> : <>
      <div ref={vungCuon} role="region" aria-label="Danh sách báo cáo vi phạm" tabIndex={0} className="max-h-[460px] space-y-4 overflow-y-auto overscroll-contain pr-2 [scrollbar-gutter:stable] focus-visible:outline-2 focus-visible:outline-emerald-700">
        {cacBaoCao.slice(batDau, batDau + moiTrang).map((bc) => <article key={bc.id} className="break-words rounded-xl border border-[#e1eae4] p-4"><h3 className="text-sm font-bold">{bc.lyDo}</h3><p className="mt-1 text-xs text-[#718276]">{bc.nguoiBaoCao} · {bc.thoiGian}</p><p className="my-3 text-sm leading-6 text-[#526c5b]">{bc.moTa}</p>{bc.anh && <details><summary className="cursor-pointer text-xs font-semibold text-emerald-800">Xem bằng chứng</summary><a href={bc.anh} target="_blank" rel="noreferrer"><img src={bc.anh} alt="Bằng chứng báo cáo" className="mt-3 h-40 w-full rounded-xl object-cover" /></a></details>}</article>)}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e1eae4] pt-4">
        <p aria-live="polite" className="text-xs text-[#718276]">{batDau + 1}–{Math.min(batDau + moiTrang, cacBaoCao.length)} / {cacBaoCao.length} báo cáo</p>
        <nav aria-label="Phân trang báo cáo vi phạm" className="flex items-center gap-2 text-xs">
          <button type="button" disabled={trangHienTai === 1} onClick={() => chuyenTrang(trangHienTai - 1)} className="rounded-lg border border-[#ceded3] px-3 py-2 text-emerald-900 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40">← Trước</button>
          <span aria-current="page" className="whitespace-nowrap text-[#526c5b]">{trangHienTai} / {tongTrang}</span>
          <button type="button" disabled={trangHienTai === tongTrang} onClick={() => chuyenTrang(trangHienTai + 1)} className="rounded-lg border border-[#ceded3] px-3 py-2 text-emerald-900 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40">Sau →</button>
        </nav>
      </div>
    </>}
  </KhungThongTin>
}
