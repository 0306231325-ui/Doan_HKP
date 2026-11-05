import test from 'node:test'
import assert from 'node:assert/strict'
import { chonAnhDangTin, kiemTraTinDang, taoDuLieuGui } from './xuLyDangTin.js'

const danhMuc = [{ id: '2' }]
const cauHoi = [{ id: '8', phienBanId: '12', danhMucId: '2', dangHoatDong: true, nhanDangTin: 'Dấu hiệu?', kieuNhap: 'van_ban' }]
const mau = { danhMucId: '2', loaiTin: 'found', tieuDe: 'Tai nghe', ngayXayRa: '2026-11-01', diaDiemId: '', diaDiemChiTiet: 'Thư viện', soDienThoai: '', email: 'nguoi@gmail.com' }

test('Cho liên hệ bằng Gmail hoặc điện thoại, giữ câu riêng bắt buộc', () => {
  assert.equal(kiemTraTinDang(mau, danhMuc, cauHoi, { 8: 'Vết xước' }, '2026-11-04'), '')
  assert.equal(kiemTraTinDang({ ...mau, email: '', soDienThoai: '0901234567' }, danhMuc, cauHoi, { 8: 'Vết xước' }), '')
  assert.match(kiemTraTinDang({ ...mau, email: '' }, danhMuc, cauHoi, { 8: 'Vết xước' }), /ít nhất/)
  assert.match(kiemTraTinDang({ ...mau, email: 'sai-email' }, danhMuc, cauHoi, { 8: 'Vết xước' }), /email hợp lệ/)
  assert.match(kiemTraTinDang(mau, danhMuc, cauHoi, {}), /Vui lòng trả lời/)
})

test('Chặn tiêu đề trắng, ngày sai hoặc tương lai và thiếu vị trí', () => {
  for (const thayDoi of [{ tieuDe: ' ' }, { ngayXayRa: '2026-02-30' }, { ngayXayRa: '2026-11-05' }, { diaDiemChiTiet: '' }]) assert.notEqual(kiemTraTinDang({ ...mau, ...thayDoi }, danhMuc, cauHoi, { 8: 'Đỏ' }, '2026-11-04'), '')
})

test('Multipart giữ ID phiên bản, số 0 và đúng mã gửi khi thử lại', () => {
  const data = taoDuLieuGui(mau, cauHoi, { 8: 0 }, [], 'submission-key')
  assert.equal(data.get('maGui'), 'submission-key')
  assert.equal(data.get('cauTraLoi[0][id]'), '8')
  assert.equal(data.get('cauTraLoi[0][phienBanId]'), '12')
  assert.equal(data.get('cauTraLoi[0][giaTri]'), '0')
})

test('Còn một chỗ thì lấy ảnh đầu và bỏ qua các tệp dư', () => {
  const dau = { type: 'image/jpeg', size: 1024, name: 'dau.jpg' }
  const sau = { type: 'image/png', size: 1024, name: 'sau.png' }
  const quaLon = { type: 'image/jpeg', size: 6 * 1024 * 1024 }
  assert.deepEqual(chonAnhDangTin([dau, sau], 2), { anhSeThem: [dau], loi: '' })
  assert.deepEqual(chonAnhDangTin([dau, quaLon], 2), { anhSeThem: [dau], loi: '' })
  assert.match(chonAnhDangTin([dau], 3).loi, /3 ảnh/)
  assert.match(chonAnhDangTin([quaLon], 0).loi, /5 MB/)
  assert.match(chonAnhDangTin([{ type: 'image/svg+xml', size: 1024 }], 0).loi, /JPG/)
})
