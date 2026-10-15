import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

export default function HopThoai({ tieuDe, moTa, khiDong, children }) {
  const thamChieu = useRef(null)
  const maTieuDe = useId()
  const maMoTa = useId()

  useEffect(function moHopThoai() {
    const hopThoai = thamChieu.current
    const tranCu = document.body.style.overflow
    hopThoai.showModal()
    document.body.style.overflow = 'hidden'

    return function dongHopThoai() {
      hopThoai.close()
      document.body.style.overflow = tranCu
    }
  }, [])

  function xuLyHuy(suKien) {
    suKien.preventDefault()
    khiDong()
  }

  function xuLyNhanNen(suKien) {
    if (suKien.target === suKien.currentTarget) khiDong()
  }

  return (
    <dialog ref={thamChieu} onCancel={xuLyHuy} onClick={xuLyNhanNen} aria-labelledby={maTieuDe} aria-describedby={moTa ? maMoTa : undefined} className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl border-0 bg-white p-0 text-gray-800 shadow-xl backdrop:bg-emerald-950/30">
      <div className="border-b border-[#e1eae4] px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id={maTieuDe} className="text-xl font-bold text-[#1d3026]">{tieuDe}</h2>
          <button type="button" onClick={khiDong} aria-label="Đóng hộp thoại" className="-mr-1 -mt-1 rounded-lg p-1.5 text-[#687d70] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-emerald-700">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {moTa && <p id={maMoTa} className="mt-2 text-sm leading-6 text-[#687d70]">{moTa}</p>}
      </div>
      {children}
    </dialog>
  )
}
