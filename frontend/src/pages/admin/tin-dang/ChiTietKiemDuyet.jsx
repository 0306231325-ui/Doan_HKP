import { useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react'
import KhungThongTin from '../../../components/shared/KhungThongTin'
import { NhanTrangThai } from './BangTinDang'
import DanhSachBaoCao from './DanhSachBaoCao'

import XacNhanXuLyTin from './XacNhanXuLyTin'

export default function ChiTietKiemDuyet() {
  const { id } = useParams()
  const { cacTin, xuLyTin, dangLuu, loi } = useOutletContext()
  const [thaoTac, datThaoTac] = useState(null)
  const tin = cacTin.find((muc) => String(muc.id) === id)
  if (!tin) return <KhungThongTin tieuDe="Không tìm thấy tin đăng"><Link to="/admin/tin-dang" className="text-sm text-emerald-800 underline">Về danh sách tin</Link></KhungThongTin>
  const nut = 'rounded-xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800'
  return <div className="space-y-5"><Link to="/admin/tin-dang" className="inline-flex items-center gap-2 rounded-xl px-1 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:text-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Quay lại danh sách</Link>
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]"><div className="min-w-0"><KhungThongTin tieuDe="Nội dung tin đăng" bieuTuong={FileText} className="[&>h2]:flex-wrap"><div className="mb-5 flex sm:justify-end sm:-mt-12 [&>span]:px-3 [&>span]:py-1.5 [&>span]:text-xs"><NhanTrangThai trangThai={tin.trangThai} /></div><img src={tin.imageUrl} alt={tin.fullName} className="mb-6 h-60 w-full rounded-2xl border border-[#e1eae4] bg-[#f8fbf9] object-contain sm:h-80" /><h3 className="break-words text-xl font-bold leading-8 text-[#243c30] sm:text-2xl">{tin.fullName}</h3><p className="my-4 whitespace-pre-line break-words text-sm leading-7 text-[#526c5b]">{tin.description}</p><dl className="space-y-4 border-t border-[#e1eae4] pt-5">{[['Người đăng', tin.nguoiDang], ['Loại tin', tin.typeName], ['Địa điểm', tin.location], ['Ngày đăng', tin.date], ['Danh mục', tin.category]].map(([nhan, giaTri]) => <div key={nhan} className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 text-sm leading-6 sm:grid-cols-[120px_minmax(0,1fr)]"><dt className="text-[#617568]">{nhan}</dt><dd className="break-words font-medium text-[#243c30]">{giaTri}</dd></div>)}</dl></KhungThongTin></div><aside className="min-w-0 space-y-5"><DanhSachBaoCao cacBaoCao={tin.baoCao} />
    <KhungThongTin tieuDe="Thao tác kiểm duyệt" bieuTuong={ShieldCheck}><p className="mb-4 text-sm leading-6 text-[#718276]">Đọc nội dung tin và các phản ánh để quyết định ẩn hoặc khôi phục tin.</p><div className="grid gap-3">{tin.trangThai === 'hien_thi' && <button className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 hover:bg-amber-100" onClick={() => datThaoTac({ nhan: 'Ẩn tin', trangThai: 'da_an' })}>Ẩn tin đăng</button>}{tin.trangThai === 'da_an' && <button className={nut} onClick={() => datThaoTac({ nhan: 'Khôi phục tin', trangThai: 'hien_thi' })}>Khôi phục tin</button>}</div></KhungThongTin></aside></div>
    {thaoTac && <XacNhanXuLyTin thaoTac={thaoTac} dangLuu={dangLuu} loi={loi} khiDong={() => { if (!dangLuu) datThaoTac(null) }} khiXacNhan={async (lyDo) => { if (await xuLyTin(tin.id, thaoTac, lyDo)) datThaoTac(null) }} />}
  </div>
}
