import { CAC_TRANG_THAI } from './hooks/useDuyetTinDang'
import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

export default function BoLocTinDang({ tuKhoa, trangThai, loai, coBaoCao, doiTuKhoa, doiTrangThai, doiLoai, doiBaoCao, tuNgay, denNgay, doiTuNgay, doiDenNgay, loiNgay }) {
  const menuNgay = useRef(null)
  useEffect(() => {
    function dongKhiNhanNgoai(event) {
      if (!menuNgay.current?.contains(event.target)) menuNgay.current?.removeAttribute('open')
    }
    function dongBangPhim(event) {
      if (event.key === 'Escape' && menuNgay.current?.open) {
        menuNgay.current.removeAttribute('open')
        menuNgay.current.querySelector('summary')?.focus()
      }
    }
    document.addEventListener('pointerdown', dongKhiNhanNgoai)
    document.addEventListener('keydown', dongBangPhim)
    return () => {
      document.removeEventListener('pointerdown', dongKhiNhanNgoai)
      document.removeEventListener('keydown', dongBangPhim)
    }
  }, [])
  const kieu = 'rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-sm text-[#526c5b] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'
  return <div className="flex flex-wrap items-center gap-3 border-t border-[#e8efea] px-5 py-4 sm:px-6">
    <input aria-label="Tìm tin đăng" type="search" className={`${kieu} min-w-48 flex-1`} value={tuKhoa} onChange={(e) => doiTuKhoa(e.target.value)} placeholder="Tìm tên đồ, người đăng…" />
    <select aria-label="Trạng thái tin" className={kieu} value={trangThai} onChange={(e) => doiTrangThai(e.target.value)}><option value="tat_ca">Trạng thái</option>{Object.entries(CAC_TRANG_THAI).map(([ma, ten]) => <option key={ma} value={ma}>{ten}</option>)}</select>
    <select aria-label="Loại tin" className={kieu} value={loai} onChange={(e) => doiLoai(e.target.value)}><option value="tat_ca">Loại tin</option><option value="lost">Mất đồ</option><option value="found">Nhặt được</option></select>
    <select aria-label="Lọc báo cáo vi phạm" className={kieu} value={coBaoCao ? 'co_bao_cao' : 'tat_ca'} onChange={(e) => doiBaoCao(e.target.value === 'co_bao_cao')}><option value="tat_ca">Báo cáo</option><option value="co_bao_cao">Có báo cáo vi phạm</option></select>
    <details ref={menuNgay} className="relative">
      <summary className={`${kieu} flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden`}><span>{tuNgay || denNgay ? 'Đã lọc thời gian' : 'Thời gian'}</span><ChevronDown className="h-4 w-4" aria-hidden="true" /></summary>
      <div className="absolute left-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-3rem)] space-y-4 rounded-2xl border border-[#ceded3] bg-white p-4 shadow-lg sm:left-auto sm:right-0">
        <p className="text-sm font-semibold text-emerald-900">Lọc theo ngày đăng</p>
        <label className="grid gap-1 text-xs text-[#526c5b]">Từ ngày<input type="date" className={`${kieu} w-full min-w-0`} value={tuNgay} max={denNgay || undefined} onChange={(e) => doiTuNgay(e.target.value)} aria-invalid={loiNgay} /></label>
        <label className="grid gap-1 text-xs text-[#526c5b]">Đến ngày<input type="date" className={`${kieu} w-full min-w-0`} value={denNgay} min={tuNgay || undefined} onChange={(e) => doiDenNgay(e.target.value)} aria-invalid={loiNgay} /></label>
        {loiNgay && <p role="alert" className="text-xs text-red-700">Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.</p>}
        <div className="flex justify-between gap-3"><button type="button" className="rounded-lg px-2 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50" onClick={() => { doiTuNgay(''); doiDenNgay('') }}>Xóa lọc</button><button type="button" className="rounded-lg bg-emerald-900 px-3 py-2 text-xs font-semibold text-white" onClick={() => menuNgay.current?.removeAttribute('open')}>Đóng</button></div>
      </div>
    </details>
  </div>
}
