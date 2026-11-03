import test from 'node:test'
import assert from 'node:assert/strict'
import { phanTrangDanhSach } from './xuLyPhanTrang.js'

test('Dùng cùng hàm cho danh sách 5, 6 hoặc 8 mục mỗi trang, giữ thứ tự nguồn', () => {
  const danhSach = Array.from({ length: 17 }, (_, id) => ({ id }))
  const banDau = structuredClone(danhSach)
  for (const moiTrang of [5, 6, 8]) {
    const ketQua = phanTrangDanhSach(danhSach, 2, moiTrang)
    assert.deepEqual(ketQua.cacMuc.map((muc) => muc.id), Array.from({ length: moiTrang }, (_, i) => moiTrang + i))
    assert.equal(ketQua.tuViTri, moiTrang + 1)
    assert.equal(ketQua.denViTri, moiTrang * 2)
    assert.equal(ketQua.tongTin, 17)
  }
  assert.deepEqual(danhSach, banDau)
})

test('Trang cuối và bộ lọc làm giảm kết quả luôn trả vị trí hợp lệ', () => {
  const danhSach = Array.from({ length: 17 }, (_, id) => ({ id }))
  const cuoi = phanTrangDanhSach(danhSach, 99, 8)
  assert.equal(cuoi.trangHienTai, 3)
  assert.equal(cuoi.tongTrang, 3)
  assert.equal(cuoi.tuViTri, 17)
  assert.equal(cuoi.denViTri, 17)
  assert.deepEqual(cuoi.cacMuc, [{ id: 16 }])
  const sauLoc = phanTrangDanhSach(danhSach.slice(0, 2), 3, 8)
  assert.equal(sauLoc.trangHienTai, 1)
  assert.equal(sauLoc.tuViTri, 1)
  assert.equal(sauLoc.denViTri, 2)
  assert.deepEqual(phanTrangDanhSach([], 8), { cacMuc: [], trangHienTai: 1, tongTrang: 1, tongTin: 0, tuViTri: 0, denViTri: 0 })
})

test('Trang hoặc kích thước không hợp lệ được chuẩn hóa, chuỗi số hợp lệ được chấp nhận', () => {
  const danhSach = Array.from({ length: 17 }, (_, id) => ({ id }))
  for (const trang of [-3, 0, 'NaN', Infinity, 1.5]) assert.equal(phanTrangDanhSach(danhSach, trang).trangHienTai, 1)
  assert.equal(phanTrangDanhSach(danhSach, '2', '8').tuViTri, 9)
  for (const moiTrang of [0, -2, 'sai', Infinity, 1.5]) assert.equal(phanTrangDanhSach(danhSach, 1, moiTrang).cacMuc.length, 6)
})
