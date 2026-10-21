# Thiết kế database đồ thất lạc

File `quan_ly_do_that_lac_v4_toi_gon.sql` là bản thiết kế đầy đủ gồm 16 bảng nghiệp vụ, dùng cho MySQL từ 8.0.16. Đây là script tạo schema mới, không phải migration cập nhật database đang có. Chưa áp dụng thiết kế này lên database của ứng dụng.

## Hồ sơ nhận lại và cuộc hẹn

| Bảng | Dữ liệu |
| --- | --- |
| `yeu_cau_nhan_do` | Người xin nhận, tin nhặt được, lời nhắn, thông tin mất đồ và kết quả xét duyệt. |
| `tra_loi_yeu_cau` | Mỗi câu trả lời của người xin nhận là một dòng, liên kết đúng lời khai gốc. |
| `minh_chung_yeu_cau` | Mỗi ảnh hoặc tệp chứng minh là một dòng, chỉ người gửi và người xét duyệt được truy cập. |
| `cuoc_hen` | Người giữ đồ, bên đề xuất, bên xác nhận, thời gian gặp và địa điểm chọn từ `dia_diem`. |
| `ban_giao` | Mã bàn giao, hạn mã, số lần nhập sai và kết quả giao đồ; liên kết duy nhất với một cuộc hẹn. |

`thoi_gian_mat`, `dia_diem_mat_id` và `dia_diem_mat_chi_tiet` thuộc lời khai của người xin nhận, không phải lịch hẹn. Lịch gặp nằm ở `cuoc_hen`; mã và kết quả bàn giao nằm ở `ban_giao`.

`hinh_anh_tin_dang` và `minh_chung_yeu_cau` không lưu `mime_type` hoặc `kich_thuoc_byte`. Mỗi dòng lưu đường dẫn của một tệp cùng thông tin liên quan; nhiều tệp được lưu thành nhiều dòng. Khi viết API tải tệp, vẫn kiểm tra loại và dung lượng trực tiếp từ tệp được tải lên.

## Quy trình

1. Người mất gửi câu trả lời và minh chứng, không phải chọn lịch nhận đồ trong form này.
2. Admin đối chiếu thông tin, yêu cầu bổ sung, từ chối hoặc xác minh chủ đồ. Tại một thời điểm chỉ một yêu cầu được xác minh cho cùng một tin.
3. Hai bên dùng thông tin liên hệ để thống nhất lịch. Chưa xây chat hay lịch trống trong ứng dụng.
4. Một bên ghi lịch đã thỏa thuận vào `cuoc_hen` với trạng thái `cho_xac_nhan`. Bên còn lại xác nhận hoặc từ chối.
5. Sau khi lịch được xác nhận, hệ thống tạo hồ sơ `ban_giao` và cấp mã sáu chữ số riêng cho người nhận; chỉ lưu bản băm và hạn sử dụng ở bảng này.
6. Khi gặp, người nhận kiểm tra đồ rồi cung cấp mã; người đang giữ đồ nhập mã ngay lúc bàn giao. Xác nhận hợp lệ mới ghi kết quả vào `ban_giao`, hoàn tất cuộc hẹn và cập nhật tin thành `da_hoan_tat` trong cùng transaction.
7. Nếu đã giao mà không xác nhận được mã, admin kiểm tra minh chứng trước khi hoàn tất thủ công; phải lưu người xử lý, lý do và lịch sử.

`yeu_cau_nhan_do.trang_thai` chỉ phản ánh xét duyệt: `cho_kiem_tra`, `can_bo_sung`, `da_xac_minh`, `tu_choi`, `da_huy`. Yêu cầu đã xác minh vẫn giữ `da_xac_minh` sau bàn giao; kết quả bàn giao nằm trong `ban_giao`, cuộc hẹn chuyển `da_hoan_tat`, không còn trạng thái `da_tra_do` ở yêu cầu.

