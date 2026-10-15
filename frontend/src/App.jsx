import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import BoCucQuanTri from './layouts/BoCucQuanTri'
import TongQuan from './pages/admin/tong-quan/TongQuan'
import DuyetTinDang from './pages/admin/tin-dang/DuyetTinDang'
import YeuCauNhanLai from './pages/admin/yeu-cau-nhan-lai/YeuCauNhanLai'
import QuanLyDanhMuc from './pages/admin/danh-muc/QuanLyDanhMuc'
import QuanLyDiaDiem from './pages/admin/dia-diem/QuanLyDiaDiem'
import QuanLyCauHoi from './pages/admin/cau-hoi/QuanLyCauHoi'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/admin" element={<BoCucQuanTri />}>
          <Route index element={<TongQuan />} />
          <Route path="tin-dang" element={<DuyetTinDang />} />
          <Route path="yeu-cau" element={<YeuCauNhanLai />} />
          <Route path="danh-muc" element={<QuanLyDanhMuc />} />
          <Route path="danh-muc/dia-diem" element={<QuanLyDiaDiem />} />
          <Route path="cau-hoi" element={<QuanLyCauHoi />} />
          <Route path="danh-muc/cau-hoi" element={<Navigate to="/admin/cau-hoi" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
