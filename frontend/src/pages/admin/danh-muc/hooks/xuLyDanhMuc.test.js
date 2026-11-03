import test from 'node:test'
import assert from 'node:assert/strict'
import { kiemTraDanhMuc } from './xuLyDanhMuc.js'

test('Thêm mới chặn tên trống, trùng không dấu và kiểm tra giới hạn', () => {
  const danhSach = [{ id: '1', tenDanhMuc: 'Điện thoại', moTa: '', dangHoatDong: false }]
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: '  DIEN   THOAI  ', moTa: '' }, danhSach).tenDanhMuc)
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: '   ', moTa: '' }, danhSach).tenDanhMuc)
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: 'a'.repeat(101), moTa: '' }, danhSach).tenDanhMuc)
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: 'Tai nghe', moTa: 'a'.repeat(501) }, danhSach).moTa)
  assert.deepEqual(kiemTraDanhMuc({ id: '', tenDanhMuc: 'a'.repeat(100), moTa: 'a'.repeat(500) }, danhSach), {})
})
