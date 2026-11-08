# Luồng đăng ký

- `POST /api/register`: `ho_ten`, `ma_so`, `so_dien_thoai`, `email`, `password`, `password_confirmation`.
- Thành công: HTTP 201 và `message`. Không tự đăng nhập, không cấp token.
- Dữ liệu sai / email trùng: HTTP 422, lỗi trong `errors`. Giới hạn 5 request/phút/IP, vượt giới hạn trả 429.
- Email được trim và chuyển về chữ thường. Mật khẩu 8–72 ký tự, lưu chữ thường theo yêu cầu cho đồ án. Không dùng mật khẩu thật; người có quyền đọc database có thể đọc mật khẩu. API vẫn ẩn trường `mat_khau`.
- Tài khoản lưu hash cũ vẫn đăng nhập bằng mật khẩu gốc; sau lần đăng nhập đúng và tài khoản hoạt động, mật khẩu được chuyển sang chữ thường. Không giải ngược hoặc đặt lại hàng loạt mật khẩu cũ.
- Backend luôn gán `vai_tro=nguoi_dung`, `trang_thai=hoat_dong`. Không dùng cột xác minh tài khoản. Mã sinh viên/giảng viên chưa được xác minh với hệ thống trường; mã số hiện không có ràng buộc duy nhất trong DB.

## Chạy local

1. Cấu hình database MySQL trong `backend/.env`. Với database mới chưa có bảng, chạy `php artisan migrate`. Database cũ `quan_ly_do_that_lac_v4` đã được cập nhật hai vai trò bằng `backend/database/compat_nguoi_dung_roles.sql`; không chạy migration tạo bảng hoặc `migrate:fresh` trên database này.
2. Chạy `php artisan serve --host=127.0.0.1 --port=8000` trong `backend`.
3. Chạy `npm run dev` trong `frontend` và mở `/dang-ky`. Khởi động lại Vite nếu đang chạy để nhận cấu hình proxy mới.

Frontend mặc định dùng `/api`, Vite proxy tới backend cổng 8000. Production cần reverse proxy `/api` tới Laravel hoặc đặt `VITE_API_URL` lúc build và cấu hình CORS phù hợp nếu khác origin.

## Đăng nhập và phân quyền

- `GET /sanctum/csrf-cookie`, sau đó `POST /login` với `email`, `password`: tạo session cookie, không cấp JWT và không lưu token trong localStorage.
- `GET /api/me`: trả thông tin tài khoản đang đăng nhập; `POST /logout`: hủy session.
- Người dùng thường về trang chủ, quản trị viên về `/admin`. Trang cá nhân, đăng tin và yêu cầu nhận đồ cần đăng nhập. Các trang `/admin` chỉ dành cho `quan_tri`.
- API `/api/admin/me` và `/api/users` yêu cầu `auth:sanctum`, `active`, `admin`. `/api/me` yêu cầu `auth:sanctum`, `active`. Các API nghiệp vụ mới cần áp dụng middleware tương ứng và Policy kiểm tra chủ sở hữu từng bản ghi.
- Tài khoản `bi_khoa` không đăng nhập được, phiên đang tồn tại cũng bị từ chối trên API có `active`. Đăng xuất vẫn được phép.
- Login giới hạn 5 lần/phút/IP; sai thông tin trả 422, tài khoản khóa trả 403, chưa đăng nhập trả 401.
- Local dùng Vite proxy cho `/api`, `/sanctum`, `/login`, `/logout`. Khởi động lại Vite khi thay cấu hình. `SANCTUM_STATEFUL_DOMAINS` phải chứa host và port frontend (đã cấu hình localhost/127.0.0.1 cổng 5173, 5174). Production cần proxy cả bốn đường dẫn và HTTPS; cấu hình stateful domains theo domain thực.
- Chức năng quản trị nghiệp vụ hiện vẫn có phần dùng dữ liệu frontend; bảo vệ route không thay thế kiểm tra quyền trong API khi triển khai các chức năng đó.

## Kiểm tra

- Backend: `php artisan test --filter=RegisterTest` (SQLite memory, không chạm dữ liệu MySQL).
- Frontend: `npm run build`, `npm run lint`.
