import assert from 'node:assert/strict'
import test from 'node:test'
import { kiemTraCauTraLoi } from './quyTacCauHoi.js'

const cauHoi = { nhanDangTin: 'Đồ vật có đặc điểm gì?' }

test('Câu trả lời nhận văn bản và giữ nguyên cách viết các con số', () => {
  for (const giaTri of ['Màu đen', '000123', '12.3400', '-5', '1e3', 'Có 2 chìa khóa', 0]) {
    assert.equal(kiemTraCauTraLoi(cauHoi, giaTri), '')
  }
})

test('Câu trả lời bắt buộc và tối đa 2000 ký tự', () => {
  for (const giaTri of ['', '   ', null, undefined]) assert.match(kiemTraCauTraLoi(cauHoi, giaTri), /Vui lòng trả lời/)
  assert.equal(kiemTraCauTraLoi(cauHoi, 'a'.repeat(2000)), '')
  assert.match(kiemTraCauTraLoi(cauHoi, 'a'.repeat(2001)), /2000/)
})
