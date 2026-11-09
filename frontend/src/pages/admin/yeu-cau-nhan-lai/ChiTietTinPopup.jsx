import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import HopThoai from '../../../components/shared/HopThoai'
import { nut, useDuLieu } from './duLieuYeuCau'

export default function ChiTietTinPopup({ id, khiDong }) {
  const [lanTai, datLanTai] = useState(0)
  const [viTriAnh, datViTriAnh] = useState(0)
  const ketQua = useDuLieu(`/admin/tin-dang/${id}`, {}, lanTai)
  const tin = ketQua.data?.data
  const anh = tin?.images?.length ? tin.images : [tin?.imageUrl].filter(Boolean)
  return <HopThoai rong tieuDe="Chi tiết tin đăng" khiDong={khiDong}>
    {!tin ? <div className="p-8 text-center text-sm text-[#607568]">{ketQua.loi ? <div role="alert"><p>{ketQua.loi}</p><button type="button" className={`${nut} mt-4`} onClick={() => datLanTai((n) => n + 1)}>Thử lại</button></div> : <p role="status">Đang tải tin đăng…</p>}</div> : <div className="space-y-5 p-5 sm:p-6">
      <div><p className="mb-2 text-xs font-semibold text-emerald-700">{tin.typeName} · {tin.category}</p><h3 className="text-xl font-bold leading-7 text-[#243c30]">{tin.title}</h3></div>
      {!!anh.length && <div className="relative overflow-hidden rounded-xl bg-[#f3f7f4]"><img key={anh[viTriAnh]} src={anh[viTriAnh]} alt={`${tin.title} — ảnh ${viTriAnh + 1}`} onError={(e) => { if (!e.currentTarget.src.endsWith('/do-vat-trong.svg')) e.currentTarget.src = '/do-vat-trong.svg' }} className="max-h-80 w-full object-contain" />{anh.length > 1 && <><button type="button" aria-label="Ảnh trước" onClick={() => datViTriAnh((cu) => (cu - 1 + anh.length) % anh.length)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2 text-emerald-900 shadow"><ChevronLeft size={20} /></button><button type="button" aria-label="Ảnh sau" onClick={() => datViTriAnh((cu) => (cu + 1) % anh.length)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2 text-emerald-900 shadow"><ChevronRight size={20} /></button><span aria-live="polite" className="absolute bottom-2 right-2 rounded-lg bg-white/95 px-2 py-1 text-xs text-[#607568]">{viTriAnh + 1}/{anh.length}</span></>}</div>}
      <div><h4 className="mb-2 text-sm font-bold text-[#315a43]">Mô tả đồ vật</h4><p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#607568]">{tin.description || 'Chưa có mô tả.'}</p></div>
      <dl className="grid gap-4 border-t border-[#e1eae4] pt-5 text-sm sm:grid-cols-2">{[['Người đăng', tin.nguoiDang], ['Ngày đăng', tin.date ? new Date(`${tin.date}T00:00:00`).toLocaleDateString('vi-VN') : null], ['Khu vực', tin.location], ['Vị trí chi tiết', tin.locationDetail]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt className="text-xs text-[#718276]">{label}</dt><dd className="mt-1 break-words text-[#315a43]">{value}</dd></div>)}</dl>
    </div>}
  </HopThoai>
}
