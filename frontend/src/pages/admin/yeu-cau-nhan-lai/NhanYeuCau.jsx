import { CalendarCheck, CalendarClock, CheckCheck, Circle, Clock3, FileQuestion, HandHeart, ShieldCheck, XCircle } from 'lucide-react'
import { nhanTrangThai } from './duLieuYeuCau'

const mau = {
  cho_kiem_tra: ['bg-amber-50 text-amber-800 ring-amber-200/70', Clock3],
  can_bo_sung: ['bg-orange-50 text-orange-800 ring-orange-200/70', FileQuestion],
  da_xac_minh: ['bg-sky-50 text-sky-800 ring-sky-200/70', ShieldCheck],
  cho_xac_nhan_lich: ['bg-violet-50 text-violet-800 ring-violet-200/70', CalendarClock],
  da_thong_nhat_lich: ['bg-blue-50 text-blue-800 ring-blue-200/70', CalendarCheck],
  cho_xac_nhan_giao_nhan: ['bg-cyan-50 text-cyan-800 ring-cyan-200/70', HandHeart],
  da_hoan_tat: ['bg-emerald-50 text-emerald-800 ring-emerald-200/70', CheckCheck],
  tu_choi: ['bg-rose-50 text-rose-700 ring-rose-200/70', XCircle],
  da_huy: ['bg-slate-100 text-slate-600 ring-slate-200', Circle],
}

export default function NhanYeuCau({ yc }) {
  const trangThai = yc.tien_do || yc.trang_thai
  const [lop, BieuTuong] = mau[trangThai] || mau.da_huy
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${lop}`}><BieuTuong size={13} className="shrink-0" aria-hidden="true" />{nhanTrangThai[trangThai] || trangThai}</span>
}
