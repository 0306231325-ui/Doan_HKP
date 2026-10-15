import test from 'node:test'
import assert from 'node:assert/strict'
import { CATEGORIES } from '../../../../data/mockData.js'
import { taoDanhMucBanDau, docDanhSachDanhMuc, luuDanhSachDanhMuc, kiemTraDanhMuc, locDanhSachDanhMuc, phanTrangDanhMuc } from './xuLyDanhMuc.js'
import { docDanhSachDiaDiem, luuDanhSachDiaDiem } from '../../dia-diem/hooks/xuLyDiaDiem.js'

function taoKhoLuuThu() {
  const duLieu = new Map()
  return {
    getItem(khoa) { return duLieu.has(khoa) ? duLieu.get(khoa) : null },
    setItem(khoa, giaTri) { duLieu.set(khoa, giaTri) },
  }
}

test('Khởi tạo giữ ID danh mục có sẵn và không sửa dữ liệu trang chủ', () => {
  const danhSach = taoDanhMucBanDau()
  assert.deepEqual(danhSach.map((muc) => muc.id), CATEGORIES.filter((muc) => muc.id !== 'all').map((muc) => muc.id))
  assert.ok(danhSach.every((muc) => muc.dangHoatDong && muc.moTa))
  danhSach[0].tenDanhMuc = 'Tên đã thay đổi'
  assert.notEqual(taoDanhMucBanDau()[0].tenDanhMuc, 'Tên đã thay đổi')
  assert.notEqual(CATEGORIES.find((muc) => muc.id === danhSach[0].id).name, 'Tên đã thay đổi')
})

test('Chặn tên trùng cả danh mục ngừng sử dụng, cho sửa chính danh mục và kiểm tra giới hạn', () => {
  const danhSach = [{ id: '1', tenDanhMuc: 'Điện thoại', moTa: '', dangHoatDong: false }]
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: '  DIEN   THOAI  ', moTa: '' }, danhSach).tenDanhMuc)
  assert.deepEqual(kiemTraDanhMuc({ ...danhSach[0], moTa: 'Máy và phụ kiện' }, danhSach), {})
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: '   ', moTa: '' }, danhSach).tenDanhMuc)
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: 'a'.repeat(101), moTa: '' }, danhSach).tenDanhMuc)
  assert.ok(kiemTraDanhMuc({ id: '', tenDanhMuc: 'Tai nghe', moTa: 'a'.repeat(501) }, danhSach).moTa)
  assert.deepEqual(kiemTraDanhMuc({ id: '', tenDanhMuc: 'a'.repeat(100), moTa: 'a'.repeat(500) }, danhSach), {})
})

test('Thêm, sửa, ngừng sử dụng và mở lại vẫn giữ ID qua các lần tải và không ghi đè địa điểm', () => {
  const khoLuu = taoKhoLuuThu()
  const diaDiem = docDanhSachDiaDiem(khoLuu)
  assert.equal(luuDanhSachDiaDiem(diaDiem, khoLuu), true)
  const moi = { id: 'moi', tenDanhMuc: 'Tai nghe', moTa: 'Tai nghe không dây', dangHoatDong: true }
  assert.equal(luuDanhSachDanhMuc([...docDanhSachDanhMuc(khoLuu), moi], khoLuu), true)
  assert.deepEqual(docDanhSachDanhMuc(khoLuu).find((muc) => muc.id === 'moi'), moi)
  const sua = { ...moi, tenDanhMuc: 'Tai nghe Bluetooth', dangHoatDong: false }
  const danhSach = docDanhSachDanhMuc(khoLuu).map((muc) => muc.id === 'moi' ? sua : muc)
  assert.equal(luuDanhSachDanhMuc(danhSach, khoLuu), true)
  assert.deepEqual(locDanhSachDanhMuc(docDanhSachDanhMuc(khoLuu), 'khong day', 'ngung_su_dung'), [sua])
  assert.deepEqual(locDanhSachDanhMuc(docDanhSachDanhMuc(khoLuu), 'tai nghe bluetooth', 'hoat_dong'), [])
  assert.equal(luuDanhSachDanhMuc(danhSach.map((muc) => muc.id === 'moi' ? { ...muc, dangHoatDong: true } : muc), khoLuu), true)
  assert.equal(locDanhSachDanhMuc(docDanhSachDanhMuc(khoLuu), 'TAI NGHE', 'hoat_dong')[0].id, 'moi')
  assert.deepEqual(docDanhSachDiaDiem(khoLuu), diaDiem)
})

test('Dữ liệu hỏng được xử lý, giữ danh sách rỗng hợp lệ và báo thất bại khi không lưu được', () => {
  const khoLuu = taoKhoLuuThu()
  assert.equal(luuDanhSachDanhMuc([], khoLuu), true)
  assert.deepEqual(docDanhSachDanhMuc(khoLuu), [])
  for (const duLieu of ['{hong', 'null', JSON.stringify([{ id: '1' }]), JSON.stringify([taoDanhMucBanDau()[0], taoDanhMucBanDau()[0]])]) {
    khoLuu.setItem('lacoi.admin.danh-muc.v1', duLieu)
    assert.deepEqual(docDanhSachDanhMuc(khoLuu), taoDanhMucBanDau())
  }
  const khoBiChan = {
    getItem() { throw new Error('blocked') },
    setItem() { throw new Error('quota') },
  }
  assert.deepEqual(docDanhSachDanhMuc(khoBiChan), taoDanhMucBanDau())
  assert.equal(luuDanhSachDanhMuc(taoDanhMucBanDau(), khoBiChan), false)
})

test('Tìm kiếm không đổi thứ tự gốc, phân trang giới hạn đúng khi bộ lọc làm giảm kết quả', () => {
  const danhSach = Array.from({ length: 17 }, (_, i) => ({ id: String(i), tenDanhMuc: `Đồ vật ${i}`, moTa: i === 16 ? 'Độc nhất' : '', dangHoatDong: true }))
  const thuTuCu = danhSach.map((muc) => muc.id)
  assert.equal(locDanhSachDanhMuc(danhSach, 'DO   VAT', 'tat_ca').length, 17)
  assert.deepEqual(danhSach.map((muc) => muc.id), thuTuCu)
  assert.equal(phanTrangDanhMuc(danhSach, 2).cacDanhMuc.length, 8)
  assert.equal(phanTrangDanhMuc(danhSach, 99).trangHienTai, 3)
  const loc = phanTrangDanhMuc(locDanhSachDanhMuc(danhSach, 'doc nhat', 'hoat_dong'), 3)
  assert.equal(loc.trangHienTai, 1)
  assert.equal(loc.cacDanhMuc[0].id, '16')
  const rong = phanTrangDanhMuc([], 9)
  assert.equal(rong.trangHienTai, 1)
  assert.equal(rong.tuViTri, 0)
  assert.equal(rong.denViTri, 0)
})
