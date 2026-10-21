# Hướng dẫn bắt buộc cho AI trong dự án

Trước mỗi yêu cầu thêm, sửa, di chuyển hoặc gộp code, phải đọc `.agents/AGENTS.md`, `plant/README.md`, `plant/TIEN_DO.md` và `plant/TAI_SU_DUNG.md`. Đọc thêm `plant/FE_FUNCTION_MAP.md` hoặc `plant/BE_FUNCTION_MAP.md` theo phần bị ảnh hưởng, cùng hướng dẫn trong thư mục con nếu có.

Tìm và đọc component, layout, hook, hàm tiện ích hoặc phần backend liên quan đang có trước khi viết mới. Ưu tiên tái sử dụng; chỉ tạo mới khi phần hiện có chưa đáp ứng. Kiểm tra cả nơi đang sử dụng trước khi sửa phần dùng chung.

Sau mỗi thay đổi, cập nhật tài liệu tương ứng trong `plant/`: chức năng đã làm, trạng thái thực tế, phần chưa nối API, khả năng tái sử dụng, đường dẫn và vị trí hàm. Khi nhận yêu cầu mới hoặc tiếp tục sau khi rút gọn ngữ cảnh, phải đọc lại các tài liệu này; không yêu cầu người dùng nhắc lại quy tắc.

`.agents/` và `plant/` là tài liệu nội bộ đang được bỏ qua bởi Git; giữ nguyên quy tắc không commit các thư mục này.
