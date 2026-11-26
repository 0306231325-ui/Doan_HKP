from copy import deepcopy
from pathlib import Path
from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT

src = Path('D:/Downloads/Bảng mô tả cơ sở dữ liệu.docx')
out = Path('D:/Doan_HKP/output/db-description/Bảng mô tả cơ sở dữ liệu hoàn thiện.docx')
doc = Document(src)
pk = ('id', 'bigint unsigned', 'PK, AUTO_INCREMENT')
created = ('created_at', 'datetime', 'NOT NULL, DEFAULT CURRENT_TIMESTAMP', 'Thời điểm tạo bản ghi.')
updated = ('updated_at', 'datetime', 'NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', 'Thời điểm cập nhật gần nhất.')
data = {
'Câu hỏi': [
 (*pk, 'Mã câu hỏi.'),
 ('danh_muc_id', 'bigint unsigned', 'NULL, FK → danh_muc_do_vat.id', 'Danh mục áp dụng câu hỏi; NULL nếu không gắn với một danh mục cụ thể.'),
 ('noi_dung', 'varchar(255)', 'NOT NULL', 'Nội dung câu hỏi dùng để khai báo và đối chiếu đặc điểm đồ vật.'),
 ('kieu_nhap', 'enum', "NOT NULL, DEFAULT 'van_ban'", 'Kiểu nhập gồm van_ban và so.'),
 ('thu_tu', 'int unsigned', 'NOT NULL, DEFAULT 0', 'Thứ tự hiển thị câu hỏi trong danh mục.'),
 ('trang_thai', 'tinyint(1)', 'NOT NULL, DEFAULT 1, CHECK IN (0, 1)', '1 là hoạt động, 0 là ngừng sử dụng.'), created, updated],
'Lịch sử câu hỏi': [
 (*pk, 'Mã phiên bản câu hỏi.'),
 ('cau_hoi_id', 'bigint unsigned', 'NOT NULL, FK → cau_hoi.id; UNIQUE ghép với phien_ban', 'Câu hỏi gốc được lưu phiên bản.'),
 ('phien_ban', 'int unsigned', 'NOT NULL; UNIQUE ghép với cau_hoi_id', 'Số phiên bản của câu hỏi, không trùng trong cùng một câu hỏi.'),
 ('du_lieu', 'json', 'NOT NULL', 'Nội dung và thuộc tính câu hỏi tại thời điểm lưu, giúp đối chiếu đúng phiên bản đã sử dụng.'),
 ('created_at', 'timestamp', 'NOT NULL, DEFAULT CURRENT_TIMESTAMP', 'Thời điểm lưu phiên bản câu hỏi.')],
'Lịch sử tin đăng': [
 (*pk, 'Mã lịch sử tin đăng.'),
 ('tin_dang_id', 'bigint unsigned', 'NOT NULL, FK → tin_dang.id', 'Tin đăng được ghi nhận lịch sử thao tác.'),
 ('nguoi_thuc_hien_id', 'bigint unsigned', 'NULL, FK → nguoi_dung.id', 'Tài khoản thực hiện thao tác, nếu có.'),
 ('hanh_dong', 'varchar(64)', 'NOT NULL', 'Loại thao tác như tạo, sửa, xóa hoặc kiểm duyệt tin đăng.'),
 ('trang_thai_cu', 'varchar(32)', 'NULL', 'Trạng thái trước khi thực hiện thao tác.'),
 ('trang_thai_moi', 'varchar(32)', 'NULL', 'Trạng thái sau khi thực hiện thao tác.'),
 ('noi_dung', 'text', 'NULL', 'Nội dung mô tả thao tác hoặc lý do xử lý.'),
 ('du_lieu_cu', 'json', 'NULL', 'Dữ liệu trước khi thay đổi, nếu được lưu.'),
 ('du_lieu_moi', 'json', 'NULL', 'Dữ liệu sau khi thay đổi, nếu được lưu.'), created],
'Lịch sử yêu cầu': [
 (*pk, 'Mã lịch sử xử lý yêu cầu.'),
 ('yeu_cau_id', 'bigint unsigned', 'NOT NULL, FK → yeu_cau_nhan_do.id', 'Yêu cầu nhận đồ được ghi nhận lịch sử.'),
 ('cuoc_hen_id', 'bigint unsigned', 'NULL, FK ghép cùng yeu_cau_id → cuoc_hen(id, yeu_cau_id)', 'Cuộc hẹn liên quan đến thao tác, phải thuộc đúng yêu cầu.'),
 ('nguoi_thuc_hien_id', 'bigint unsigned', 'NULL, FK → nguoi_dung.id', 'Tài khoản thực hiện thao tác xử lý.'),
 ('hanh_dong', 'varchar(64)', 'NOT NULL', 'Loại thao tác như xét duyệt, tạo lịch hoặc xác nhận bàn giao.'),
 ('trang_thai_cu', 'varchar(32)', 'NULL', 'Trạng thái trước khi thực hiện thao tác.'),
 ('trang_thai_moi', 'varchar(32)', 'NULL', 'Trạng thái sau khi thực hiện thao tác.'),
 ('noi_dung', 'text', 'NULL', 'Nội dung xử lý hoặc lý do thay đổi trạng thái.'), created],
'Lời khai tin đăng': [
 (*pk, 'Mã lời khai của tin đăng.'),
 ('tin_dang_id', 'bigint unsigned', 'NOT NULL, FK → tin_dang.id; UNIQUE ghép với cau_hoi_phien_ban_id', 'Tin đăng chứa câu trả lời đối chiếu của người đăng.'),
 ('cau_hoi_id', 'bigint unsigned', 'NOT NULL, FK → cau_hoi.id', 'Câu hỏi mà người đăng đã trả lời.'),
 ('cau_hoi_phien_ban_id', 'bigint unsigned', 'NOT NULL, FK → lich_su_cau_hoi.id; FK ghép cùng cau_hoi_id → lich_su_cau_hoi(id, cau_hoi_id)', 'Phiên bản câu hỏi được dùng lúc khai báo, phải thuộc đúng câu hỏi gốc.'),
 ('gia_tri_text', 'text', 'NULL, CHECK chỉ một trường giá trị khác NULL', 'Câu trả lời dạng văn bản; không được rỗng khi có giá trị.'),
 ('gia_tri_so', 'decimal(18,4)', 'NULL, CHECK chỉ một trường giá trị khác NULL', 'Câu trả lời dạng số.'),
 ('gia_tri_lua_chon', 'varchar(100)', 'NULL, CHECK chỉ một trường giá trị khác NULL', 'Giá trị lựa chọn; không được rỗng khi có giá trị.'), created, updated],
'Trả lời yêu cầu': [
 (*pk, 'Mã câu trả lời của yêu cầu nhận đồ.'),
 ('yeu_cau_id', 'bigint unsigned', 'NOT NULL, FK ghép cùng tin_dang_id → yeu_cau_nhan_do(id, tin_dang_id)', 'Yêu cầu nhận đồ chứa câu trả lời; phải gắn đúng tin đăng.'),
 ('tin_dang_id', 'bigint unsigned', 'NOT NULL, thuộc các FK ghép của yêu cầu và lời khai', 'Tin đăng dùng để đối chiếu yêu cầu với lời khai gốc.'),
 ('loi_khai_tin_dang_id', 'bigint unsigned', 'NOT NULL, FK ghép cùng tin_dang_id → loi_khai_tin_dang(id, tin_dang_id); UNIQUE ghép với yeu_cau_id', 'Lời khai gốc dùng để đối chiếu; mỗi yêu cầu chỉ trả lời một lần cho mỗi lời khai.'),
 ('gia_tri_text', 'text', 'NULL, CHECK chỉ một trường giá trị khác NULL', 'Câu trả lời dạng văn bản của người yêu cầu; không được rỗng khi có giá trị.'),
 ('gia_tri_so', 'decimal(18,4)', 'NULL, CHECK chỉ một trường giá trị khác NULL', 'Câu trả lời dạng số của người yêu cầu.'),
 ('gia_tri_lua_chon', 'varchar(100)', 'NULL, CHECK chỉ một trường giá trị khác NULL', 'Giá trị lựa chọn của người yêu cầu; không được rỗng khi có giá trị.'),
 ('ket_qua_doi_chieu', 'enum', "NOT NULL, DEFAULT 'chua_danh_gia'", 'Kết quả gồm chua_danh_gia, khop, khong_khop và chua_du_can_cu.'), created, updated],
}

