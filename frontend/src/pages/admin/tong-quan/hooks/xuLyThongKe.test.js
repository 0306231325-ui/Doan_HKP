import test from 'node:test'
import assert from 'node:assert/strict'
import { layNgayVietNam, laNgayHopLe, taoKhoangThoiGian, kiemTraKhoangNgay, locTinTheoNgay, tinhPhanBo, taoThongKe } from './xuLyThongKe.js'

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

test('Cùng khoảng ngày được áp dụng cho chỉ số, hàng chờ, phân bố và tin gần đây', () => {
  const danhSach = [
    { id: 1, created_at: '2026-10-15T01:00:00Z', loai_tin: 'bao_mat', trang_thai_kiem_duyet: 'cho_duyet', danh_muc: { ten_danh_muc: 'Ví' } },
    { id: 2, created_at: '2026-10-15T02:00:00Z', loai_tin: 'nhat_duoc', trang_thai: 'da_hoan_tat', danh_muc: { ten_danh_muc: 'Ví' } },
    { id: 3, created_at: '2026-10-01T02:00:00Z', loai_tin: 'nhat_duoc', trang_thai: 'da_hoan_tat' },
    { id: 4, created_at: '2026-10-15T03:00:00Z', loai_tin: 'nhat_duoc', deleted_at: '2026-10-15T04:00:00Z' },
  ]
  const ketQua = taoThongKe(danhSach, { tuNgay: '2026-10-15', denNgay: '2026-10-15' }, 'danh_muc')
  assert.equal(ketQua.tongTin, 2)
  assert.equal(ketQua.soBaoMat, 1)
  assert.equal(ketQua.soNhatDuoc, 1)
  assert.equal(ketQua.soDaTra, 1)
  assert.equal(ketQua.soChoDuyet, 1)
  assert.equal(ketQua.tyLeTimLai, 50)
  assert.deepEqual(ketQua.tinGanDay.map((tin) => tin.id), [2, 1])
  assert.deepEqual(ketQua.phanBo.map(({ ten, soLuong }) => ({ ten, soLuong })), [{ ten: 'Ví', soLuong: 2 }])
  assert.equal(danhSach.length, 4)
})

test('Biểu đồ nhóm các mục ít tin và giữ đủ tổng số lượng, tỷ lệ', () => {
  const danhSach = Array.from({ length: 8 }, (_, id) => ({ id, danh_muc: { ten_danh_muc: `Nhóm ${id}` } }))
  const ketQua = tinhPhanBo(danhSach, 'danh_muc')
  assert.equal(ketQua.length, 6)
  assert.equal(ketQua.at(-1).ten, 'Các nhóm khác')
  assert.equal(ketQua.reduce((tong, muc) => tong + muc.soLuong, 0), 8)
  assert.equal(ketQua.reduce((tong, muc) => tong + muc.tyLe, 0), 100)
  assert.equal(tinhPhanBo([{}], 'dia_diem')[0].ten, 'Chưa rõ địa điểm')
})

test('Trạng thái rỗng không sinh NaN và tin gần đây chỉ lấy năm tin mới nhất', () => {
  const ketQuaRong = taoThongKe([], { tuNgay: '', denNgay: '' }, 'dia_diem')
  assert.equal(ketQuaRong.tyLeTimLai, 0)
  assert.deepEqual(ketQuaRong.phanBo, [])
  const danhSach = Array.from({ length: 8 }, (_, id) => ({ id, created_at: `2026-10-${String(id + 1).padStart(2, '0')}T01:00:00Z`, loai_tin: 'bao_mat' }))
  assert.deepEqual(taoThongKe(danhSach, { tuNgay: '', denNgay: '' }, 'danh_muc').tinGanDay.map((tin) => tin.id), [7, 6, 5, 4, 3])
})