Khi xác minh chủ đồ, chuyển tin sang `cho_ban_giao`. Hủy hoặc đổi riêng cuộc hẹn không mở lại tin vì người được duyệt vẫn giữ quyền nhận. Khi hủy yêu cầu vì nhận nhầm và chưa bàn giao, mới chuyển tin về `dang_mo` trong cùng transaction. Không cho tự hủy yêu cầu đã có cuộc hẹn hoàn tất.

## Cuộc hẹn và đổi lịch

- `nguoi_giu_do_id` là người đang thực sự giữ món đồ: người nhặt hoặc tài khoản admin/bảo vệ được giao giữ đồ. Người này khác người xin nhận.
- `nguoi_de_xuat_id` phải là người xin nhận hoặc người đang giữ đồ. `nguoi_xac_nhan_id` phải là bên còn lại; người đề xuất không được tự xác nhận.
- `cuoc_hen.dia_diem_id` bắt buộc tham chiếu `dia_diem.id`. Form chỉ cho chọn địa điểm trong trường còn hoạt động (`trang_thai = 1`); không nhập tự do và không tạo thêm bảng địa điểm. Khi ngừng dùng một địa điểm, vẫn giữ bản ghi để tra lịch hẹn cũ; backend kiểm tra lại địa điểm khi tạo và xác nhận lịch mới.
- Thời gian và địa điểm phải được hai bên đồng ý. Không cho sửa trực tiếp lịch đã xác nhận: hủy lịch cũ có lý do, tạo đề xuất mới và xác nhận lại.
- Một yêu cầu có thể có nhiều lịch bị hủy hoặc từ chối. Chỉ một lịch chờ xác nhận, đã xác nhận hoặc đã hoàn tất được giữ hiệu lực. Sau bàn giao không tạo lịch bàn giao thứ hai cho cùng yêu cầu.
- Hủy hoặc đổi lịch phải xóa hash và hạn mã ở `ban_giao` trong cùng transaction với việc hủy `cuoc_hen`; giữ hồ sơ cũ để tra cứu. Lịch mới có hồ sơ bàn giao mới. Mã hết hạn có thể được cấp lại trên cùng hồ sơ khi lịch vẫn được xác nhận và chưa giao đồ, đặt lại số lần sai sau khi kiểm tra quyền; không tự đổi trạng thái thành đã bàn giao vì hết hạn hay không đến hẹn.
- Khi phát hiện không đúng đồ, không sử dụng mã và không hoàn tất cuộc hẹn. Ghi lý do, hủy cuộc hẹn, chuyển yêu cầu về cần bổ sung hoặc hủy theo quyết định xử lý, để giải phóng quyền nhận nếu không phải chủ đồ.

## Mã và kết quả bàn giao

- `cuoc_hen` có 13 trường, chỉ giữ lịch và xác nhận hai bên. `ban_giao` có 11 trường, gồm mã và kết quả giao đồ. Quan hệ `cuoc_hen` có không hoặc một hồ sơ `ban_giao`; một hồ sơ bắt buộc thuộc đúng một cuộc hẹn nhờ khóa ngoại và UNIQUE `cuoc_hen_id`.
- Chưa bàn giao thì `phuong_thuc_ban_giao`, người xác nhận, thời gian bàn giao và ghi chú đều `NULL`. Hash và hạn mã phải cùng có hoặc cùng trống. Hồ sơ có thể không còn mã khi bị hủy; phải đọc trạng thái cuộc hẹn để xác định còn được nhận đồ hay không.
- Đã bàn giao thì `phuong_thuc_ban_giao`, `nguoi_xac_nhan_ban_giao_id` và `thoi_gian_ban_giao` phải có giá trị; hash và hạn mã phải được xóa. `admin_xac_nhan` còn yêu cầu ghi chú có nội dung. Không thêm trạng thái trùng lặp vào `ban_giao`.
- Không lưu lại người giữ đồ hoặc người nhận trong `ban_giao`: lấy qua `cuoc_hen.nguoi_giu_do_id` và `yeu_cau_nhan_do.nguoi_yeu_cau_id`.

