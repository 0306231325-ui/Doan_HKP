import test from 'node:test'
import assert from 'node:assert/strict'
import { kiemTraDanhMuc, locDanhSachDanhMuc } from './xuLyDanhMuc.js'

test('Thêm mới chặn tên trống, trùng không dấu và kiểm tra giới hạn', () => {
  const danhSach = [{ id: '1', tenDanhMuc: 'Điện thoại', moTa: '', dangHoatDong: false }]
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: '  DIEN   THOAI  ', moTa: '' }, danhSach).tenDanhMuc)
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: '   ', moTa: '' }, danhSach).tenDanhMuc)
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: 'a'.repeat(101), moTa: '' }, danhSach).tenDanhMuc)
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: 'Tai nghe', moTa: 'a'.repeat(501) }, danhSach).moTa)
  assert.deepEqual(kiemTraDanhMuc({ id: '', tenDanhMuc: 'a'.repeat(100), moTa: 'a'.repeat(500) }, danhSach), {})
})

test('Tìm tên hoặc mô tả không dấu kết hợp trạng thái, giữ dữ liệu nguồn để kiểm tra trùng', () => {
  const danhSach = [
    { id: '3', tenDanhMuc: 'Đồ điện tử', moTa: 'Điện thoại, tai nghe', dangHoatDong: true },
    { id: '2', tenDanhMuc: 'Giấy tờ', moTa: null, dangHoatDong: false },
    { id: '1', tenDanhMuc: 'Điện thoại', moTa: '', dangHoatDong: false },
  ]
  const banDau = structuredClone(danhSach)
  assert.deepEqual(locDanhSachDanhMuc(danhSach, { tuKhoa: '  ĐO   DIEN TU  ', trangThai: 'tat_ca' }).map(muc => muc.id), ['3'])
  assert.deepEqual(locDanhSachDanhMuc(danhSach, { tuKhoa: 'dien thoai', trangThai: 'tat_ca' }).map(muc => muc.id), ['3', '1'])
  assert.deepEqual(locDanhSachDanhMuc(danhSach, { tuKhoa: 'dien thoai', trangThai: 'hoat_dong' }).map(muc => muc.id), ['3'])
  assert.deepEqual(locDanhSachDanhMuc(danhSach, { tuKhoa: 'dien thoai', trangThai: 'ngung_su_dung' }).map(muc => muc.id), ['1'])
  assert.deepEqual(locDanhSachDanhMuc(danhSach, { tuKhoa: 'khong ton tai', trangThai: 'tat_ca' }), [])
  assert.deepEqual(locDanhSachDanhMuc(danhSach, { tuKhoa: ' ', trangThai: 'tat_ca' }), danhSach)
  assert.deepEqual(locDanhSachDanhMuc([], { tuKhoa: '', trangThai: 'hoat_dong' }), [])
  assert.deepEqual(danhSach, banDau)
  assert.ok(kiemTraDanhMuc({ tenDanhMuc: 'DIEN THOAI', moTa: '' }, danhSach).tenDanhMuc)
})
