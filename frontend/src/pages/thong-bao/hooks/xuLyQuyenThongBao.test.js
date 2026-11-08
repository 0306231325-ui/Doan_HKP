import test from 'node:test'
import assert from 'node:assert/strict'
import { layQuyenThongBao, xinQuyenThongBao } from './xuLyQuyenThongBao.js'

test('Không xin quyền khi trình duyệt không hỗ trợ hoặc trang không ở ngữ cảnh an toàn', async () => {
  assert.equal(layQuyenThongBao({}), 'khong_ho_tro')
  const moiTruong = { isSecureContext: false, Notification: { permission: 'default', requestPermission() { throw new Error('Không được gọi') } } }
  assert.equal(await xinQuyenThongBao(moiTruong), 'khong_ho_tro')
})

test('Giữ quyền đã cấp hoặc đã chặn, không gọi lại yêu cầu quyền', async () => {
  for (const permission of ['granted', 'denied']) {
    const moiTruong = { isSecureContext: true, Notification: { permission, requestPermission() { throw new Error('Không được gọi') } } }
    assert.equal(layQuyenThongBao(moiTruong), permission)
    assert.equal(await xinQuyenThongBao(moiTruong), permission)
  }
})

test('Chỉ xin quyền ở trạng thái chưa chọn và trả đúng kết quả đồng ý, từ chối hoặc bỏ qua', async () => {
  for (const ketQua of ['granted', 'denied', 'default']) {
    let soLanGoi = 0
    const moiTruong = { Notification: { permission: 'default', async requestPermission() { soLanGoi += 1; return ketQua } } }
    assert.equal(layQuyenThongBao(moiTruong), 'default')
    assert.equal(soLanGoi, 0)
    assert.equal(await xinQuyenThongBao(moiTruong), ketQua)
    assert.equal(soLanGoi, 1)
  }
})

test('Lỗi API được chuyển cho giao diện xử lý, kết quả lạ không bị coi là đã cho phép', async () => {
  const loi = new Error('Quyền bị chặn bởi trình duyệt')
  await assert.rejects(() => xinQuyenThongBao({ Notification: { permission: 'default', requestPermission() { return Promise.reject(loi) } } }), loi)
  assert.equal(await xinQuyenThongBao({ Notification: { permission: 'default', requestPermission() { return Promise.resolve('unknown') } } }), 'default')
})
