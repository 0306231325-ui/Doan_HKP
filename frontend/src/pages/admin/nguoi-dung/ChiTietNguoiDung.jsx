import { CalendarDays, ContactRound, LockKeyhole, ShieldCheck, UnlockKeyhole } from 'lucide-react'
import HopThoai from '../../../components/shared/HopThoai'
import NhanTaiKhoan from './NhanTaiKhoan'
import { dinhDangThoiGian, layChuVietTat } from './hooks/xuLyNguoiDung.js'

export default function ChiTietNguoiDung({ nguoiDungChon, dongChiTiet, moDoiTrangThai }) {
  const nguoiDung = nguoiDungChon
  const biKhoa = nguoiDung.trang_thai === 'bi_khoa'
  const cacThongTin = [
    ['Họ và tên', nguoiDung.ho_ten],
    ['Mã số sinh viên / cán bộ', nguoiDung.ma_so],
    ['Email', nguoiDung.email],
    ['Số điện thoại', nguoiDung.so_dien_thoai],
    ['Khoa / Đơn vị', nguoiDung.khoa],
    ['Lớp', nguoiDung.lop],
  ]

  return (
    <HopThoai tieuDe="Thông tin tài khoản" moTa="Xem hồ sơ và trạng thái tài khoản người dùng." khiDong={dongChiTiet} rong>
      <div className="space-y-6 p-5 sm:p-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-800 text-xl font-bold text-white" aria-hidden="true">{layChuVietTat(nguoiDung.ho_ten)}</span>
          <div className="min-w-0 flex-1">
            <h3 className="break-words text-xl font-bold text-emerald-950">{nguoiDung.ho_ten || 'Chưa có họ tên'}</h3>
            <p className="mt-1 break-all text-sm text-[#607568]">{nguoiDung.email || 'Chưa có email'}</p>
            <div className="mt-3 flex flex-wrap gap-2"><NhanTaiKhoan nguoiDung={nguoiDung} loai="vai_tro" /><NhanTaiKhoan nguoiDung={nguoiDung} /></div>
          </div>
        </div>

        <section aria-labelledby="thong-tin-ca-nhan-nguoi-dung">
          <h3 id="thong-tin-ca-nhan-nguoi-dung" className="flex items-center gap-2 text-sm font-bold text-[#243c30]"><ContactRound className="h-4 w-4 text-emerald-700" aria-hidden="true" />Thông tin cá nhân</h3>
          <dl className="mt-4 grid gap-x-6 gap-y-5 rounded-2xl border border-[#e1eae4] p-5 sm:grid-cols-2">
            {cacThongTin.map(([nhan, giaTri]) => (
              <div key={nhan} className="min-w-0"><dt className="text-xs text-[#718276]">{nhan}</dt><dd className="mt-1.5 break-words text-sm font-medium leading-6 text-[#243c30]">{giaTri || 'Chưa có thông tin'}</dd></div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="trang-thai-tai-khoan-nguoi-dung">
          <h3 id="trang-thai-tai-khoan-nguoi-dung" className="flex items-center gap-2 text-sm font-bold text-[#243c30]"><ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />Thông tin tài khoản</h3>
          <dl className="mt-4 grid gap-x-6 gap-y-5 rounded-2xl border border-[#e1eae4] p-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><dt className="text-xs text-[#718276]">Mã tài khoản</dt><dd className="mt-2 text-sm font-medium text-[#243c30]">{nguoiDung.id ?? '—'}</dd></div>
            <div><dt className="flex items-center gap-1.5 text-xs text-[#718276]"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />Ngày tham gia</dt><dd className="mt-2 text-sm font-medium text-[#243c30]">{dinhDangThoiGian(nguoiDung.created_at)}</dd></div>
            <div><dt className="text-xs text-[#718276]">Cập nhật gần nhất</dt><dd className="mt-2 text-sm font-medium text-[#243c30]">{dinhDangThoiGian(nguoiDung.updated_at)}</dd></div>
          </dl>
        </section>

        {biKhoa && (
          <section aria-label="Thông tin khóa tài khoản" className="rounded-2xl border border-rose-100 bg-rose-50/70 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-rose-800"><LockKeyhole className="h-4 w-4" aria-hidden="true" />Tài khoản đang bị khóa</h3>
            <dl className="mt-3 space-y-3 text-sm"><div><dt className="text-xs text-rose-700">Lý do khóa</dt><dd className="mt-1 break-words whitespace-pre-wrap leading-6 text-rose-900">{nguoiDung.ly_do_khoa || 'Chưa có thông tin'}</dd></div><div><dt className="text-xs text-rose-700">Thời hạn khóa</dt><dd className="mt-1 text-rose-900">{nguoiDung.khoa_den_ngay ? dinhDangThoiGian(nguoiDung.khoa_den_ngay) : 'Cho đến khi được mở khóa'}</dd></div></dl>
          </section>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e1eae4] bg-[#f9fbfa] px-5 py-4 sm:px-6">
        <button type="button" disabled={!['hoat_dong', 'bi_khoa'].includes(nguoiDung.trang_thai)} onClick={() => moDoiTrangThai(nguoiDung)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 ${biKhoa ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}>{biKhoa ? <UnlockKeyhole className="h-4 w-4" aria-hidden="true" /> : <LockKeyhole className="h-4 w-4" aria-hidden="true" />}{biKhoa ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}</button>
        <button type="button" onClick={dongChiTiet} className="rounded-xl border border-[#ceded3] bg-white px-5 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-emerald-700">Đóng</button>
      </div>
    </HopThoai>
  )
}
