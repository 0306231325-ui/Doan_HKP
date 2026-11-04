import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Ellipsis } from 'lucide-react'

export default function MenuThaoTac({ nhan, cacThaoTac }) {
  const [viTri, datViTri] = useState(null)
  const nutMo = useRef(null)
  const menu = useRef(null)
  const ma = useId()

  function dongMenu(khoiPhucFocus = false) {
    datViTri(null)
    if (khoiPhucFocus) nutMo.current?.focus()
  }

  function doiMoMenu() {
    if (viTri) return dongMenu(true)
    const khung = nutMo.current.getBoundingClientRect()
    const cao = cacThaoTac.length * 40 + 16
    datViTri({ left: Math.max(8, Math.min(window.innerWidth - 200, khung.right - 192)), top: khung.bottom + cao + 8 < window.innerHeight ? khung.bottom + 4 : Math.max(8, khung.top - cao - 4) })
  }

  useEffect(function theoDoiMenu() {
    if (!viTri) return
    menu.current?.querySelector('button:not(:disabled)')?.focus()
    function nhanNgoai(suKien) {
      if (!menu.current?.contains(suKien.target) && !nutMo.current?.contains(suKien.target)) datViTri(null)
    }
    function dongKhiCuon() { datViTri(null) }
    document.addEventListener('pointerdown', nhanNgoai)
    window.addEventListener('resize', dongKhiCuon)
    window.addEventListener('scroll', dongKhiCuon, true)
    return function huyTheoDoiMenu() {
      document.removeEventListener('pointerdown', nhanNgoai)
      window.removeEventListener('resize', dongKhiCuon)
      window.removeEventListener('scroll', dongKhiCuon, true)
    }
  }, [viTri])

  function dieuHuongMenu(suKien) {
    if (suKien.key === 'Escape') {
      suKien.preventDefault()
      dongMenu(true)
      return
    }
    if (suKien.key === 'Tab') return dongMenu()
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(suKien.key)) return
    suKien.preventDefault()
    const cacNut = [...menu.current.querySelectorAll('button:not(:disabled)')]
    const hienTai = cacNut.indexOf(document.activeElement)
    const tiep = suKien.key === 'Home' ? 0 : suKien.key === 'End' ? cacNut.length - 1 : (hienTai + (suKien.key === 'ArrowDown' ? 1 : -1) + cacNut.length) % cacNut.length
    cacNut[tiep]?.focus()
  }

  return <>
    <button ref={nutMo} type="button" aria-label={nhan} aria-haspopup="menu" aria-expanded={Boolean(viTri)} aria-controls={viTri ? ma : undefined} onClick={doiMoMenu} onKeyDown={(suKien) => { if (suKien.key === 'ArrowDown' && !viTri) { suKien.preventDefault(); doiMoMenu() } }} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#607568] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700"><Ellipsis className="h-5 w-5" aria-hidden="true" /></button>
    {viTri && createPortal(<div ref={menu} id={ma} role="menu" aria-label={nhan} onKeyDown={dieuHuongMenu} onBlur={(suKien) => { if (!suKien.currentTarget.contains(suKien.relatedTarget)) datViTri(null) }} style={viTri} className="fixed z-50 w-48 rounded-xl border border-[#d6e4db] bg-white p-1.5 shadow-xl">
      {cacThaoTac.map(({ id, nhan: ten, khiChon, voHieu = false, lyDo, nguyHiem = false }) => <button key={id} type="button" role="menuitem" disabled={voHieu} title={lyDo} onClick={() => { dongMenu(true); khiChon() }} className={`flex min-h-10 w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 ${nguyHiem ? 'text-rose-700 hover:bg-rose-50' : 'text-[#243c30] hover:bg-emerald-50'}`}>{ten}</button>)}
    </div>, document.body)}
  </>
}
