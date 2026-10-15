import test from 'node:test'
import assert from 'node:assert/strict'
import { taoBieuMau, taoCauHinh, taoCauHoiBanDau, layCauHoiHienHanh, kiemTraCauHoi, docDanhSachCauHoi, luuDanhSachCauHoi, taoPhienBanCauHoi, locCauHoi, layCauHoiXemTruoc } from './xuLyCauHoi.js'

function taoKhoLuuThu() {
  const duLieu = new Map()
  return {
    getItem(khoa) { return duLieu.has(khoa) ? duLieu.get(khoa) : null },
    setItem(khoa, giaTri) { duLieu.set(khoa, giaTri) },
  }
}

function taoCauHoiThu() {
  return { ...taoBieuMau('electronics'), nhanDangTin: 'Hãng máy là gì?', kieuNhap: 'chon_mot', luaChon: [{ id: 'apple', nhan: 'Apple' }, { id: 'samsung', nhan: 'Samsung' }] }
}

test('Sửa tạo bản mới giữ ID câu hỏi logic, nội dung và lựa chọn cũ không bị thay đổi', () => {
  const banDau = taoPhienBanCauHoi(taoCauHoiThu(), [], () => 'v1')
  const cu = structuredClone(banDau.cauHoi)
  const bieuMau = { ...structuredClone(cu), nhanDangTin: 'Thiết bị thuộc hãng nào?', luaChon: [{ id: 'apple', nhan: 'Apple / iPhone' }, { id: 'khac', nhan: 'Hãng khác' }] }
  const sua = taoPhienBanCauHoi(bieuMau, banDau.danhSachMoi, () => 'v2')
  bieuMau.luaChon[0].nhan = 'Thay đổi bên ngoài'
  assert.deepEqual(sua.danhSachMoi[0], cu)
  assert.equal(sua.cauHoi.phienBan, 2)
  assert.equal(sua.cauHoi.maCauHoi, cu.maCauHoi)
  assert.equal(sua.cauHoi.luaChon[0].nhan, 'Apple / iPhone')
  assert.deepEqual(layCauHoiHienHanh(sua.danhSachMoi), [sua.cauHoi])
  assert.deepEqual(layCauHoiHienHanh([...sua.danhSachMoi].reverse()), [sua.cauHoi])
  const khongDoi = taoPhienBanCauHoi(structuredClone(sua.cauHoi), sua.danhSachMoi)
  assert.equal(khongDoi.daThayDoi, false)
  assert.equal(khongDoi.danhSachMoi.length, 2)
  assert.throws(() => taoPhienBanCauHoi(cu, sua.danhSachMoi), /đã thay đổi/)
  assert.throws(() => taoPhienBanCauHoi({ ...sua.cauHoi, danhMucId: 'cards' }, sua.danhSachMoi), /đã thay đổi/)
})

test('Chặn cấu hình lộ đáp án xác minh, yêu cầu nhãn nhận lại và ràng buộc riêng cho tin nhặt', () => {
  const mau = taoCauHoiThu()
  const danhMuc = [{ id: mau.danhMucId }]
  assert.deepEqual(kiemTraCauHoi(mau, [], danhMuc), {})
  mau.apDung.nhat.dungXacMinh = true
  assert.ok(kiemTraCauHoi(mau, [], danhMuc).apDung)
  assert.ok(kiemTraCauHoi(mau, [], danhMuc).nhanNhanLai)
  mau.apDung.nhat.congKhai = false
  mau.nhanNhanLai = 'Thiết bị của bạn thuộc hãng nào?'
  assert.deepEqual(kiemTraCauHoi(mau, [], danhMuc), {})
  mau.apDung.nhat.batBuocNhanLai = true
  mau.apDung.nhat.dungXacMinh = false
  assert.ok(kiemTraCauHoi(mau, [], danhMuc).apDung)
  mau.apDung.nhat = taoCauHinh(false)
  mau.apDung.mat.dungXacMinh = true
  assert.ok(kiemTraCauHoi(mau, [], danhMuc).apDung)
  mau.apDung.mat = taoCauHinh(false)
  assert.ok(kiemTraCauHoi(mau, [], danhMuc).apDung)
  mau.apDung.nhat = { ...taoCauHinh(false), batBuoc: true }
  assert.ok(kiemTraCauHoi(mau, [], danhMuc).apDung)
})

