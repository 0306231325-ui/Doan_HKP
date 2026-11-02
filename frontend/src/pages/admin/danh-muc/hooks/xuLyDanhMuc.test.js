import test from 'node:test'
import assert from 'node:assert/strict'
import { kiemTraDanhMuc, locDanhSachDanhMuc, phanTrangDanhMuc } from './xuLyDanhMuc.js'

test('Chặn tên trùng cả danh mục ngừng sử dụng, cho sửa chính danh mục và kiểm tra giới hạn', () => {
  const danhSach = [{ id: '1', tenDanhMuc: 'Điện thoại', moTa: '', dangHoatDong: false }]
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: '  DIEN   THOAI  ', moTa: '' }, danhSach).tenDanhMuc)
  assert.deepEqual(kiemTraDanhMuc({ ...danhSach[0], moTa: 'Máy và phụ kiện' }, danhSach), {})
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: '   ', moTa: '' }, danhSach).tenDanhMuc)
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: 'a'.repeat(101), moTa: '' }, danhSach).tenDanhMuc)
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: 'Tai nghe', moTa: 'a'.repeat(501) }, danhSach).moTa)
  assert.deepEqual(kiemTraDanhMuc({ id: '', tenDanhMuc: 'a'.repeat(100), moTa: 'a'.repeat(500) }, danhSach), {})
})

test('Tìm kiếm không đổi thứ tự gốc, phân trang giới hạn đúng khi bộ lọc làm giảm kết quả', () => {
  const danhSach = Array.from({ length: 17 }, (_, i) => ({ id: String(i), tenDanhMuc: `Đồ vật ${i}`, moTa: i === 16 ? 'Độc nhất' : '', dangHoatDong: true }))
  const thuTuCu = danhSach.map((muc) => muc.id)
  assert.equal(locDanhSachDanhMuc(danhSach, 'DO   VAT', 'tat_ca').length, 17)
  assert.deepEqual(danhSach.map((muc) => muc.id), thuTuCu)
  assert.equal(phanTrangDanhMuc(danhSach, 2).cacDanhMuc.length, 8)
  assert.equal(phanTrangDanhMuc(danhSach, 99).trangHienTai, 3)
  const loc = phanTrangDanhMuc(locDanhSachDanhMuc(danhSach, 'doc nhat', 'hoat_dong'), 3)
  assert.equal(loc.trangHienTai, 1)
  assert.equal(loc.cacDanhMuc[0].id, '16')
  const rong = phanTrangDanhMuc([], 9)
  assert.equal(rong.trangHienTai, 1)
  assert.equal(rong.tuViTri, 0)
  assert.equal(rong.denViTri, 0)
})
