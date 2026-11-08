# Tái sử dụng

## Kiểm duyệt tin

- layouts/BoCucQuanTri.jsx: giữ navbar/footer/menu admin đang có.
- components/shared/HopThoai.jsx: XacNhanXuLyTin dùng cho xác nhận xử lý, đóng bằng Escape, quản lý focus bằng dialog native.
- components/shared/KhungThongTin.jsx: khung nội dung, thao tác, báo cáo và lịch sử.
- components/shared/PhanTrang.jsx: phân trang danh sách tin.
- data/mockData.js: nguồn nội dung đồ vật mẫu, bổ sung dữ liệu kiểm duyệt trong hook riêng, không sửa dữ liệu công khai.
- pages/admin/tin-dang/BangTinDang.jsx: NhanTrangThai dùng ở bảng và chi tiết.

Không sửa API của các component dùng chung.

- 01/11: kiểm duyệt dùng quan hệ TinDang::baoCao/lichSu, model hiện có và middleware auth/active/admin. Hook dùng api và prepareCsrf; không thay đổi schema hay component chung.