test('Tên chỉ cần duy nhất trong cùng danh mục, kiểm tra lựa chọn và các giới hạn nhập', () => {
  const mau = taoCauHoiThu()
  const danhMuc = [{ id: 'electronics' }, { id: 'cards' }]
  const cu = { ...taoPhienBanCauHoi(mau, [], () => 'v1').cauHoi, dangHoatDong: false }
  assert.ok(kiemTraCauHoi({ ...mau, nhanDangTin: '  HANG   MAY LA GI? ' }, [cu], danhMuc).nhanDangTin)
  assert.deepEqual(kiemTraCauHoi({ ...mau, danhMucId: 'cards' }, [cu], danhMuc), {})
  assert.deepEqual(kiemTraCauHoi(cu, [cu], danhMuc), {})
  assert.ok(kiemTraCauHoi({ ...mau, luaChon: [{ id: '1', nhan: 'Đỏ' }, { id: '2', nhan: 'do' }] }, [], danhMuc).luaChon)
  assert.ok(kiemTraCauHoi({ ...mau, luaChon: [{ id: '1', nhan: 'Một' }] }, [], danhMuc).luaChon)
  assert.ok(kiemTraCauHoi({ ...mau, nhanDangTin: ' ', thuTu: '', danhMucId: 'xoa' }, [], danhMuc).nhanDangTin)
  for (const thuTu of ['', 0, 1.5, 1000, 'abc']) assert.ok(kiemTraCauHoi({ ...mau, thuTu }, [], danhMuc).thuTu)
  assert.ok(kiemTraCauHoi({ ...mau, nhanDangTin: 'a'.repeat(251), nhanNhanLai: 'a'.repeat(251) }, [], danhMuc).nhanNhanLai)
  const vanBan = taoPhienBanCauHoi({ ...mau, kieuNhap: 'van_ban' }, [], () => 'text')
  assert.deepEqual(vanBan.cauHoi.luaChon, [])
})

test('Xem trước chỉ lấy bản mới nhất đang dùng đúng danh mục và đúng loại form', () => {
  const banDau = taoPhienBanCauHoi(taoCauHoiThu(), [], () => 'v1')
  const mau = { ...structuredClone(banDau.cauHoi), nhanNhanLai: 'Máy của bạn có đặc điểm gì?', apDung: { mat: taoCauHinh(false), nhat: { ...taoCauHinh(), congKhai: false, dungXacMinh: true } } }
  const sua = taoPhienBanCauHoi(mau, [...taoCauHoiBanDau(), ...banDau.danhSachMoi], () => 'v2')
  assert.equal(layCauHoiXemTruoc(sua.danhSachMoi, 'electronics', 'mat').some((muc) => muc.maCauHoi === 'v1'), false)
  assert.equal(layCauHoiXemTruoc(sua.danhSachMoi, 'electronics', 'nhat').find((muc) => muc.maCauHoi === 'v1').id, 'v2')
  assert.equal(layCauHoiXemTruoc(sua.danhSachMoi, 'electronics', 'nhan_lai').find((muc) => muc.maCauHoi === 'v1').id, 'v2')
  assert.equal(layCauHoiXemTruoc(sua.danhSachMoi, 'cards', 'nhan_lai').some((muc) => muc.maCauHoi === 'v1'), false)
  const ngung = sua.danhSachMoi.map((muc) => muc.id === 'v2' ? { ...muc, dangHoatDong: false } : muc)
  assert.equal(layCauHoiXemTruoc(ngung, 'electronics', 'nhat').some((muc) => muc.maCauHoi === 'v1'), false)
  assert.equal(locCauHoi(ngung, 'electronics', 'HANG MAY', 'ngung_su_dung').length, 1)
  assert.equal(locCauHoi(sua.danhSachMoi, 'danh-muc-moi').length, 0)
})

test('Lưu và tải lại giữ đủ lịch sử, dữ liệu lỗi được xử lý và không báo thành công nếu lưu thất bại', () => {
  const kho = taoKhoLuuThu()
  const banDau = taoPhienBanCauHoi(taoCauHoiThu(), [], () => 'v1')
  const sua = taoPhienBanCauHoi({ ...banDau.cauHoi, nhanDangTin: 'Tên hãng sản xuất?' }, banDau.danhSachMoi, () => 'v2')
  assert.equal(luuDanhSachCauHoi(sua.danhSachMoi, kho), true)
  assert.deepEqual(docDanhSachCauHoi(kho), sua.danhSachMoi)
  assert.equal(luuDanhSachCauHoi([], kho), true)
  assert.deepEqual(docDanhSachCauHoi(kho), [])
  for (const hong of ['{hong', 'null', '[{}]', JSON.stringify([banDau.cauHoi, banDau.cauHoi]), JSON.stringify([{ ...banDau.cauHoi, apDung: null }]), JSON.stringify([{ ...banDau.cauHoi, kieuNhap: 'sai' }])]) {
    kho.setItem('lacoi.admin.cau-hoi.v1', hong)
    assert.deepEqual(docDanhSachCauHoi(kho), taoCauHoiBanDau())
  }
  const khoHong = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('quota') } }
  assert.equal(luuDanhSachCauHoi(sua.danhSachMoi, khoHong), false)
  assert.deepEqual(docDanhSachCauHoi(khoHong), taoCauHoiBanDau())
})
