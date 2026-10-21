import test from 'node:test'
import assert from 'node:assert/strict'
import { CATEGORIES, LOCATIONS, MOCK_ITEMS } from '../../../data/mockData.js'
import { boLocBanDau, docBoLoc, kiemTraNgay, locDoVat, phanTrangDoVat } from './xuLyDanhSachDo.js'

test('Tìm không dấu theo đặc điểm, vị trí và mã tin, kết hợp loại tin và các ID bộ lọc', () => {
  assert.deepEqual(locDoVat(MOCK_ITEMS, { ...boLocBanDau, tuKhoa: 'SINH VIEN NGUYEN' }).map((muc) => muc.id), [1])
  assert.deepEqual(locDoVat(MOCK_ITEMS, { ...boLocBanDau, tuKhoa: 'bd-2026-0045', loaiTin: 'lost', danhMuc: 'bags', diaDiem: 'canteen_a3' }).map((muc) => muc.id), [2])
  assert.deepEqual(locDoVat(MOCK_ITEMS, { ...boLocBanDau, tuKhoa: 'VI DA', loaiTin: 'found' }), [])
  assert.deepEqual(locDoVat(MOCK_ITEMS, { ...boLocBanDau, tuKhoa: 'VI DA', loaiTin: 'lost' }).map((muc) => muc.id), [2])
  assert.deepEqual(locDoVat(MOCK_ITEMS, { ...boLocBanDau, diaDiem: 'library' }).map((muc) => muc.id), [1])
  assert.equal(locDoVat(MOCK_ITEMS, { ...boLocBanDau, danhMuc: 'cards', diaDiem: 'canteen_a3' }).length, 0)
})

test('Khoảng ngày gồm cả hai đầu, chặn ngày không hợp lệ và ngày bắt đầu sau kết thúc', () => {
  assert.equal(kiemTraNgay('2026-10-12', '2026-10-12'), '')
  assert.deepEqual(locDoVat(MOCK_ITEMS, { ...boLocBanDau, tuNgay: '2026-10-12', denNgay: '2026-10-12' }).map((muc) => muc.id), [1, 3, 6])
  assert.deepEqual(locDoVat(MOCK_ITEMS, { ...boLocBanDau, denNgay: '2026-10-10' }).map((muc) => muc.id), [4])
  assert.ok(kiemTraNgay('2026-10-13', '2026-10-12'))
  assert.ok(kiemTraNgay('2026-02-30', ''))
  assert.ok(kiemTraNgay('khong-phai-ngay', ''))
  assert.deepEqual(locDoVat(MOCK_ITEMS, { ...boLocBanDau, tuNgay: '2026-10-13', denNgay: '2026-10-12' }), [])
})

test('Sắp xếp mới nhất, cũ nhất nhất quán và không thay đổi dữ liệu dùng ở trang chủ', () => {
  const banDau = structuredClone(MOCK_ITEMS)
  assert.deepEqual(locDoVat(MOCK_ITEMS, boLocBanDau).map((muc) => muc.id), [1, 3, 6, 2, 5, 4])
  assert.deepEqual(locDoVat(MOCK_ITEMS, { ...boLocBanDau, sapXep: 'cu_nhat' }).map((muc) => muc.id), [4, 2, 5, 1, 3, 6])
  assert.deepEqual(MOCK_ITEMS, banDau)
})

test('Phân trang đúng biên và tự điều chỉnh khi lọc làm giảm kết quả', () => {
  const danhSach = Array.from({ length: 17 }, (_, id) => ({ id }))
  assert.deepEqual(phanTrangDoVat(danhSach, 2).cacDoVat.map((muc) => muc.id), [6, 7, 8, 9, 10, 11])
  const trangCuoi = phanTrangDoVat(danhSach, 99)
  assert.equal(trangCuoi.trangHienTai, 3)
  assert.equal(trangCuoi.tuViTri, 13)
  assert.equal(trangCuoi.denViTri, 17)
  assert.equal(phanTrangDoVat(danhSach.slice(0, 2), 3).trangHienTai, 1)
  assert.equal(phanTrangDoVat(danhSach, 'NaN').trangHienTai, 1)
  assert.equal(phanTrangDoVat(danhSach, -3).trangHienTai, 1)
  assert.deepEqual(phanTrangDoVat([], 8), { cacDoVat: [], trangHienTai: 1, tongTrang: 1, tongTin: 0, tuViTri: 0, denViTri: 0 })
})

test('Khôi phục bộ lọc từ URL, loại bỏ lựa chọn không còn hợp lệ', () => {
  const thamSo = new URLSearchParams('tuKhoa=Tai+nghe&loaiTin=found&danhMuc=electronics&diaDiem=lecture_b4&tuNgay=2026-10-11&sapXep=cu_nhat')
  const boLoc = docBoLoc(thamSo, CATEGORIES, LOCATIONS)
  assert.equal(boLoc.tuKhoa, 'Tai nghe')
  assert.deepEqual(locDoVat(MOCK_ITEMS, boLoc).map((muc) => muc.id), [5])
  assert.deepEqual(docBoLoc(new URLSearchParams('loaiTin=sai&danhMuc=xoa&diaDiem=xoa&sapXep=sai'), CATEGORIES, LOCATIONS), boLocBanDau)
})
