import { useEffect } from 'react'
import { CheckCircle2, CircleAlert, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import './auth-notice.css'

export default function AuthNotice() {
  const location = useLocation()
  const navigate = useNavigate()
  const message = location.state?.authMessage
  const isError = location.state?.authType === 'error'
  const Icon = isError ? CircleAlert : CheckCircle2
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      navigate(location.pathname + location.search, {
        replace: true, state: { ...location.state, authMessage: undefined },
      })
    }, 3500)
    return () => clearTimeout(timer)
  }, [message, location, navigate])
  function dismiss() {
    navigate(location.pathname + location.search, { replace: true, state: { ...location.state, authMessage: undefined } })
  }
  return message && <div key={location.key} className={`auth-toast${isError ? ' auth-toast-error' : ''}`} role={isError ? 'alert' : 'status'} aria-live={isError ? 'assertive' : 'polite'} aria-atomic="true">
    <Icon className="auth-toast-icon" size={22} aria-hidden="true" />
    <span className="auth-toast-message">{message}</span>
    <button type="button" className="auth-toast-close" onClick={dismiss} aria-label="Đóng thông báo">
      <X size={18} aria-hidden="true" />
    </button>
  </div>
}
