import test from 'node:test'
import assert from 'node:assert/strict'
import { layTienDo, nhanTrangThaiLichHen } from './xuLyTienDoYeuCau.js'

test('tiến độ chỉ hoàn tất khi có kết quả giao nhận', () => {
  const yc = { trang_thai: 'da_xac_minh', coTheDatLich: true, cuoc_hen: [] }
  assert.equal(layTienDo(yc).soBuocXong, 2)
  assert.equal(layTienDo(yc, true).soBuocXong, 0)
  yc.coTheDatLich = false
  yc.cuoc_hen = [{ trang_thai: 'cho_xac_nhan', dungMaBanGiao: true }]
  assert.equal(layTienDo(yc).soBuocXong, 3)
  assert.equal(layTienDo(yc, true).soBuocXong, 1)
  assert.equal(nhanTrangThaiLichHen(yc.cuoc_hen[0]), 'Chờ nhập mã')
  yc.cuoc_hen[0].trang_thai = 'da_huy'
  yc.coTheDatLich = true
  assert.equal(layTienDo(yc, true).soBuocXong, 0)
  assert.equal(nhanTrangThaiLichHen(yc.cuoc_hen[0]), 'Đã hủy')
  yc.cuoc_hen = [{ trang_thai: 'da_hoan_tat' }]
  assert.equal(layTienDo(yc).soBuocXong, 4)
  assert.equal(layTienDo(yc, true).soBuocXong, 3)
  assert.equal(nhanTrangThaiLichHen(yc.cuoc_hen[0]), 'Xác nhận thành công')
  yc.cuoc_hen = [{ trang_thai: 'da_xac_nhan', ban_giao: { thoi_gian_ban_giao: '2026-11-09' } }]
  assert.equal(layTienDo(yc, true).soBuocXong, 3)
})

test('yêu cầu chưa được duyệt không nhận tiến độ của người đã nhận đồ', () => {
  const yc = { trang_thai: 'cho_kiem_tra', tin_dang: { trang_thai: 'cho_ban_giao' }, cuoc_hen: [{ trang_thai: 'da_hoan_tat' }] }
  assert.equal(layTienDo(yc).soBuocXong, 1)
  assert.match(layTienDo(yc).thongBao, /Tạm dừng/)
  yc.tin_dang.trang_thai = 'da_hoan_tat'
  assert.equal(layTienDo(yc).soBuocXong, 1)
  assert.match(layTienDo(yc).thongBao, /đã đóng/)
  yc.tin_dang.trang_thai = 'dang_mo'
  assert.equal(layTienDo(yc).soBuocXong, 1)
  assert.equal(layTienDo(yc).dungLai, false)
  assert.equal(layTienDo(yc, true).soBuocXong, null)
  assert.equal(layTienDo(yc).thongBao, '')
  yc.trang_thai = 'tu_choi'
  assert.equal(layTienDo(yc).tuChoi, true)
})