# Preserve all existing content and insert the missing tables under their headings.
for heading in list(doc.paragraphs):
    name = heading.text.strip()
    if name not in data:
        continue
    heading.text = ' ' + name
    heading.paragraph_format.page_break_before = True
    heading.paragraph_format.keep_with_next = True
    heading.paragraph_format.space_before = Pt(12)
    heading.paragraph_format.space_after = Pt(8)
    for run in heading.runs:
        run.font.name = 'Times New Roman'
        run.font.size = Pt(14)
        run.bold = True
    table = doc.add_table(rows=1, cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    widths = [1.45, 1.12, 1.95, 1.75]
    for col, width in zip(table.columns, widths):
        col.width = Inches(width)
    records = [('Cột', 'Kiểu dữ liệu', 'Ràng buộc', 'Mô tả')] + data[name]
    for idx, record in enumerate(records):
        row = table.rows[0] if idx == 0 else table.add_row()
        pr = row._tr.get_or_add_trPr()
        pr.append(OxmlElement('w:cantSplit'))
        if idx == 0:
            pr.append(OxmlElement('w:tblHeader'))
        for col_idx, (cell, value, width) in enumerate(zip(row.cells, record, widths)):
            cell.width = Inches(width)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            cell.text = value
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1
            for run in p.runs:
                run.font.name = 'Times New Roman'
                run.font.size = Pt(11 if col_idx in (1, 2) and idx else 12)
                run.font.color.rgb = RGBColor(0,0,0)
                run.bold = idx == 0
            if idx == 0:
                shade = OxmlElement('w:shd')
                shade.set(qn('w:fill'), 'E7E6E6')
                cell._tc.get_or_add_tcPr().append(shade)
    borders = OxmlElement('w:tblBorders')
    for edge in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
        el = OxmlElement('w:' + edge)
        for k,v in [('val','single'),('sz','4'),('color','D9D9D9')]:
            el.set(qn('w:'+k),v)
        borders.append(el)
    table._tbl.tblPr.append(borders)
    heading._p.addnext(table._tbl)
    spacer = OxmlElement('w:p')
    table._tbl.addnext(spacer)

doc.save(out)
check = Document(out)
assert len(check.tables) == 17
for t, rows in zip(check.tables[-6:], data.values()):
    assert len(t.rows) == len(rows)+1
print(out)
