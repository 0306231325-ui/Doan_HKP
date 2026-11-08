# Tiến độ

## 24/10/2026 — Quản lý, kiểm duyệt tin đăng

- Mở rộng trang có sẵn `/admin/tin-dang` trong BoCucQuanTri.
- Danh sách: thống kê, tìm theo tên đồ/mã tin/người đăng, lọc loại và trạng thái, lọc báo cáo chưa xử lý, phân trang 5 tin.
- Chi tiết `/admin/tin-dang/:id`: nội dung tin, báo cáo, ảnh bằng chứng mẫu, lịch sử kiểm duyệt.
- Thao tác mô phỏng: duyệt đăng, ẩn tin, khôi phục tin, bác bỏ/xác nhận báo cáo. Yêu cầu lý do và ghi chú có nội dung.
- Trạng thái tin và báo cáo độc lập. Dữ liệu React state đặt ở route cha; giữ khi chuyển danh sách/chi tiết, đặt lại khi tải trang hoặc rời khu tin đăng.
- Chưa nối API, chưa lưu database, chưa xác thực quyền quản trị. Không ảnh hưởng danh sách tin công khai.
- Build thành công. Lint không lỗi; ba cảnh báo purity có sẵn ở Footer, AdminFooter và useTongQuan.

## 25/10/2026
- Giới hạn dữ liệu quản lý tin đăng còn 3 tin đầu trong taoTinMau; mỗi trạng thái có 1 tin. Dữ liệu mẫu công khai giữ nguyên.

- Trang /admin/yeu-cau: thêm đúng 1 yêu cầu mẫu, mở chi tiết xác minh, chấp nhận/từ chối và xác nhận bàn giao; ghi lịch sử, reset khi tải lại. Chưa nối backend. Build thành công.

- 25/10: bỏ toàn bộ seed mẫu ở duyệt tin, yêu cầu nhận lại, quản lý địa điểm. Địa điểm lọc các ID seed cũ khỏi dữ liệu đọc localStorage, giữ địa điểm tự thêm. Các trang giữ giao diện/trạng thái rỗng.

- 25/10: quản lý danh mục cũng khởi tạo rỗng, bỏ ID mẫu cũ khỏi dữ liệu đọc localStorage; giữ các danh mục tự thêm. Địa điểm đã xử lý tương tự.

## 01/11/2026 — Nối kiểm duyệt tin với database
- API GET /api/admin/tin-dang, GET/PATCH /api/admin/tin-dang/{tin}: auth:sanctum + active + admin; sử dụng TinDang, BaoCaoTinDang, LichSuTinDang hiện có, không thêm migration.
- Schema chỉ có hien_thi/da_an, đã bỏ chờ duyệt khỏi giao diện. PATCH cập nhật lý do ẩn, người xử lý và lịch sử trong transaction có khóa bản ghi. Báo cáo chap_nhan/tu_choi độc lập trạng thái tin.
- Hook frontend gọi API, chuẩn bị CSRF, hiển thị lỗi và khóa nút khi lưu; không có dữ liệu giả. Danh sách được tải đầy đủ rồi lọc/phân trang tại frontend, nên cần phân trang server khi dữ liệu lớn.
- Kiểm thử SQLite in-memory: 2 bài, 23 assertions đạt. Không thay đổi dữ liệu MySQL khi kiểm tra. Build đạt; lint còn ba cảnh báo purity có sẵn.

- Thông báo thành công kiểm duyệt hiển thị nổi góc trên phải, tự đóng sau 3.5 giây, có nút đóng; timer được dọn khi đổi thông báo/rời trang.

- 01/11: thêm BaoCaoTinDangSeeder local/testing, 5 báo cáo giả lập đánh dấu rõ: 3 cho tin đầu, 2 cho tin thứ hai trong nhóm mau-tra-cuu; chạy lại không trùng/không reset xử lý. Đã seed theo yêu cầu. Bảng và chi tiết hiện tổng số lần, số chưa xử lý; từ 3 báo cáo chưa xử lý gắn nhãn ưu tiên, không tự ẩn tin.

- Theo yêu cầu: báo cáo chỉ đọc, bỏ trạng thái/kết quả và nút xử lý báo cáo trên UI. Số đếm và bộ lọc tính tổng lượt báo cáo, không phân chưa xử lý. Admin quyết định ẩn/khôi phục ở thao tác tin. Dữ liệu báo cáo cũ được giữ.

- Báo cáo vi phạm: vùng cuộn tối đa 460px và phân trang frontend 5 báo cáo/trang. Nút trang nằm ngoài vùng cuộn, đổi trang trở về đầu.

- Chi tiết tin: chuyển thao tác kiểm duyệt xuống dưới nội dung tin ở cột trái; cột phải chỉ có báo cáo. Bỏ lịch sử khỏi giao diện; vẫn ghi lịch sử trong database.
