import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../../components/shared/FormField'
import Button from '../../components/shared/Button'
import api, { prepareCsrf } from '../../services/api'
import { useAuth } from '../../auth/useAuth'
import './auth.css'

export default function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register'
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting || loading) return
    const form = event.currentTarget
    const data = new FormData(form)
    setIsSubmitting(true)
    try {
      if (!isRegister) {
        const user = await login({ email: data.get('email'), password: data.get('password') })
        const from = location.state?.from
        const safeFrom = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')
          && !from.startsWith('/dang-nhap') && !from.startsWith('/dang-ky')
          && (!from.startsWith('/admin') || user.vai_tro === 'quan_tri')
        navigate(safeFrom ? from : user.vai_tro === 'quan_tri' ? '/admin' : '/', {
          replace: true, state: { authMessage: 'Đăng nhập thành công.' },
        })
        return
      }
      await prepareCsrf()
      await api.post('/register', {
        ho_ten: data.get('name'),
        ma_so: data.get('schoolId'),
        so_dien_thoai: data.get('phone'),
        email: data.get('email'),
        password: data.get('password'),
        password_confirmation: data.get('password_confirmation'),
      })
      form.reset()
      navigate('/dang-nhap', { replace: true, state: {
        authMessage: 'Đăng ký thành công. Vui lòng đăng nhập.', authType: 'success',
      } })
    } catch (error) {
      if (isRegister) {
        const status = error.response?.status
        const details = status === 422
          ? Object.values(error.response.data.errors || {}).flat().join(' ')
          : ''
        const failureMessage = status === 422
          ? `Đăng ký thất bại. ${details || 'Vui lòng kiểm tra lại thông tin.'}`
          : status === 429 ? 'Bạn đã thử quá nhiều lần. Vui lòng đợi một phút rồi thử lại.'
          : 'Đăng ký thất bại. Không thể kết nối hoặc xử lý yêu cầu lúc này. Vui lòng thử lại sau.'
        navigate(location.pathname + location.search, { replace: true, state: {
          ...location.state, authMessage: failureMessage, authType: 'error',
        } })
        return
      }
      const status = error.response?.status
      const details = status === 422
        ? Object.values(error.response.data.errors || {}).flat().join(' ')
        : ''
      const failureMessage = status === 422
        ? details || 'Vui lòng kiểm tra email và mật khẩu.'
        : status === 429 ? 'Bạn đã thử quá nhiều lần. Vui lòng đợi một phút rồi thử lại.'
        : status === 403 ? error.response.data.message || 'Tài khoản không được phép đăng nhập.'
        : 'Không thể đăng nhập lúc này. Vui lòng thử lại sau.'
      navigate(location.pathname + location.search, { replace: true, state: {
        ...location.state, authMessage: failureMessage, authType: 'error',
      } })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <header className="auth-heading">
          <h1>Chào bạn <span role="img" aria-label="Vẫy tay">👋</span></h1>
          <p>Dành cho sinh viên và giảng viên của trường.</p>
        </header>

        <section className="auth-card" aria-label={isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập tài khoản'}>
          <nav className="auth-tabs" aria-label="Tài khoản">
            <NavLink to="/dang-nhap" className={({ isActive }) => isActive ? 'auth-tab active' : 'auth-tab'}>Đăng nhập</NavLink>
            <NavLink to="/dang-ky" className={({ isActive }) => isActive ? 'auth-tab active' : 'auth-tab'}>Đăng ký</NavLink>
          </nav>

          <form onSubmit={handleSubmit} className="auth-form" aria-busy={isSubmitting}>
            <fieldset className="auth-fields" disabled={isSubmitting || loading}>
            {isRegister && <>
              <FormField required label="Họ và tên" name="name" type="text" autoComplete="name" maxLength={100}
                onChange={(event) => {
                  const value = event.target.value
                  event.target.setCustomValidity(!value.trim()
                    ? 'Vui lòng nhập họ và tên, không được chỉ chứa khoảng trắng.'
                    : !/^[\p{L}\p{M} ]+$/u.test(value)
                      ? 'Họ và tên chỉ được chứa chữ cái và khoảng trắng.'
                      : '')
                }} />
              <FormField required label="MSSV / Mã giảng viên" name="schoolId" type="text" autoComplete="off" minLength={6} maxLength={20}
                pattern="[A-Za-z0-9]{6,20}"
                title="Nhập từ 6 đến 20 ký tự, chỉ gồm chữ cái không dấu và số; không chứa khoảng trắng hoặc ký tự đặc biệt." />
              <FormField required label="Số điện thoại" name="phone" type="tel" autoComplete="tel" inputMode="numeric" maxLength={10} pattern="0[0-9]{0,9}" title="Số điện thoại phải bắt đầu bằng số 0 và chỉ chứa chữ số, tối đa 10 số." />
            </>}
            <FormField required label="Email" name="email" type={isRegister ? 'text' : 'email'} inputMode="email" autoComplete="email" maxLength={191}
              pattern={isRegister ? '[A-Za-z0-9]+@(?:[A-Za-z0-9](?:[A-Za-z0-9\\x2d]*[A-Za-z0-9])?\\.)+edu\\.vn' : undefined}
              title={isRegister ? 'Email phải có đuôi .edu.vn; phần tên chỉ gồm chữ cái không dấu và số, không chứa khoảng trắng hoặc ký tự đặc biệt.' : undefined}
              onInput={isRegister ? (event) => {
                const value = event.currentTarget.validity.badInput || /\s/.test(event.currentTarget.value)
                event.currentTarget.setCustomValidity(value ? 'Email không được chứa khoảng trắng.' : '')
              } : undefined} />
            <FormField required label={isRegister ? 'Mật khẩu (tối thiểu 8 ký tự)' : 'Mật khẩu'} name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={isRegister ? 8 : undefined} maxLength={isRegister ? 72 : undefined} />
            {isRegister && <FormField required label="Nhập lại mật khẩu" name="password_confirmation" type="password" autoComplete="new-password" minLength={8} maxLength={72} />}
            <Button className="auth-submit" type="submit">{isSubmitting ? (isRegister ? 'Đang đăng ký…' : 'Đang đăng nhập…') : isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</Button>
            </fieldset>
          </form>
        </section>

        <Link className="auth-back" to="/">← Về trang chủ Lạc Ơi</Link>
      </div>
    </main>
  )
}

