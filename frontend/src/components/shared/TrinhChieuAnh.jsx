import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function TrinhChieuAnh({ danhSachAnh, chuKy = 6000, tocDoChuyen = 'duration-[1200ms]', mauCham = 'bg-white', lapDay = false, className = '', nhan = 'Trình chiếu ảnh' }) {
  const [anhHienTai, datAnhHienTai] = useState(0)
  const [coConTro, datCoConTro] = useState(false)
  const [coTieuDiem, datCoTieuDiem] = useState(false)
  const soAnh = danhSachAnh.length

  useEffect(function tuDongChuyenAnh() {
    if (soAnh < 2 || coConTro || coTieuDiem) return
    const boDem = window.setTimeout(() => datAnhHienTai((hienTai) => (hienTai + 1) % soAnh), chuKy)
    return function huyChuyenAnh() {
      window.clearTimeout(boDem)
    }
  }, [anhHienTai, soAnh, chuKy, coConTro, coTieuDiem])

  function chuyenAnh(chiSo) {
    datAnhHienTai((chiSo + soAnh) % soAnh)
  }

  function roiTieuDiem(suKien) {
    if (!suKien.currentTarget.contains(suKien.relatedTarget)) datCoTieuDiem(false)
  }

  if (!soAnh) return null

  return (
    <div role="region" aria-label={nhan} aria-roledescription="trình chiếu" onMouseEnter={() => datCoConTro(true)} onMouseLeave={() => datCoConTro(false)} onFocusCapture={() => datCoTieuDiem(true)} onBlurCapture={roiTieuDiem} className={`group relative w-full overflow-hidden ${className}`}>
      {danhSachAnh.map(({ src, alt }, viTri) => (
        <div key={src} aria-hidden={viTri !== anhHienTai} className={`absolute inset-0 transition-opacity ${tocDoChuyen} ease-in-out motion-reduce:transition-none ${viTri === anhHienTai ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'}`}>
          <img src={src} alt={alt} className={`h-full w-full ${lapDay ? 'object-cover' : 'object-contain'}`} draggable={false} />
        </div>
      ))}
      {soAnh > 1 && (
        <>
          <button type="button" onClick={() => chuyenAnh(anhHienTai - 1)} aria-label="Ảnh trước" className="absolute top-1/2 left-2.5 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-80 transition-opacity group-hover:opacity-100 hover:bg-black/70 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
          <button type="button" onClick={() => chuyenAnh(anhHienTai + 1)} aria-label="Ảnh tiếp theo" className="absolute top-1/2 right-2.5 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-80 transition-opacity group-hover:opacity-100 hover:bg-black/70 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm">
            {danhSachAnh.map(({ src }, viTri) => <button key={src} type="button" onClick={() => chuyenAnh(viTri)} aria-label={`Chuyển tới ảnh ${viTri + 1}`} aria-current={viTri === anhHienTai ? 'true' : undefined} className="flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white"><span className={`h-2 rounded-full transition-all ${viTri === anhHienTai ? `w-5 ${mauCham}` : 'w-2 bg-white/50'}`} aria-hidden="true" /></button>)}
          </div>
        </>
      )}
    </div>
  )
}
