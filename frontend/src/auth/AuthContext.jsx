import { useEffect, useEffectEvent, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import api, { prepareCsrf, sessionApi } from '../services/api'
import { AuthContext, useAuth } from './useAuth'
import useDangXuat from './hooks/useDangXuat'
import XacNhanDangXuat from './XacNhanDangXuat'

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [chuyenHuongKhiKhoa, datChuyenHuongKhiKhoa] = useState(null)

  const baoTaiKhoanBiKhoa = useEffectEvent((thongBao) => {
    datChuyenHuongKhiKhoa(hienTai => hienTai ?? {
      khoaViTri: location.key,
      state: {
        from: location.pathname === '/dang-nhap' ? location.state?.from : location.pathname + location.search + location.hash,
        authMessage: thongBao,
        authType: 'error',
      },
    })
    setUser(null)
  })

  function refresh() {
    setLoading(true)
    setError('')
    setAttempt(value => value + 1)
  }
  useEffect(() => {
    const id = api.interceptors.response.use(response => response, err => {
      const { status, data } = err.response ?? {}
      if (status === 403 && data?.message === 'Tài khoản đã bị khóa.') baoTaiKhoanBiKhoa(data.message)
      if (status === 401) setUser(null)
      return Promise.reject(err)
    })
    return () => api.interceptors.response.eject(id)
  }, [])
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
  async function login(credentials) {
    await prepareCsrf()
    const { data } = await sessionApi.post('/login', credentials)
    datChuyenHuongKhiKhoa(null)
    setUser(data.user)
    setError('')
    return data.user
  }
  async function logout() {
    await prepareCsrf()
    await sessionApi.post('/logout')
    setUser(null)
    navigate('/', {
      replace: true,
      state: { authMessage: 'Đăng xuất thành công.', authType: 'success' },
    })
  }
  function capNhatTaiKhoan(taiKhoan) {
    setUser(taiKhoan)
  }
  if (chuyenHuongKhiKhoa?.khoaViTri === location.key) {
    return <Navigate to="/dang-nhap" replace state={chuyenHuongKhiKhoa.state} />
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
  const dangXuat = useDangXuat()
  return <>
    <button type="button" onClick={dangXuat.moHopThoai} disabled={dangXuat.dangXuLy} className="rounded-xl px-3 py-2 text-sm font-semibold">{dangXuat.dangXuLy ? 'Đang đăng xuất…' : 'Đăng xuất'}</button>
    {dangXuat.moXacNhan && <XacNhanDangXuat {...dangXuat} />}
  </>
}
