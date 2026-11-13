import { useRef, useState } from 'react'
import KhungThongTin from '../../../components/shared/KhungThongTin'
import { Flag, ShieldCheck } from 'lucide-react'
import PhanTrang from '../../../components/shared/PhanTrang.jsx'
import { phanTrangDanhSach } from '../../../components/shared/xuLyPhanTrang.js'

export default function DanhSachBaoCao({ cacBaoCao }) {
  const [trang, datTrang] = useState(1)
  const vungCuon = useRef(null)
  const phanTrang = phanTrangDanhSach(cacBaoCao, trang, 5)
  function chuyenTrang(trangMoi) {
    datTrang(trangMoi)
    if (vungCuon.current) vungCuon.current.scrollTop = 0
  }
  return <KhungThongTin tieuDe={`Báo cáo vi phạm (${cacBaoCao.length})`} bieuTuong={Flag}>
    {!cacBaoCao.length ? <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#d6e4db] bg-[#f8fbf9] px-4 py-7 text-center"><span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><ShieldCheck className="h-5 w-5" aria-hidden="true" /></span><p className="text-sm font-semibold text-[#315a43]">Chưa có báo cáo vi phạm</p><p className="mt-2 text-sm leading-6 text-[#617568]">Các phản ánh về tin đăng sẽ xuất hiện tại đây.</p></div> : <>
      <div ref={vungCuon} role="region" aria-label="Danh sách báo cáo vi phạm" tabIndex={0} className="max-h-[460px] space-y-4 overflow-y-auto overscroll-contain pr-2 [scrollbar-gutter:stable] focus-visible:outline-2 focus-visible:outline-emerald-700">
        {phanTrang.cacMuc.map((bc) => <article key={bc.id} className="break-words rounded-xl border border-[#e1eae4] p-4"><h3 className="text-sm font-bold">{bc.lyDo}</h3><p className="mt-1 text-xs text-[#718276]">{bc.nguoiBaoCao} · {bc.thoiGian}</p><p className="my-3 text-sm leading-6 text-[#526c5b]">{bc.moTa}</p>{bc.anh && <details><summary className="cursor-pointer text-xs font-semibold text-emerald-800">Xem bằng chứng</summary><a href={bc.anh} target="_blank" rel="noreferrer"><img src={bc.anh} alt="Bằng chứng báo cáo" className="mt-3 h-40 w-full rounded-xl object-cover" /></a></details>}</article>)}
      </div>
      <div className="mt-4"><PhanTrang {...phanTrang} chuyenTrang={chuyenTrang} donVi="báo cáo" nhanDieuHuong="Phân trang báo cáo vi phạm" /></div>
    </>}
  </KhungThongTin>
}
