import test from 'node:test'
import assert from 'node:assert/strict'
import { chuanHoaTuKhoa, taoDiaDiemBanDau, docDanhSachDiaDiem, luuDanhSachDiaDiem, kiemTraDiaDiem, locDanhSachDiaDiem, phanTrangDiaDiem } from './xuLyDiaDiem.js'

function taoKhoLuuThu() {
  const duLieu = new Map()
  return {
    getItem(khoa) { return duLieu.has(khoa) ? duLieu.get(khoa) : null },
    setItem(khoa, giaTri) { duLieu.set(khoa, giaTri) },
  }
}

test('Khởi tạo danh sách rỗng khi chưa có địa điểm', () => {
  assert.deepEqual(taoDiaDiemBanDau(), [])
  assert.deepEqual(docDanhSachDiaDiem(taoKhoLuuThu()), [])
})

test('Bỏ địa điểm mẫu đã lưu nhưng giữ địa điểm người dùng thêm', () => {
  const kho = taoKhoLuuThu()
  const moi = { id: 'dia-diem-moi', tenDiaDiem: 'Khu tự học', moTa: '', dangHoatDong: true }
  luuDanhSachDiaDiem([{ ...moi, id: 'library', tenDiaDiem: 'Thư viện mẫu' }, moi], kho)
  assert.deepEqual(docDanhSachDiaDiem(kho), [moi])
})

test('Tìm tên và mô tả không dấu kết hợp trạng thái, không đổi dữ liệu gốc', () => {
  const danhSach = [
    { id: '1', tenDiaDiem: 'Đại sảnh', moTa: 'Tầng hai', dangHoatDong: true },
    { id: '2', tenDiaDiem: 'Nhà xe', moTa: 'Gần đại sảnh', dangHoatDong: false },
    { id: '3', tenDiaDiem: 'Căn tin', moTa: '', dangHoatDong: true },
  ]
  assert.equal(chuanHoaTuKhoa('  ĐẠI   SẢNH  '), 'dai sanh')
  assert.deepEqual(locDanhSachDiaDiem(danhSach, 'dai sanh', 'hoat_dong').map((muc) => muc.id), ['1'])
  assert.deepEqual(locDanhSachDiaDiem(danhSach, 'dai sanh', 'ngung_su_dung').map((muc) => muc.id), ['2'])
  assert.deepEqual(locDanhSachDiaDiem(danhSach, 'tang hai', 'tat_ca').map((muc) => muc.id), ['1'])
  assert.deepEqual(danhSach.map((muc) => muc.id), ['1', '2', '3'])
})

test('Tên trùng địa điểm ngừng sử dụng bị từ chối nhưng được sửa chính địa điểm đó', () => {
  const danhSach = [{ id: '1', tenDiaDiem: 'Thư viện', moTa: '', dangHoatDong: false }]
  assert.ok(kiemTraDiaDiem({ id: '', tenDiaDiem: '  THU   VIEN ', moTa: '' }, danhSach).tenDiaDiem)
  assert.deepEqual(kiemTraDiaDiem({ id: '1', tenDiaDiem: 'Thư viện', moTa: 'Tầng 2' }, danhSach), {})
  assert.ok(kiemTraDiaDiem({ id: '', tenDiaDiem: '   ', moTa: '' }, danhSach).tenDiaDiem)
  assert.ok(kiemTraDiaDiem({ id: '', tenDiaDiem: 'a'.repeat(151), moTa: '' }, danhSach).tenDiaDiem)
  assert.ok(kiemTraDiaDiem({ id: '', tenDiaDiem: 'Phòng đọc', moTa: 'a'.repeat(501) }, danhSach).moTa)
})

