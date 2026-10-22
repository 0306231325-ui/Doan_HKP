import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/home/Home'
import AuthPage from './pages/auth/AuthPage'
import YeuCauNhanDo from './pages/yeu-cau-nhan-do/YeuCauNhanDo'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dang-nhap" element={<AuthPage key="login" />} />
        <Route path="/dang-ky" element={<AuthPage key="register" mode="register" />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="yeu-cau-nhan-do" element={<YeuCauNhanDo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

