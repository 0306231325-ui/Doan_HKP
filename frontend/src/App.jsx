import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import BoCucQuanTri from './layouts/BoCucQuanTri'
import TongQuan from './pages/admin/tong-quan/TongQuan'
import DuyetTinDang from './pages/admin/tin-dang/DuyetTinDang'
import DanhSachTinDang from './pages/admin/tin-dang/DanhSachTinDang'
import ChiTietKiemDuyet from './pages/admin/tin-dang/ChiTietKiemDuyet'
import YeuCauNhanLai from './pages/admin/yeu-cau-nhan-lai/YeuCauNhanLai'
import QuanLyDanhMuc from './pages/admin/danh-muc/QuanLyDanhMuc'
import QuanLyDiaDiem from './pages/admin/dia-diem/QuanLyDiaDiem'
import QuanLyCauHoi from './pages/admin/cau-hoi/QuanLyCauHoi'
import DanhSachDo from './pages/danh-sach-do/DanhSachDo'
import AuthPage from './pages/auth/AuthPage'
import YeuCauNhanDo from './pages/yeu-cau-nhan-do/YeuCauNhanDo'
import DangTin from './pages/tin-dang/DangTin'
import ChiTietTinDang from './pages/tin-dang/ChiTietTinDang'
import TrangCaNhan from './pages/trang-ca-nhan/TrangCaNhan'
import { AuthProvider, RequireAuth } from './auth/AuthContext'
import AuthNotice from './auth/AuthNotice'
import QuanLyNguoiDung from './pages/admin/nguoi-dung/QuanLyNguoiDung'
import GioiThieu from './pages/gioi-thieu/GioiThieu'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthNotice />
        <Routes>
          <Route path="/dang-nhap" element={<AuthPage key="login" />} />
          <Route path="/dang-ky" element={<AuthPage key="register" mode="register" />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="danh-sach-do" element={<DanhSachDo />} />
            <Route path="gioi-thieu" element={<GioiThieu />} />
            <Route element={<RequireAuth />}>
              <Route path="yeu-cau-nhan-do" element={<YeuCauNhanDo />} />
              <Route path="dang-tin" element={<DangTin />} />
              <Route path="chi-tiet-tin-dang" element={<ChiTietTinDang />} />
              <Route path="trang-ca-nhan" element={<TrangCaNhan />} />
            </Route>
          </Route>
          <Route element={<RequireAuth admin />}>
            <Route path="/admin" element={<BoCucQuanTri />}>
              <Route index element={<TongQuan />} />
              <Route path="tin-dang" element={<DuyetTinDang />}>
                <Route index element={<DanhSachTinDang />} />
                <Route path=":id" element={<ChiTietKiemDuyet />} />
              </Route>
              <Route path="yeu-cau" element={<YeuCauNhanLai />} />
              <Route path="nguoi-dung" element={<QuanLyNguoiDung />} />
              <Route path="danh-muc" element={<QuanLyDanhMuc />} />
              <Route path="danh-muc/dia-diem" element={<QuanLyDiaDiem />} />
              <Route path="cau-hoi" element={<QuanLyCauHoi />} />
              <Route path="danh-muc/cau-hoi" element={<Navigate to="/admin/cau-hoi" replace />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
