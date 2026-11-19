import test from 'node:test'
import assert from 'node:assert/strict'
import { coThayDoiHoSo } from './xuLyHoSo.js'

const hoSo = { ho_ten: 'Nguyễn Văn A', email: 'hoso@example.test', ma_so: 'SV001', so_dien_thoai: null }

test('hồ sơ không đổi hoặc chỉ khác null và chuỗi rỗng không phải thay đổi', () => {
  assert.equal(coThayDoiHoSo({ ...hoSo }, hoSo), false)
  assert.equal(coThayDoiHoSo({ ...hoSo, so_dien_thoai: '' }, hoSo), false)
})

test('khoảng trắng ngoài cùng và hoa thường email không tạo thay đổi giả', () => {
  assert.equal(coThayDoiHoSo({ ...hoSo, ho_ten: '  Nguyễn Văn A ', email: ' HOSO@EXAMPLE.TEST ' }, hoSo), false)
})

test('sửa hoặc xóa một trường hồ sơ là thay đổi thật', () => {
  assert.equal(coThayDoiHoSo({ ...hoSo, ma_so: 'SV002' }, hoSo), true)
  assert.equal(coThayDoiHoSo({ ...hoSo, ma_so: '' }, hoSo), true)
  assert.equal(coThayDoiHoSo({ ...hoSo, email: 'moi@example.test' }, hoSo), true)
})

test('đổi rồi nhập lại giá trị ban đầu không còn thay đổi', () => {
  const duLieu = { ...hoSo, ma_so: 'SV002' }
  duLieu.ma_so = hoSo.ma_so
  assert.equal(coThayDoiHoSo(duLieu, hoSo), false)
})
