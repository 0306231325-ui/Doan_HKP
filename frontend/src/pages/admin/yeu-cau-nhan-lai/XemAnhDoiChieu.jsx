import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import HopThoai from '../../../components/shared/HopThoai'

export default function XemAnhDoiChieu({ anh, khiDong }) {
  const [viTri, datViTri] = useState(0)
  const [anhLoi, datAnhLoi] = useState(null)
  const danhSach = anh.danhSach
  const soAnh = danhSach.length
  const dangXem = danhSach[viTri]
  useEffect(() => {
    function phimTat(e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      e.preventDefault()
      datViTri((cu) => (cu + (e.key === 'ArrowRight' ? 1 : -1) + soAnh) % soAnh)
    }
    window.addEventListener('keydown', phimTat)
    return () => window.removeEventListener('keydown', phimTat)
  }, [soAnh])
  const nutAnh = 'absolute top-1/2 -translate-y-1/2 rounded-full border border-[#d6e4db] bg-white/95 p-3 text-emerald-900 shadow-sm hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700'
  return <HopThoai rong tieuDe={anh.ten} khiDong={khiDong}>
    <div className="relative bg-[#f5f8f6]">
      {anhLoi === dangXem.url ? <div role="alert" className="flex h-[55vh] items-center justify-center p-12 text-center text-sm text-[#607568]">Không tải được ảnh này. Bạn có thể chuyển sang ảnh khác.</div> : <img key={dangXem.url} src={dangXem.url} alt={dangXem.mo_ta || dangXem.ten} onError={() => datAnhLoi(dangXem.url)} style={{ height: '55vh', minHeight: 280 }} className="w-full object-contain p-3" />}
      {soAnh > 1 && <><button type="button" aria-label="Ảnh trước" onClick={() => datViTri((cu) => (cu - 1 + soAnh) % soAnh)} className={`${nutAnh} left-2`}><ChevronLeft size={22} /></button><button type="button" aria-label="Ảnh sau" onClick={() => datViTri((cu) => (cu + 1) % soAnh)} className={`${nutAnh} right-2`}><ChevronRight size={22} /></button></>}
    </div>
    <div className="flex items-center justify-between gap-4 p-4 text-sm text-[#607568]" aria-live="polite" aria-atomic="true"><p className="break-words">{dangXem.mo_ta || dangXem.ten}</p><span className="shrink-0 tabular-nums">{viTri + 1}/{soAnh}</span></div>
  </HopThoai>
}
