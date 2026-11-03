import test from 'node:test'
import assert from 'node:assert/strict'
import { layNgayVietNam, laNgayHopLe, taoKhoangThoiGian, kiemTraKhoangNgay, locTinTheoNgay, taoThongKe } from './xuLyThongKe.js'

test('Mốc nhanh tính đủ ngày và vượt qua ranh giới tháng, năm', () => {
  assert.deepEqual(taoKhoangThoiGian('7_ngay', '2026-01-03'), { tuNgay: '2025-12-28', denNgay: '2026-01-03' })
  assert.deepEqual(taoKhoangThoiGian('30_ngay', '2026-03-01'), { tuNgay: '2026-01-31', denNgay: '2026-03-01' })
  assert.deepEqual(taoKhoangThoiGian('thang_nay', '2026-10-15'), { tuNgay: '2026-10-01', denNgay: '2026-10-15' })
  assert.deepEqual(taoKhoangThoiGian('hom_nay', '2026-10-15'), { tuNgay: '2026-10-15', denNgay: '2026-10-15' })
  assert.deepEqual(taoKhoangThoiGian('tat_ca', '2026-10-15'), { tuNgay: '', denNgay: '' })
})

test('Lọc cả hai đầu ngày theo múi giờ Việt Nam', () => {
  const danhSach = [
    { id: 1, created_at: '2026-10-14T16:59:59Z' },
    { id: 2, created_at: '2026-10-14T17:00:00Z' },
    { id: 3, created_at: '2026-10-15T16:59:59Z' },
    { id: 4, created_at: '2026-10-15T17:00:00Z' },
    { id: 5, created_at: 'khong-hop-le' },
  ]
  assert.deepEqual(locTinTheoNgay(danhSach, { tuNgay: '2026-10-15', denNgay: '2026-10-15' }).map((tin) => tin.id), [2, 3])
  assert.equal(layNgayVietNam('2026-10-14T18:00:00Z'), '2026-10-15')
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

test('Khoảng ngày và xóa mềm được áp dụng cho các chỉ số tình hình chung', () => {
  const danhSach = [
    { id: 1, created_at: '2026-10-15T01:00:00Z', loai_tin: 'bao_mat', trang_thai_kiem_duyet: 'cho_duyet', danh_muc: { ten_danh_muc: 'Ví' } },
    { id: 2, created_at: '2026-10-15T02:00:00Z', loai_tin: 'nhat_duoc', trang_thai: 'da_hoan_tat', danh_muc: { ten_danh_muc: 'Ví' } },
    { id: 3, created_at: '2026-10-01T02:00:00Z', loai_tin: 'nhat_duoc', trang_thai: 'da_hoan_tat' },
    { id: 4, created_at: '2026-10-15T03:00:00Z', loai_tin: 'nhat_duoc', deleted_at: '2026-10-15T04:00:00Z' },
  ]
  const ketQua = taoThongKe(danhSach, { tuNgay: '2026-10-15', denNgay: '2026-10-15' })
  assert.equal(ketQua.tongTin, 2)
  assert.equal(ketQua.soBaoMat, 1)
  assert.equal(ketQua.soNhatDuoc, 1)
  assert.equal(ketQua.soDaTra, 1)
  assert.equal(danhSach.length, 4)
})

test('Không có tin thì các chỉ số tình hình chung đều bằng không', () => {
  assert.deepEqual(taoThongKe([], { tuNgay: '', denNgay: '' }), { tongTin: 0, soBaoMat: 0, soNhatDuoc: 0, soDaTra: 0 })
})