## Thông tin liên hệ và danh tính

- `nguoi_dung.da_xac_minh` cho biết danh tính trong trường đã được kiểm tra. Trường này khác việc xác minh quyền sở hữu một món đồ ở `yeu_cau_nhan_do`.
- Người đăng tự nhập `tin_dang.thong_tin_lien_he` nếu muốn chia sẻ. Không tự lấy `nguoi_dung.so_dien_thoai` để công khai và không bắt buộc họ chia sẻ liên hệ cá nhân.
- Khách và tài khoản chưa xác minh danh tính không được nhận trường liên hệ trong API. Tài khoản đã xác minh danh tính trong trường được xem thông tin chủ bài chủ động chia sẻ; không bắt buộc đợi xét duyệt quyền sở hữu.
- Admin có quyền xử lý hồ sơ. Khi yêu cầu được duyệt, hệ thống cho hai bên trong hồ sơ xem thông tin liên hệ cần cho bàn giao; không gửi cho các người xin nhận khác.
- Nếu chủ bài không chia sẻ liên hệ trên tin, admin hỗ trợ kết nối sau xác minh; không mặc định công khai số tài khoản cho cộng đồng.

## Câu hỏi và lời khai

- Giữ `cau_hoi.bat_buoc`: `1` là bắt buộc trả lời, `0` là có thể bỏ qua. Mặc định `1`, nên các câu hỏi hiện tại vẫn đều bắt buộc; admin có thể cấu hình lại. Cờ này dùng chung cho các loại tin được chọn ở `loai_tin` và câu hỏi tương ứng trong form nhận lại, không thêm cờ bắt buộc riêng hay `can_dap_an_goc`.
- `danh_muc_id = NULL` là câu hỏi chung; có ID thì là câu hỏi riêng của danh mục. `loai_tin` chọn tin mất, tin nhặt được hoặc cả hai. Chỉ lấy câu hỏi đang hoạt động và phiên bản hiện hành để tạo tin mới.
- `loi_khai_tin_dang` lưu mỗi câu trả lời ở một dòng. Mỗi dòng có đúng một giá trị dạng chữ, số hoặc lựa chọn; không nhận chuỗi trống. Câu không bắt buộc bị bỏ qua thì không tạo dòng trả lời. Backend phải kiểm tra đúng kiểu nhập, mã lựa chọn và đủ các câu hỏi áp dụng có `bat_buoc = 1`, vì CHECK trên từng dòng không kiểm tra được việc thiếu cả dòng trả lời.
- Form nhận lại lấy câu hỏi `dung_xac_minh = 1` qua chính lời khai của tin nhặt được, giữ đúng phiên bản. Nếu người nhặt bỏ qua câu không bắt buộc, không hỏi câu đó trong form nhận lại vì không có đáp án gốc để đối chiếu. Không hiển thị đáp án của người nhặt cho người xin nhận.
- Câu trả lời khai dùng thông tin bí mật phải có `cong_khai = 0`. Câu công khai không được coi là bằng chứng đủ để tự động duyệt.
- Khi thay đổi nội dung hoặc lựa chọn, tạo phiên bản câu hỏi mới. Không sửa nội dung phiên bản đang được tin cũ tham chiếu.

## Quy tắc backend phải thực thi khi viết API

Các khóa ngoại, UNIQUE và CHECK trong SQL bảo vệ quan hệ và tính nhất quán trên từng dòng. Các điều kiện nghiệp vụ sau cần được thực thi trong service và transaction, không được coi là đã có API xử lý chỉ nhờ schema:

