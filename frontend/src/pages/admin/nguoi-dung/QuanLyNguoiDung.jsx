import { LockKeyhole, Search, SlidersHorizontal, UserRoundCheck, UsersRound, X } from 'lucide-react'
import BangNguoiDung from './BangNguoiDung'
import ChiTietNguoiDung from './ChiTietNguoiDung'
import XacNhanKhoaTaiKhoan from './XacNhanKhoaTaiKhoan'
import useQuanLyNguoiDung from './hooks/useQuanLyNguoiDung'
import { cacTrangThai, cacVaiTro } from './hooks/xuLyNguoiDung.js'

export default function QuanLyNguoiDung({ danhSachBanDau = [] }) {
  const nguoiDung = useQuanLyNguoiDung(danhSachBanDau)
  const cacChiSo = [
    { nhan: 'Tổng người dùng', so: nguoiDung.thongKe.tong, bieuTuong: UsersRound, mau: 'bg-emerald-50 text-emerald-800' },
    { nhan: 'Đang hoạt động', so: nguoiDung.thongKe.hoatDong, bieuTuong: UserRoundCheck, mau: 'bg-emerald-50 text-emerald-700' },
    { nhan: 'Đã khóa', so: nguoiDung.thongKe.biKhoa, bieuTuong: LockKeyhole, mau: 'bg-rose-50 text-rose-700' },
  ]
  const coBoLoc = nguoiDung.boLoc.tuKhoa || nguoiDung.boLoc.vaiTro !== 'tat_ca' || nguoiDung.boLoc.trangThai !== 'tat_ca'

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm leading-6 text-[#607568]">Theo dõi tài khoản, xem thông tin và quản lý quyền truy cập của người dùng trên Lạc Ơi.</p>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {cacChiSo.map(({ nhan, so, bieuTuong: BieuTuong, mau }) => (
          <div key={nhan} className="rounded-2xl border border-[#d6e4db] bg-white p-4 sm:p-5">
            <dt className="flex items-center justify-between gap-2 text-xs font-medium text-[#607568] sm:text-sm"><span>{nhan}</span><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${mau}`}><BieuTuong className="h-4 w-4" aria-hidden="true" /></span></dt>
            <dd className="mt-3 text-3xl font-bold tracking-tight text-emerald-950 tabular-nums">{so.toLocaleString('vi-VN')}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="danh-sach-nguoi-dung" className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-6 sm:px-6">
          <div><h2 id="danh-sach-nguoi-dung" className="flex items-center gap-2.5 text-lg font-bold text-[#243c30]">Danh sách người dùng<span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">{nguoiDung.thongKe.tong}</span></h2><p className="mt-1.5 text-sm leading-6 text-[#718276]">Xem chi tiết hồ sơ và trạng thái của từng tài khoản.</p></div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e4db] bg-[#f8fbf9] px-3 py-1.5 text-xs font-medium text-[#607568]"><UsersRound className="h-3.5 w-3.5" aria-hidden="true" />Tài khoản hệ thống</span>
        </div>

        <div className="border-t border-[#e8efea] bg-[#fcfdfc] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1"><label htmlFor="tim-nguoi-dung" className="sr-only">Tìm người dùng</label><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#8a9f91]" aria-hidden="true" /><input id="tim-nguoi-dung" name="tuKhoa" type="search" value={nguoiDung.boLoc.tuKhoa} onChange={nguoiDung.doiBoLoc} placeholder="Tìm theo tên, email, mã số, số điện thoại…" className="w-full rounded-xl border border-[#ceded3] bg-white py-2.5 pr-3 pl-9 text-sm text-[#243c30] placeholder:text-[#8a9f91] focus-visible:outline-2 focus-visible:outline-emerald-700" /></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[25rem]">
              <div><label htmlFor="loc-vai-tro-nguoi-dung" className="sr-only">Lọc vai trò</label><select id="loc-vai-tro-nguoi-dung" name="vaiTro" value={nguoiDung.boLoc.vaiTro} onChange={nguoiDung.doiBoLoc} className="w-full rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-sm text-[#526c5b] focus-visible:outline-2 focus-visible:outline-emerald-700"><option value="tat_ca">Tất cả vai trò</option>{Object.entries(cacVaiTro).map(([giaTri, nhan]) => <option key={giaTri} value={giaTri}>{nhan}</option>)}</select></div>
              <div><label htmlFor="loc-trang-thai-nguoi-dung" className="sr-only">Lọc trạng thái tài khoản</label><select id="loc-trang-thai-nguoi-dung" name="trangThai" value={nguoiDung.boLoc.trangThai} onChange={nguoiDung.doiBoLoc} className="w-full rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-sm text-[#526c5b] focus-visible:outline-2 focus-visible:outline-emerald-700"><option value="tat_ca">Tất cả trạng thái</option>{Object.entries(cacTrangThai).map(([giaTri, nhan]) => <option key={giaTri} value={giaTri}>{nhan}</option>)}</select></div>
            </div>
          </div>
          {coBoLoc && <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs"><p aria-live="polite" className="flex items-center gap-1.5 text-[#607568]"><SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />Tìm thấy {nguoiDung.tongTin} tài khoản phù hợp</p><button type="button" onClick={nguoiDung.xoaBoLoc} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700"><X className="h-3.5 w-3.5" aria-hidden="true" />Xóa bộ lọc</button></div>}
        </div>
        <BangNguoiDung {...nguoiDung} />
      </section>

      {nguoiDung.nguoiDungChon && nguoiDung.hopThoai?.loai === 'chi_tiet' && <ChiTietNguoiDung {...nguoiDung} />}
      {nguoiDung.nguoiDungChon && nguoiDung.hopThoai?.loai === 'trang_thai' && <XacNhanKhoaTaiKhoan {...nguoiDung} />}
    </div>
  )
}
