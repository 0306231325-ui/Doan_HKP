import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import api, { prepareCsrf, sessionApi } from '../services/api'
import { AuthContext, useAuth } from './useAuth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  function refresh() {
    setLoading(true)
    setError('')
    setAttempt(value => value + 1)
  }
  useEffect(() => {
    let cancelled = false
    api.get('/me').then(({ data }) => {
      if (!cancelled) setUser(data.user)
    }).catch(err => {
      if (cancelled) return
      setUser(null)
      if (![401, 403].includes(err.response?.status)) setError('Không thể kiểm tra phiên đăng nhập. Vui lòng thử lại.')
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [attempt])
  useEffect(() => {
    const id = api.interceptors.response.use(response => response, err => {
      if (err.response?.status === 401 || (err.response?.status === 403 && err.response?.data?.message === 'Tài khoản đã bị khóa.')) setUser(null)
      return Promise.reject(err)
    })
    return () => api.interceptors.response.eject(id)
  }, [])
  async function login(credentials) {
    await prepareCsrf()
    const { data } = await sessionApi.post('/login', credentials)
    setUser(data.user)
    setError('')
    return data.user
  }
  async function logout() {
    await prepareCsrf()
    await sessionApi.post('/logout')
    setUser(null)
  }
  function capNhatTaiKhoan(taiKhoan) {
    setUser(taiKhoan)
  }
  return <AuthContext.Provider value={{ user, loading, error, refresh, login, logout, capNhatTaiKhoan }}>{children}</AuthContext.Provider>
}

export function RequireAuth({ admin = false }) {
  const { user, loading, error, refresh } = useAuth()
  const location = useLocation()
  if (loading) return <p role="status">Đang kiểm tra đăng nhập…</p>
  if (error) return <div role="alert">{error} <button onClick={refresh}>Thử lại</button></div>
  if (!user) return <Navigate to="/dang-nhap" replace state={{ from: location.pathname + location.search }} />
  if (admin && user.vai_tro !== 'quan_tri') return <Navigate to="/" replace />
  return <Outlet />
}

export function LogoutButton() {
  const { logout } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function handleLogout() {
    setBusy(true)
    setError('')
    try { await logout() } catch { setError('Chưa thể đăng xuất. Vui lòng thử lại.') }
    finally { setBusy(false) }
  }
  return <span><button type="button" onClick={handleLogout} disabled={busy} className="rounded-xl px-3 py-2 text-sm font-semibold">{busy ? 'Đang đăng xuất…' : 'Đăng xuất'}</button>{error && <span role="alert">{error}</span>}</span>
}
