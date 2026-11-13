import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import BoCucQuanTri from './layouts/BoCucQuanTri'
import TongQuan from './pages/admin/tong-quan/TongQuan'
import DuyetTinDang from './pages/admin/tin-dang/DuyetTinDang'
import DanhSachTinDang from './pages/admin/tin-dang/DanhSachTinDang'
import ChiTietKiemDuyet from './pages/admin/tin-dang/ChiTietKiemDuyet'
import YeuCauNhanLai from './pages/admin/yeu-cau-nhan-lai/YeuCauNhanLai'
import QuanLyLichHen from './pages/admin/lich-hen/QuanLyLichHen'
import QuanLyDanhMuc from './pages/admin/danh-muc/QuanLyDanhMuc'
import QuanLyDiaDiem from './pages/admin/dia-diem/QuanLyDiaDiem'
import QuanLyCauHoi from './pages/admin/cau-hoi/QuanLyCauHoi'
import DanhSachDo from './pages/danh-sach-do/DanhSachDo'
import AuthPage from './pages/auth/AuthPage'
import YeuCauNhanDo from './pages/yeu-cau-nhan-do/YeuCauNhanDo'
import KiemTraThongTinNhanDo from './pages/yeu-cau-nhan-do/KiemTraThongTinNhanDo'
import TraLoiCauHoiNhanDo from './pages/yeu-cau-nhan-do/TraLoiCauHoiNhanDo'
import FormYeuCauNhanDo from './components/danh-sach-do/FormYeuCauNhanDo'
import TheoDoiYeuCau from './pages/yeu-cau-nhan-do/TheoDoiYeuCau'
import DangTin from './pages/tin-dang/DangTin'
import ChiTietTinDang from './pages/tin-dang/ChiTietTinDang'
import TrangCaNhan from './pages/trang-ca-nhan/TrangCaNhan'
import TinDaDang from './pages/trang-ca-nhan/TinDaDang'
import { AuthProvider, RequireAuth } from './auth/AuthContext'
import AuthNotice from './auth/AuthNotice'
import QuanLyNguoiDung from './pages/admin/nguoi-dung/QuanLyNguoiDung'
import TaoCuocHen from './pages/cuoc-hen/TaoCuocHen'
import TrangCuocHen from './pages/cuoc-hen/TrangCuocHen'
import LapLichHen, { ChonYeuCauHen, NhapThongTinLichHen } from './pages/cuoc-hen/LapLichHen'
import NhapMaBanGiao from './pages/cuoc-hen/NhapMaBanGiao'

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
            <Route path="chi-tiet-tin-dang" element={<ChiTietTinDang />} />
            <Route path="gioi-thieu" element={<Navigate to="/" replace />} />
            <Route element={<RequireAuth />}>
              <Route path="chi-tiet-yeu-cau" element={<TaoCuocHen />} />
              <Route path="tao-cuoc-hen" element={<TaoCuocHen />} />
              <Route path="cuoc-hen">
                <Route index element={<TrangCuocHen />} />
                <Route path="tao" element={<LapLichHen />}>
                  <Route index element={<ChonYeuCauHen />} />
                  <Route path="thong-tin" element={<NhapThongTinLichHen />} />
                </Route>
                <Route path="nhap-ma" element={<NhapMaBanGiao />} />
              </Route>
              <Route path="yeu-cau-nhan-do" element={<YeuCauNhanDo />}>
                <Route index element={<KiemTraThongTinNhanDo />} />
                <Route path="cau-hoi" element={<TraLoiCauHoiNhanDo />} />
                <Route path="anh-va-loi-nhan" element={<FormYeuCauNhanDo />} />
              </Route>
              <Route path="theo-doi-yeu-cau" element={<TheoDoiYeuCau />} />
              <Route path="dang-tin/noi-dung?" element={<DangTin />} />
              <Route path="trang-ca-nhan" element={<TrangCaNhan />} />
              <Route path="tin-da-dang" element={<TinDaDang />} />
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
              <Route path="lich-hen" element={<QuanLyLichHen />} />
              <Route path="nguoi-dung" element={<QuanLyNguoiDung />} />
              <Route path="danh-muc" element={<QuanLyDanhMuc />} />
              <Route path="dia-diem" element={<QuanLyDiaDiem />} />
              <Route path="danh-muc/dia-diem" element={<Navigate to="/admin/dia-diem" replace />} />
              <Route path="cau-hoi" element={<QuanLyCauHoi />} />
              <Route path="danh-muc/cau-hoi" element={<Navigate to="/admin/cau-hoi" replace />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
