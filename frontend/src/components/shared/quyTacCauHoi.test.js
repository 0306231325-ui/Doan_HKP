import assert from 'node:assert/strict'
import test from 'node:test'
import { kiemTraCauTraLoi } from './quyTacCauHoi.js'

const cauSo = { danhMucId: '1', kieuNhap: 'so', nhanDangTin: 'Có bao nhiêu chìa khóa?' }

test('Câu kiểu Số chấp nhận số hợp lệ, chặn chữ và giá trị không hữu hạn', () => {
  for (const giaTri of ['0', 0, '12', '-3', '1.25', '.5', '1e3', ' 4 ']) assert.equal(kiemTraCauTraLoi(cauSo, giaTri), '')
  for (const giaTri of ['abc', '12a', 'Infinity', 'NaN', '0x10', '1,2', '1e999', '--2']) assert.match(kiemTraCauTraLoi(cauSo, giaTri), /số hợp lệ/)
})

test('Bắt buộc theo nhóm câu hỏi, số 0 không bị coi là bỏ trống', () => {
  assert.match(kiemTraCauTraLoi(cauSo, ''), /Vui lòng trả lời/)
  assert.equal(kiemTraCauTraLoi(cauSo, '0'), '')
  const chung = { ...cauSo, danhMucId: null }
  assert.equal(kiemTraCauTraLoi(chung, ''), '')
  assert.match(kiemTraCauTraLoi(chung, 'không'), /số hợp lệ/)
})

test('Văn bản giữ nguyên chữ và số, giới hạn độ dài câu trả lời', () => {
  const cauVanBan = { ...cauSo, kieuNhap: 'van_ban' }
  assert.equal(kiemTraCauTraLoi(cauVanBan, 'Mã 001234, màu đen'), '')
  assert.match(kiemTraCauTraLoi(cauVanBan, 'a'.repeat(2001)), /2000/)
})
