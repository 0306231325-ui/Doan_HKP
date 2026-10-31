import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, LogOut, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function AccountDropdown({ showProfile = true }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const container = useRef(null)
  const trigger = useRef(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    function outside(event) {
      if (!container.current?.contains(event.target)) setOpen(false)
    }
    function escape(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  async function handleLogout() {
    if (busy) return
    setBusy(true)
    setError('')
    try { await logout() }
    catch { setError('Chưa thể đăng xuất. Vui lòng thử lại.') }
    finally { setBusy(false) }
  }

  if (!user) return null
  const itemClass = 'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700'
  return <div ref={container} className="relative" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }}>
    <button ref={trigger} type="button" onClick={() => setOpen(value => !value)}
      aria-expanded={open} aria-controls={panelId}
      className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700 sm:px-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">{user.anh_dai_dien ? <img src={user.anh_dai_dien} alt="" className="h-full w-full rounded-full object-cover" /> : <UserRound size={18} aria-hidden="true" />}</span>
      <span className="max-w-20 truncate sm:max-w-36">{user.ho_ten}</span>
      <ChevronDown size={16} aria-hidden="true" className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <div id={panelId} className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-32px)] rounded-2xl border border-emerald-100 bg-white p-2 text-gray-700 shadow-xl">
      <div className="mb-1 border-b border-gray-100 px-3 py-3">
        <p className="truncate text-sm font-bold text-emerald-950">{user.ho_ten}</p>
        <p className="mt-1 truncate text-xs text-gray-500">{user.email}</p>
      </div>
      {showProfile && <Link to="/trang-ca-nhan" onClick={() => setOpen(false)} className={itemClass}><UserRound size={18} aria-hidden="true" />Trang cá nhân</Link>}
      <div className="mt-1 border-t border-gray-100 pt-1">
        <button type="button" disabled={busy} onClick={handleLogout} className={`${itemClass} text-red-600 hover:bg-red-50 disabled:opacity-60`}><LogOut size={18} aria-hidden="true" />{busy ? 'Đang đăng xuất…' : 'Đăng xuất'}</button>
      </div>
      {error && <p role="alert" className="px-3 py-2 text-xs text-red-600">{error}</p>}
    </div>}
  </div>
}
