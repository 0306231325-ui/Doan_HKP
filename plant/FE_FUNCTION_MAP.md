# Bản đồ chức năng frontend đã kiểm tra

## Quản lý tin đăng

- src/App.jsx: route cha admin/tin-dang, index DanhSachTinDang và route con :id ChiTietKiemDuyet.
- pages/admin/tin-dang/DuyetTinDang.jsx: giữ state thông qua hook, thông báo và Outlet context.
- pages/admin/tin-dang/hooks/useDuyetTinDang.js: taoTinMau khởi tạo dữ liệu demo; xuLyTin cập nhật trạng thái hoặc báo cáo và thêm lịch sử; CAC_TRANG_THAI ánh xạ nhãn.
- pages/admin/tin-dang/DanhSachTinDang.jsx: thống kê, lọc, phân trang; doiBoLoc đặt lại trang 1.
- pages/admin/tin-dang/BoLocTinDang.jsx: giao diện bộ lọc.
- pages/admin/tin-dang/BangTinDang.jsx: bảng và NhanTrangThai.
- pages/admin/tin-dang/ChiTietKiemDuyet.jsx: tìm theo id, xử lý không tìm thấy, điều phối hộp thoại xác nhận.
- pages/admin/tin-dang/DanhSachBaoCao.jsx: báo cáo, bằng chứng và kết quả độc lập với trạng thái tin.
- pages/admin/tin-dang/LichSuKiemDuyet.jsx: danh sách lịch sử mới nhất trước.
- pages/admin/tin-dang/XacNhanXuLyTin.jsx: lý do và ghi chú, kiểm tra ghi chú sau trim trước khi xác nhận.

Tất cả dữ liệu kiểm duyệt hiện là frontend demo, chưa có API.

## Yêu cầu nhận lại
- pages/admin/yeu-cau-nhan-lai/hooks/useYeuCauNhanLai.js: state 1 yêu cầu mẫu; xuLy cập nhật trạng thái và lịch sử.
- pages/admin/yeu-cau-nhan-lai/YeuCauNhanLai.jsx: danh sách, chi tiết, hộp thoại; tái sử dụng HopThoai và KhungThongTin. Chỉ frontend.

- Cập nhật 25/10: useDuyetTinDang khởi tạo []; useYeuCauNhanLai khởi tạo null, giao diện ThongBaoTrong. xuLyDiaDiem: taoDiaDiemBanDau trả []; docDanhSachDiaDiem lọc ID mẫu cũ.

## API kiểm duyệt 01/11
- backend/app/Http/Controllers/QuanLyTinDangController.php: danhSach, chiTiet, xuLy; duLieu ánh xạ dữ liệu database sang giao diện. xuLy transaction/lock, chỉ hai trạng thái kiểm duyệt, xử lý báo cáo riêng.
- backend/routes/api.php: ba route trong middleware admin.
- frontend/src/pages/admin/tin-dang/hooks/useDuyetTinDang.js: GET dữ liệu, PATCH thao tác và CSRF. Danh sách vẫn lọc/phân trang frontend.
- backend/tests/Feature/QuanLyTinDangTest.php: quyền, lưu lịch sử, trạng thái độc lập, thao tác trùng và validation.

- useDuyetTinDang: effect timer 3500ms cho thongBao. DuyetTinDang: toast fixed top/right, role=status, nút đóng.

- SoLuongBaoCao.jsx: tổng số lần phản ánh/chưa xử lý và nhãn ưu tiên (>=3 chưa xử lý), dùng trong bảng và DanhSachBaoCao. BaoCaoTinDangSeeder: firstOrCreate theo nội dung mẫu ổn định, không thay trạng thái tin.
