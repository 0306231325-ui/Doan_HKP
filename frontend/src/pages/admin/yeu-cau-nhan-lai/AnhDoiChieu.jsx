import { useState } from 'react'
import { Image, ZoomIn } from 'lucide-react'
import api from '../../../services/api'
import XemAnhDoiChieu from './XemAnhDoiChieu'

export default function AnhDoiChieu({ yc }) {
  const [boAnh, datBoAnh] = useState(null)
  if (!yc.minh_chung?.length) return null
  const anhGoc = yc.anh_tin_dang || []
  const minhChung = yc.minh_chung.map((anh, i) => ({ ...anh, url: `${api.defaults.baseURL}/admin/yeu-cau/${yc.id}/anh/${anh.id}`, ten: `Minh chứng ${i + 1}` }))
  return <section aria-label="Ảnh đối chiếu">
    <h4 className="mb-3 flex items-center gap-2 font-bold text-[#315a43]"><Image size={17} aria-hidden="true" />Ảnh đối chiếu</h4>
    <div className="grid gap-4 sm:grid-cols-2">
      <CotAnh tieuDe="Ảnh đồ vật trong tin" anh={anhGoc.map((a, i) => ({ ...a, ten: `Ảnh đồ vật ${i + 1}` }))} khiXem={datBoAnh} />
      <CotAnh tieuDe="Ảnh người xin nhận gửi" anh={minhChung} khiXem={datBoAnh} />
    </div>
    {boAnh && <XemAnhDoiChieu anh={boAnh} khiDong={() => datBoAnh(null)} />}
  </section>
}

function CotAnh({ tieuDe, anh, khiXem }) {
  const dauTien = anh[0]
  return <div className="min-w-0 rounded-xl border border-[#e1eae4] bg-[#fafcfb] p-3">
    <p className="mb-3 text-xs font-semibold text-[#607568]">{tieuDe}</p>
    {dauTien ? <button type="button" aria-haspopup="dialog" aria-label={`Xem ${anh.length} ảnh — ${tieuDe}`} onClick={() => khiXem({ danhSach: anh, ten: tieuDe })} className="block w-full overflow-hidden rounded-lg border border-[#e1eae4] bg-white text-left focus-visible:outline-2 focus-visible:outline-emerald-700">
      <span className="relative block"><img src={dauTien.url} alt={dauTien.mo_ta || dauTien.ten} loading="lazy" className="aspect-[4/3] w-full object-contain" />{anh.length > 1 && <span className="absolute bottom-3 right-3 flex h-12 min-w-12 items-center justify-center rounded-xl bg-black/65 px-3 text-xl font-semibold text-white">+{anh.length - 1}</span>}</span>
      <span className="flex min-h-11 items-center justify-between gap-2 border-t border-[#edf2ee] p-2.5 text-xs text-[#607568]"><span className="line-clamp-2 break-words">{dauTien.mo_ta || dauTien.ten}</span><ZoomIn size={15} className="shrink-0 text-emerald-800" aria-hidden="true" /></span>
    </button> : <p className="py-8 text-center text-sm text-[#718276]">Tin đăng không có ảnh đồ vật.</p>}
  </div>
}

