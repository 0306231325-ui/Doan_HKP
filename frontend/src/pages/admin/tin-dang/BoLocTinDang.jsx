import { CAC_TRANG_THAI } from './hooks/useDuyetTinDang'

export default function BoLocTinDang({ tuKhoa, trangThai, loai, coBaoCao, doiTuKhoa, doiTrangThai, doiLoai, doiBaoCao }) {
  const kieu = 'rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-sm text-[#526c5b] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'
  return <div className="flex flex-wrap items-center gap-3 border-t border-[#e8efea] px-5 py-4 sm:px-6">
    <input aria-label="Tìm tin đăng" type="search" className={`${kieu} min-w-48 flex-1`} value={tuKhoa} onChange={(e) => doiTuKhoa(e.target.value)} placeholder="Tìm tên đồ, mã tin, người đăng…" />
    <select aria-label="Trạng thái tin" className={kieu} value={trangThai} onChange={(e) => doiTrangThai(e.target.value)}><option value="tat_ca">Mọi trạng thái</option>{Object.entries(CAC_TRANG_THAI).map(([ma, ten]) => <option key={ma} value={ma}>{ten}</option>)}</select>
    <select aria-label="Loại tin" className={kieu} value={loai} onChange={(e) => doiLoai(e.target.value)}><option value="tat_ca">Mọi loại tin</option><option value="lost">Mất đồ</option><option value="found">Nhặt được</option></select>
    <label className="flex items-center gap-2 text-xs text-[#526c5b]"><input type="checkbox" checked={coBaoCao} onChange={(e) => doiBaoCao(e.target.checked)} className="accent-emerald-800" />Có báo cáo chưa xử lý</label>
  </div>
}
