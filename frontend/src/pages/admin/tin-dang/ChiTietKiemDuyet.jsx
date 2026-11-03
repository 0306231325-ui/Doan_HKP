import { useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { FileText, ShieldCheck } from 'lucide-react'
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
  return <div className="space-y-5"><Link to="/admin/tin-dang" className="text-sm font-semibold text-emerald-800">← Quay lại danh sách</Link>
    <div className="grid items-start gap-5 lg:grid-cols-[1.2fr_1fr]"><div className="space-y-5"><KhungThongTin tieuDe="Nội dung tin đăng" bieuTuong={FileText} className="relative [&>h2]:pr-32"><div className="absolute right-5 top-5 sm:right-6 sm:top-6"><NhanTrangThai trangThai={tin.trangThai} /></div><img src={tin.imageUrl} alt={tin.fullName} className="mb-5 h-64 w-full rounded-2xl object-cover" /><h3 className="text-lg font-bold text-[#243c30]">{tin.fullName}</h3><p className="my-4 text-sm leading-7 text-[#526c5b]">{tin.description}</p><dl className="space-y-3 border-t border-[#e1eae4] pt-4">{[['Người đăng', tin.nguoiDang], ['Loại tin', tin.typeName], ['Địa điểm', tin.location], ['Ngày đăng', tin.date], ['Danh mục', tin.category]].map(([nhan, giaTri]) => <div key={nhan} className="grid grid-cols-[90px_1fr] gap-3 text-xs leading-6"><dt className="text-[#718276]">{nhan}</dt><dd>{giaTri}</dd></div>)}</dl></KhungThongTin>
    <KhungThongTin tieuDe="Thao tác kiểm duyệt" bieuTuong={ShieldCheck}><p className="mb-4 text-xs leading-6 text-[#718276]">Đọc nội dung tin và các phản ánh để quyết định ẩn hoặc khôi phục tin.</p><div className="grid gap-3">{tin.trangThai === 'hien_thi' && <button className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 hover:bg-amber-100" onClick={() => datThaoTac({ nhan: 'Ẩn tin', trangThai: 'da_an' })}>Ẩn tin đăng</button>}{tin.trangThai === 'da_an' && <button className={nut} onClick={() => datThaoTac({ nhan: 'Khôi phục tin', trangThai: 'hien_thi' })}>Khôi phục tin</button>}</div></KhungThongTin></div><DanhSachBaoCao cacBaoCao={tin.baoCao} /></div>
    {thaoTac && <XacNhanXuLyTin thaoTac={thaoTac} dangLuu={dangLuu} loi={loi} khiDong={() => { if (!dangLuu) datThaoTac(null) }} khiXacNhan={async (lyDo) => { if (await xuLyTin(tin.id, thaoTac, lyDo)) datThaoTac(null) }} />}
  </div>
}
