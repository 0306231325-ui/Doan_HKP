import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { cacTrangThai, cacVaiTro } from './hooks/xuLyNguoiDung.js'

export default function NhanTaiKhoan({ nguoiDung, loai = 'trang_thai' }) {
  const laVaiTro = loai === 'vai_tro'
  const biKhoa = nguoiDung.trang_thai === 'bi_khoa'
  const nhan = laVaiTro ? cacVaiTro[nguoiDung.vai_tro] : cacTrangThai[nguoiDung.trang_thai]
  const BieuTuong = laVaiTro ? ShieldCheck : biKhoa ? LockKeyhole : null
  const mau = laVaiTro ? 'bg-slate-100 text-slate-600' : biKhoa ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-800'

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${mau}`}>
      {BieuTuong ? <BieuTuong className="h-3.5 w-3.5" aria-hidden="true" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {nhan || 'Chưa xác định'}
    </span>
  )
}
