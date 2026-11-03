export function phanTrangDanhSach(danhSach, trang = 1, moiTrang = 6) {
  const soMoiTrang = Number(moiTrang)
  const gioiHan = Number.isSafeInteger(soMoiTrang) && soMoiTrang > 0 ? soMoiTrang : 6
  const tongTrang = Math.max(1, Math.ceil(danhSach.length / gioiHan))
  const soTrang = Number(trang)
  const trangHienTai = Math.max(1, Math.min(Number.isSafeInteger(soTrang) ? soTrang : 1, tongTrang))
  const batDau = (trangHienTai - 1) * gioiHan

  return {
    cacMuc: danhSach.slice(batDau, batDau + gioiHan), trangHienTai, tongTrang, tongTin: danhSach.length,
    tuViTri: danhSach.length ? batDau + 1 : 0, denViTri: Math.min(batDau + gioiHan, danhSach.length),
  }
}
