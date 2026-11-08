import test from 'node:test'
import assert from 'node:assert/strict'
import { chuanHoaTuKhoa, kiemTraDiaDiem, locDanhSachDiaDiem } from './xuLyDiaDiem.js'

test('Tìm tên và mô tả không dấu kết hợp trạng thái, không đổi dữ liệu gốc', () => {
  const danhSach = [
    { id: '1', tenDiaDiem: 'Đại sảnh', moTa: 'Tầng hai', dangHoatDong: true },
    { id: '2', tenDiaDiem: 'Nhà xe', moTa: 'Gần đại sảnh', dangHoatDong: false },
    { id: '3', tenDiaDiem: 'Căn tin', moTa: '', dangHoatDong: true },
  ]
  assert.equal(chuanHoaTuKhoa('  ĐẠI   SẢNH  '), 'dai sanh')
  assert.deepEqual(locDanhSachDiaDiem(danhSach, 'dai sanh', 'hoat_dong').map((muc) => muc.id), ['1'])
  assert.deepEqual(locDanhSachDiaDiem(danhSach, 'dai sanh', 'ngung_su_dung').map((muc) => muc.id), ['2'])
  assert.deepEqual(locDanhSachDiaDiem(danhSach, 'tang hai', 'tat_ca').map((muc) => muc.id), ['1'])
  assert.deepEqual(danhSach.map((muc) => muc.id), ['1', '2', '3'])
})

test('Tên trùng địa điểm ngừng sử dụng bị từ chối nhưng được sửa chính địa điểm đó', () => {
  const danhSach = [{ id: '1', tenDiaDiem: 'Thư viện', moTa: '', dangHoatDong: false }]
  assert.ok(kiemTraDiaDiem({ id: '', tenDiaDiem: '  THU   VIEN ', moTa: '' }, danhSach).tenDiaDiem)
  assert.deepEqual(kiemTraDiaDiem({ id: '1', tenDiaDiem: 'Thư viện', moTa: 'Tầng 2' }, danhSach), {})
  assert.ok(kiemTraDiaDiem({ id: '', tenDiaDiem: '   ', moTa: '' }, danhSach).tenDiaDiem)
  assert.ok(kiemTraDiaDiem({ id: '', tenDiaDiem: 'a'.repeat(151), moTa: '' }, danhSach).tenDiaDiem)
  assert.ok(kiemTraDiaDiem({ id: '', tenDiaDiem: 'Phòng đọc', moTa: 'a'.repeat(501) }, danhSach).moTa)
})
