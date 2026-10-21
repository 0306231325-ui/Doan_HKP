import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import AuthField from './AuthField'
import './auth.css'

export default function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register'
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setMessage(isRegister
      ? 'Thông tin đăng ký hợp lệ. Chức năng tạo tài khoản sẽ hoạt động khi kết nối backend.'
      : 'Thông tin đã được nhập đầy đủ. Chức năng đăng nhập sẽ hoạt động khi kết nối backend.')
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

          <form onSubmit={handleSubmit} className="auth-form" onChange={() => setMessage('')}>
            {isRegister && <>
              <AuthField label="Họ và tên" name="name" type="text" autoComplete="name" maxLength={100} />
              <AuthField label="MSSV / Mã giảng viên" name="schoolId" type="text" autoComplete="off" maxLength={30} />
              <AuthField label="Số điện thoại" name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="[+]?[0-9 ]{9,20}" title="Nhập số điện thoại từ 9 đến 20 ký tự, gồm chữ số, dấu + đầu số hoặc dấu cách." />
            </>}
            <AuthField label="Email" name="email" type="email" autoComplete="email" maxLength={254} />
            <AuthField label={isRegister ? 'Mật khẩu (tối thiểu 6 ký tự)' : 'Mật khẩu'} name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={isRegister ? 6 : undefined} />
            <button className="auth-submit" type="submit">{isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</button>
            {message && <p className="auth-message" role="status">{message}</p>}
          </form>
        </section>

        <Link className="auth-back" to="/">← Về trang chủ Lạc Ơi</Link>
      </div>
    </main>
  )
}
