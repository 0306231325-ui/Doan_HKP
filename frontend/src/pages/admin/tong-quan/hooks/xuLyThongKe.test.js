import test from 'node:test'
import assert from 'node:assert/strict'
import { layNgayVietNam, laNgayHopLe, chuyenNgaySangISO, dinhDangNgay, kiemTraKhoangNgay } from './xuLyThongKe.js'

test('Ngày nhập tay và ngày chọn từ lịch quy về cùng định dạng', () => {
  assert.equal(chuyenNgaySangISO('6/11/2026'), '2026-11-06')
  assert.equal(dinhDangNgay('2026-11-06'), '06/11/2026')
  assert.equal(chuyenNgaySangISO(dinhDangNgay('2024-02-29')), '2024-02-29')
  for (const giaTri of ['', '06/11/26', '29/02/2026', '31/04/2026', '11/13/2026', '01/01/0000']) {
    assert.equal(chuyenNgaySangISO(giaTri), '')
  }
})

test('Ngày Việt Nam đổi ở nửa đêm giờ địa phương', () => {
  assert.equal(layNgayVietNam('2026-10-14T16:59:59Z'), '2026-10-14')
  assert.equal(layNgayVietNam('2026-10-14T17:00:00Z'), '2026-10-15')
  assert.equal(layNgayVietNam('khong-hop-le'), '')
})

test('Khoảng tự chọn từ chối ngày không tồn tại, đảo ngược, thiếu và tương lai', () => {
  assert.equal(laNgayHopLe('2026-02-30'), false)
  assert.equal(laNgayHopLe('2024-02-29'), true)
  assert.notEqual(kiemTraKhoangNgay('', '2026-10-15', '2026-10-15'), '')
  assert.notEqual(kiemTraKhoangNgay('2026-10-15', '2026-10-01', '2026-10-15'), '')
  assert.notEqual(kiemTraKhoangNgay('2026-10-15', '2026-10-16', '2026-10-15'), '')
  assert.equal(kiemTraKhoangNgay('2026-10-15', '2026-10-15', '2026-10-15'), '')
})
