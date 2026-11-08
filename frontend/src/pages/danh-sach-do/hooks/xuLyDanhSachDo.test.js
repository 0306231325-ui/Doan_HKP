import test from 'node:test'
import assert from 'node:assert/strict'
import { boLocBanDau, docBoLoc, kiemTraNgay, taoThamSoTraCuu } from './xuLyDanhSachDo.js'

test('Khoảng ngày gồm cả hai đầu, chặn ngày không hợp lệ và ngày bắt đầu sau kết thúc', () => {
  assert.equal(kiemTraNgay('2026-10-12', '2026-10-12'), '')
  assert.ok(kiemTraNgay('2026-10-13', '2026-10-12'))
  assert.ok(kiemTraNgay('2026-02-30', ''))
  assert.ok(kiemTraNgay('khong-phai-ngay', ''))
})

test('Khôi phục bộ lọc từ URL, loại bỏ lựa chọn không còn hợp lệ', () => {
  const danhMuc = [{ id: '2' }]
  const diaDiem = [{ id: '3' }]
  const thamSo = new URLSearchParams('tuKhoa=Tai+nghe&loaiTin=found&danhMuc=2&diaDiem=3&tuNgay=2026-10-11&sapXep=cu_nhat')
  assert.deepEqual(docBoLoc(thamSo, danhMuc, diaDiem), {
    tuKhoa: 'Tai nghe', loaiTin: 'found', danhMuc: '2', diaDiem: '3', tuNgay: '2026-10-11', denNgay: '', sapXep: 'cu_nhat',
  })
  assert.deepEqual(docBoLoc(new URLSearchParams('loaiTin=sai&danhMuc=xoa&diaDiem=xoa&sapXep=sai'), danhMuc, diaDiem), boLocBanDau)
})

test('Tham số API bỏ giá trị tất cả và giữ từ khóa, ID, phân trang hợp lệ', () => {
  assert.equal(taoThamSoTraCuu(boLocBanDau, 'sai'), '')
  const thamSo = new URLSearchParams(taoThamSoTraCuu({ ...boLocBanDau, tuKhoa: 'điện thoại', loaiTin: 'found', danhMuc: '2', diaDiem: '3' }, 2))
  assert.equal(thamSo.get('tuKhoa'), 'điện thoại')
  assert.equal(thamSo.get('danhMuc'), '2')
  assert.equal(thamSo.get('diaDiem'), '3')
  assert.equal(thamSo.get('trang'), '2')
  assert.equal(thamSo.has('tuNgay'), false)
  assert.equal(taoThamSoTraCuu(boLocBanDau, -1), '')
})