- Chỉ nhận yêu cầu cho tin `nhat_duoc` còn mở; người xin nhận khác người đang giữ đồ.
- Chỉ tạo hoặc xác nhận hẹn khi yêu cầu đã được admin xác minh và chưa có cuộc hẹn hoàn tất. Kiểm tra người thực hiện là đúng một trong hai bên.
- Chỉ bên còn lại được xác nhận lịch, kiểm tra thời gian hẹn phù hợp. Admin chỉ thay mặt người giữ đồ khi được giao trách nhiệm giữ món đồ.
- Chỉ tạo hoặc cấp lại mã trong `ban_giao` khi cuộc hẹn đang `da_xac_nhan`, yêu cầu vẫn được duyệt và chưa bàn giao. Không chấp nhận mã của lịch hủy, từ chối hoặc đã hoàn tất dù hash chưa được xóa do dữ liệu lỗi.
- Chỉ người nhận được xem mã gốc, chỉ người đang giữ đồ được nhập mã. Mã ràng buộc cuộc hẹn, phải còn hạn, chỉ dùng một lần. Khóa việc nhập sau năm lần sai và yêu cầu cấp mã mới; giới hạn tần suất theo tài khoản và cuộc hẹn.
- Chỉ admin được dùng phương thức `admin_xac_nhan`; phải có minh chứng, lý do và ghi lịch sử. Không hoàn tất chỉ vì một bên tự khai đã giao.
- Khi hoàn tất, khóa các dòng yêu cầu, tin, cuộc hẹn và bàn giao để ngăn xác nhận đồng thời; kiểm tra kết quả bàn giao chưa tồn tại, người nhập đúng là người giữ đồ với phương thức mã hoặc là admin với phương thức thủ công, thời gian bàn giao không trước thời gian xác nhận lịch. Cập nhật `ban_giao`, `cuoc_hen`, tin và lịch sử trong cùng transaction, xóa hash và hạn mã đã dùng. Không cho sửa hoặc hủy cuộc hẹn đã hoàn tất, thay thế kết quả bàn giao, hay cấp lại mã sau khi giao.
- Sau khi tách bảng, CHECK không đối chiếu được dữ liệu giữa `ban_giao` và `cuoc_hen`. Việc chỉ hoàn tất lịch khi đã có kết quả bàn giao, so sánh người nhập với người giữ đồ, so sánh hai mốc thời gian và thu hồi mã khi hủy lịch phải do backend thực hiện; các ràng buộc này chưa phải chức năng API đã triển khai.
- Thay đổi người giữ đồ phải kiểm tra lại quyền, hủy lịch chưa hoàn tất và mã cũ trước khi tạo lịch với người giữ mới.
- Sự kiện cuộc hẹn và bàn giao dùng lại `lich_su_yeu_cau`, điền `cuoc_hen_id`; từ cuộc hẹn truy ra hồ sơ bàn giao duy nhất. Thông báo có thể trỏ tới cuộc hẹn qua `thong_bao.cuoc_hen_id`; không tạo thêm bảng lịch sử hay chat. Không ghi mã gốc hoặc hash vào lịch sử, nội dung thông báo hay log.

## Kiểm tra thiết kế

Chạy `python3 backend/tests/Database/kiem_tra_cuoc_hen.py` từ thư mục gốc dự án.

Bộ kiểm tra dùng SQLite trong bộ nhớ để chạy các tình huống ràng buộc của bảng cuộc hẹn và bàn giao, với chuyển đổi cú pháp MySQL phục vụ kiểm tra. Có kiểm tra khóa ngoại địa điểm trong trường, mỗi cuộc hẹn chỉ có một hồ sơ bàn giao, cặp hash/hạn mã, giới hạn số lần sai, dữ liệu kết quả và lý do xác nhận thủ công. Các câu lệnh cập nhật đồng bộ trong kiểm tra minh họa transaction hợp lệ, chưa kiểm tra được quyền người dùng, xác thực mã hay ngăn chuyển trạng thái sai qua API vì API chưa được viết. Không kết nối database của ứng dụng và không thay thế việc import, kiểm tra trên MySQL 8 trước khi triển khai migration.
