import { layQuyTacCauHoi } from '../../../../components/shared/quyTacCauHoi.js'
import assert from 'node:assert/strict'
import test from 'node:test'
import { kiemTraCauHoi, layCauHoiXemTruoc, locCauHoi, taoBieuMau } from './xuLyCauHoi.js'
import { kiemTraTinDang } from '../../../tin-dang/hooks/xuLyDangTin.js'

const danhMuc = [{ id: '1', tenDanhMuc: 'Điện tử', dangHoatDong: true }, { id: '2', tenDanhMuc: 'Giấy tờ', dangHoatDong: false }]
function cauThu(ghiDe = {}) {
  return { ...taoBieuMau('1'), id: '1', phienBan: 1, nhanDangTin: 'Đặc điểm đồ vật?', ...ghiDe }
}

test('Form có kiểu Văn bản mặc định, không có cấu hình loại tin hoặc lựa chọn', () => {
  const mau = taoBieuMau()
  for (const ten of ['luaChon', 'nhanNhanLai', 'apDung']) assert.equal(Object.hasOwn(mau, ten), false)
  assert.equal(mau.danhMucId, null)
  assert.equal(mau.kieuNhap, 'van_ban')
  assert.deepEqual(kiemTraCauHoi({ ...mau, nhanDangTin: 'Đồ vật?' }, [], []), {})
})

test('Chặn câu trùng không dấu ở phạm vi giao nhau kể cả câu ẩn', () => {
  const cu = cauThu({ dangHoatDong: false })
  const moi = cauThu({ id: '', nhanDangTin: ' DAC DIEM DO VAT? ' })
  assert.ok(kiemTraCauHoi(moi, [cu], danhMuc).nhanDangTin)
  assert.ok(kiemTraCauHoi({ ...moi, danhMucId: null }, [cu], danhMuc).nhanDangTin)
  assert.equal(kiemTraCauHoi({ ...moi, danhMucId: '3' }, [cu], [...danhMuc, { id: '3' }]).nhanDangTin, undefined)
})

test('Kiểm tra nội dung, thứ tự và danh mục hoạt động', () => {
  assert.ok(kiemTraCauHoi(cauThu({ nhanDangTin: ' ' }), [], danhMuc).nhanDangTin)
  assert.ok(kiemTraCauHoi(cauThu({ kieuNhap: 'chon_mot' }), [], danhMuc).kieuNhap)
  assert.deepEqual(kiemTraCauHoi(cauThu({ kieuNhap: 'so' }), [], danhMuc), {})
  assert.ok(kiemTraCauHoi(cauThu({ thuTu: 0 }), [], danhMuc).thuTu)
  assert.ok(kiemTraCauHoi(cauThu({ danhMucId: '999' }), [], danhMuc).danhMucId)
  assert.ok(kiemTraCauHoi(cauThu({ danhMucId: '2' }), [], danhMuc).danhMucId)
  const cu = cauThu({ danhMucId: '2' })
  assert.deepEqual(kiemTraCauHoi(cu, [cu], danhMuc), {})
})

test('Mọi câu theo danh mục dùng cho cả hai loại tin và nhận lại, luôn giữ kín dù cấu hình cũ khác', () => {
  const cau = cauThu({ apDung: { mat: { suDung: false, congKhai: true }, nhat: { suDung: false, dungXacMinh: false } } })
  const quyTac = layQuyTacCauHoi(cau)
  assert.deepEqual(quyTac, { batBuoc: true, congKhai: false, dungNhanLai: true })
  for (const form of ['mat', 'nhat', 'nhan_lai']) assert.deepEqual(layCauHoiXemTruoc([cau], '1', form), [cau])
  assert.deepEqual(kiemTraCauHoi(cau, [], danhMuc), {})
})

test('Câu chung dùng hai loại tin, không bắt buộc và giữ cách hiển thị hiện tại', () => {
  const cu = cauThu({ danhMucId: null })
  assert.deepEqual(layQuyTacCauHoi(cu), { batBuoc: false, congKhai: true, dungNhanLai: false })
  assert.deepEqual(layCauHoiXemTruoc([cu], '1', 'mat'), [cu])
  assert.deepEqual(layCauHoiXemTruoc([cu], '1', 'nhat'), [cu])
  assert.deepEqual(layCauHoiXemTruoc([cu], '1', 'nhan_lai'), [])
})

test('Tìm/lọc từng nhóm, ghép chung trước riêng và loại câu ẩn', () => {
  const ds = [cauThu(), cauThu({ id: '2', danhMucId: null, nhanDangTin: 'Tên đồ vật?' }), cauThu({ id: '3', dangHoatDong: false })]
  assert.deepEqual(locCauHoi(ds, '1', 'dac diem', 'hoat_dong').map(c => c.id), ['1'])
  assert.deepEqual(layCauHoiXemTruoc(ds, '1', 'mat').map(c => c.id), ['2', '1'])
  assert.deepEqual(layCauHoiXemTruoc(ds, null, 'nhat').map(c => c.id), ['2'])
  assert.deepEqual(layCauHoiXemTruoc(ds, '', 'mat'), [])
})

test('Dùng ID để sửa và kiểm tra trùng, không gộp mất các câu khi không có UUID', () => {
  const a = cauThu()
  const b = cauThu({ id: '2', nhanDangTin: 'Màu sắc?' })
  const ds = [a, b]
  assert.deepEqual(locCauHoi(ds, '1').map(c => c.id), ['1', '2'])
  assert.deepEqual(kiemTraCauHoi({ ...a, nhanDangTin: 'Đặc điểm đồ vật?' }, ds, danhMuc), {})
  assert.ok(kiemTraCauHoi({ ...a, id: '', nhanDangTin: a.nhanDangTin }, ds, danhMuc).nhanDangTin)
  assert.ok(kiemTraCauHoi({ ...a, nhanDangTin: b.nhanDangTin }, ds, danhMuc).nhanDangTin)
  assert.deepEqual(ds, [a, b])
})

test('Đăng tin bắt buộc trả lời câu danh mục và kiểm tra độ dài', () => {
  const cau = cauThu()
  const duLieu = { danhMucId: '1', loaiTin: 'lost', tieuDe: 'Tin thử', ngayXayRa: '2026-01-01', diaDiemChiTiet: 'Thư viện', soDienThoai: '0901234567', email: '' }
  assert.equal(kiemTraTinDang(duLieu, danhMuc, [cau], { 1: 'Đen, có vết xước' }), '')
  assert.match(kiemTraTinDang(duLieu, danhMuc, [cau], { 1: 'a'.repeat(2001) }), /2000/)
  assert.match(kiemTraTinDang(duLieu, danhMuc, [cau], {}), /Vui lòng trả lời/)
  assert.match(kiemTraTinDang(duLieu, danhMuc, [], {}), /chưa có câu hỏi/)
})
