import { LockKeyhole, UnlockKeyhole } from 'lucide-react'
import FormField from '../../../components/shared/FormField'
import HopThoai from '../../../components/shared/HopThoai'

export default function XacNhanKhoaTaiKhoan({ nguoiDungChon, dongDoiTrangThai }) {
  const biKhoa = nguoiDungChon.trang_thai === 'bi_khoa'
  const BieuTuong = biKhoa ? UnlockKeyhole : LockKeyhole

  return (
    <HopThoai tieuDe={biKhoa ? 'Mở khóa tài khoản' : 'Khóa tài khoản'} khiDong={dongDoiTrangThai}>
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${biKhoa ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'}`}><BieuTuong className="h-5 w-5" aria-hidden="true" /></span>
          <div className="min-w-0"><p className="break-words text-sm font-bold text-[#243c30]">{nguoiDungChon.ho_ten || 'Chưa có họ tên'}</p><p className="mt-1 break-all text-xs text-[#718276]">{nguoiDungChon.email || 'Chưa có email'}</p></div>
        </div>
        <p className="text-sm leading-6 text-[#607568]">{biKhoa ? 'Tài khoản sẽ được khôi phục quyền truy cập và sử dụng các chức năng của hệ thống.' : 'Tài khoản sẽ tạm ngừng quyền truy cập hệ thống. Bạn có thể mở khóa lại khi cần.'}</p>
        {!biKhoa && <FormField as="textarea" name="ly_do_khoa" label={<>Lý do khóa <span className="text-rose-600">*</span></>} rows={4} maxLength={1000} required placeholder="Nhập lý do khóa tài khoản…" className="w-full resize-y rounded-xl border border-[#ceded3] bg-white px-3 py-3 text-sm leading-6 text-[#243c30] placeholder:text-[#8a9f91] focus-visible:outline-2 focus-visible:outline-emerald-700" />}
      </div>
      <div className="flex justify-end gap-3 border-t border-[#e1eae4] bg-[#f9fbfa] px-5 py-4 sm:px-6">
        <button type="button" onClick={dongDoiTrangThai} className="rounded-xl border border-[#ceded3] bg-white px-4 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-emerald-700">Hủy</button>
        <button type="button" disabled className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${biKhoa ? 'bg-emerald-900' : 'bg-rose-700'}`}><BieuTuong className="h-4 w-4" aria-hidden="true" />{biKhoa ? 'Xác nhận mở khóa' : 'Xác nhận khóa'}</button>
      </div>
    </HopThoai>
  )
}
