import { useEffect } from 'react'
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './auth-notice.css'

export default function AuthNotice() {
  const location = useLocation()
  const navigate = useNavigate()
  const message = location.state?.authMessage
  const action = location.state?.authAction
  const isError = location.state?.authType === 'error'
  const Icon = isError ? CircleAlert : location.state?.authType === 'info' ? Info : CheckCircle2
  useEffect(() => {
    if (!message || action) return
    const timer = setTimeout(() => {
      navigate(location.pathname + location.search + location.hash, {
        replace: true, state: { ...location.state, authMessage: undefined },
      })
    }, 3500)
    return () => clearTimeout(timer)
  }, [message, action, location, navigate])
  function dismiss() {
    navigate(location.pathname + location.search + location.hash, { replace: true, state: { ...location.state, authMessage: undefined, authAction: undefined } })
  }
  return message && <div key={location.key} className={`auth-toast${isError ? ' auth-toast-error' : ''}${action ? ' animate-none!' : ''}`} role={isError ? 'alert' : 'status'} aria-live={isError ? 'assertive' : 'polite'} aria-atomic="true">
    <Icon className="auth-toast-icon" size={22} aria-hidden="true" />
    <div className="min-w-0">
      <span className="auth-toast-message">{message}</span>
      {action && <Link to={action.to} replace className="mt-1 block w-fit rounded text-sm font-semibold underline underline-offset-2 focus-visible:outline-2">{action.label}</Link>}
    </div>
    <button type="button" className="auth-toast-close" onClick={dismiss} aria-label="Đóng thông báo">
      <X size={18} aria-hidden="true" />
    </button>
  </div>
}