test('Lưu và tải lại được địa điểm thêm mới, sửa tên, ngừng sử dụng rồi mở lại', () => {
  const khoLuu = taoKhoLuuThu()
  let danhSach = docDanhSachDiaDiem(khoLuu)
  danhSach = [...danhSach, { id: 'moi', tenDiaDiem: 'Khu tự học', moTa: 'Tầng 2', dangHoatDong: true }]
  assert.equal(luuDanhSachDiaDiem(danhSach, khoLuu), true)
  assert.equal(docDanhSachDiaDiem(khoLuu).find((muc) => muc.id === 'moi').tenDiaDiem, 'Khu tự học')
  danhSach = danhSach.map((muc) => muc.id === 'moi' ? { ...muc, tenDiaDiem: 'Phòng tự học', dangHoatDong: false } : muc)
  assert.equal(luuDanhSachDiaDiem(danhSach, khoLuu), true)
  assert.equal(locDanhSachDiaDiem(docDanhSachDiaDiem(khoLuu), 'tu hoc', 'hoat_dong').length, 0)
  assert.equal(locDanhSachDiaDiem(docDanhSachDiaDiem(khoLuu), 'tu hoc', 'ngung_su_dung').length, 1)
  danhSach = danhSach.map((muc) => muc.id === 'moi' ? { ...muc, dangHoatDong: true } : muc)
  assert.equal(luuDanhSachDiaDiem(danhSach, khoLuu), true)
  assert.equal(locDanhSachDiaDiem(docDanhSachDiaDiem(khoLuu), 'tu hoc', 'hoat_dong').length, 1)
})

test('Dữ liệu lưu hỏng được xử lý, danh sách rỗng hợp lệ được giữ lại', () => {
  const khoLuu = taoKhoLuuThu()
  assert.equal(luuDanhSachDiaDiem([], khoLuu), true)
  assert.deepEqual(docDanhSachDiaDiem(khoLuu), [])
  khoLuu.setItem('lacoi.admin.dia-diem.v1', '{hong')
  assert.equal(docDanhSachDiaDiem(khoLuu).length, 0)
  khoLuu.setItem('lacoi.admin.dia-diem.v1', JSON.stringify([{ id: '1' }]))
  assert.equal(docDanhSachDiaDiem(khoLuu).length, 0)
  const muc = { id: '1', tenDiaDiem: 'Phòng đọc', moTa: '', dangHoatDong: true }
  khoLuu.setItem('lacoi.admin.dia-diem.v1', JSON.stringify([muc, muc]))
  assert.equal(docDanhSachDiaDiem(khoLuu).length, 0)
})

test('Không báo lưu thành công khi kho lưu bị chặn hoặc hết dung lượng', () => {
  const khoLuu = {
    getItem() { throw new Error('blocked') },
    setItem() { throw new Error('quota') },
  }
  const danhSach = taoDiaDiemBanDau()
  assert.equal(luuDanhSachDiaDiem(danhSach, khoLuu), false)
  assert.equal(docDanhSachDiaDiem(khoLuu).length, 0)
})

test('Phân trang điều chỉnh đúng khi lọc làm giảm số trang và khi không có kết quả', () => {
  const danhSach = Array.from({ length: 17 }, (_, id) => ({ id }))
  assert.deepEqual(phanTrangDiaDiem(danhSach, 2).cacDiaDiem.map((muc) => muc.id), [8, 9, 10, 11, 12, 13, 14, 15])
  const trangCuoi = phanTrangDiaDiem(danhSach, 99)
  assert.equal(trangCuoi.trangHienTai, 3)
  assert.equal(trangCuoi.tuViTri, 17)
  assert.equal(trangCuoi.denViTri, 17)
  assert.equal(phanTrangDiaDiem(danhSach.slice(0, 2), 3).trangHienTai, 1)
  const rong = phanTrangDiaDiem([], 8)
  assert.equal(rong.trangHienTai, 1)
  assert.equal(rong.tuViTri, 0)
  assert.equal(rong.denViTri, 0)
  assert.deepEqual(rong.cacDiaDiem, [])
})
