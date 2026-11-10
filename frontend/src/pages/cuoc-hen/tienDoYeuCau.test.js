import test from 'node:test'
import assert from 'node:assert/strict'
import { layTienDo } from './xuLyTienDoYeuCau.js'

test('tiến độ chỉ hoàn tất khi có kết quả giao nhận', () => {
  const yc = { trang_thai: 'da_xac_minh', tin_dang: { trang_thai: 'cho_ban_giao' }, cuoc_hen: [] }
  assert.equal(layTienDo(yc).soBuocXong, 2)
  yc.cuoc_hen = [{ trang_thai: 'da_xac_nhan', thoi_gian_hen_gap: '2020-01-01' }]
  assert.equal(layTienDo(yc).soBuocXong, 3)
  yc.cuoc_hen[0].trang_thai = 'da_huy'
  assert.equal(layTienDo(yc).soBuocXong, 2)
  yc.cuoc_hen = [{ trang_thai: 'da_hoan_tat' }]
  assert.equal(layTienDo(yc).soBuocXong, 4)
  yc.cuoc_hen = [{ trang_thai: 'da_xac_nhan', ban_giao: { thoi_gian_ban_giao: '2026-11-09' } }]
  assert.equal(layTienDo(yc).soBuocXong, 4)
})

test('yêu cầu chưa được duyệt không nhận tiến độ của người đã nhận đồ', () => {
  const yc = { trang_thai: 'cho_kiem_tra', tin_dang: { trang_thai: 'cho_ban_giao' } }
  assert.equal(layTienDo(yc).soBuocXong, 1)
  assert.equal(layTienDo(yc).dungLai, true)
  yc.tin_dang.trang_thai = 'da_hoan_tat'
  assert.equal(layTienDo(yc).soBuocXong, 1)
  assert.equal(layTienDo(yc).dungLai, true)
  yc.tin_dang.trang_thai = 'dang_mo'
  assert.equal(layTienDo(yc).dungLai, false)
  yc.trang_thai = 'tu_choi'
  assert.equal(layTienDo(yc).tuChoi, true)
})
