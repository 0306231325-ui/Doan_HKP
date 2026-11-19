import { nhan, nut } from './duLieuYeuCau'

export function NhanTrangThai({ yc }) {
  const status = yc.trang_thai === 'da_xac_minh' ? 'da_xac_minh' : yc.trang_thai_xu_ly || yc.trang_thai
  const mau = status === 'cho_kiem_tra' ? 'bg-amber-50 text-amber-800' : ['tu_choi', 'da_huy', 'da_dong', 'tam_cho_ban_giao'].includes(status) ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-800'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${mau}`}>{nhan[status] || status}</span>
}
export function PhanTrang({ duLieu, trang, doiTrang }) {
  if (!duLieu || duLieu.last_page <= 1) return null
  return <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8efea] p-4 text-xs text-[#607568]"><span>{duLieu?.total || 0} kết quả · Trang {trang}/{duLieu?.last_page || 1}</span><div className="flex gap-2"><button className={nut} disabled={!duLieu || trang <= 1} onClick={() => doiTrang(trang - 1)}>Trước</button><button className={nut} disabled={!duLieu || trang >= duLieu.last_page} onClick={() => doiTrang(trang + 1)}>Sau</button></div></div>
}
