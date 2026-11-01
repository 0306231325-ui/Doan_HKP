import { Link } from 'react-router-dom'
import SoLuongBaoCao from './SoLuongBaoCao'
import { CAC_TRANG_THAI } from './hooks/useDuyetTinDang'

export function NhanTrangThai({ trangThai }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${trangThai === 'hien_thi' ? 'bg-emerald-50 text-emerald-800' : trangThai === 'cho_duyet' ? 'bg-amber-50 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>{CAC_TRANG_THAI[trangThai]}</span>
}

export default function BangTinDang({ cacTin }) {
  return <><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><caption className="sr-only">Danh sách tin đăng cần quản lý</caption><thead className="border-y border-[#e1eae4] bg-[#f8fbf9] text-xs text-[#687d70]"><tr>{['Tin đăng', 'Người đăng', 'Ngày đăng', 'Trạng thái', 'Báo cáo', 'Thao tác'].map((nhan) => <th scope="col" key={nhan} className="px-5 py-3.5">{nhan}</th>)}</tr></thead><tbody className="divide-y divide-[#e8efea]">{cacTin.map((tin) => <tr key={tin.id} className="hover:bg-[#f8fbf9]"><th scope="row" className="px-5 py-5 font-medium"><div className="flex items-center gap-3"><div className="max-w-60"><Link className="text-[#243c30] hover:underline" to={`/admin/tin-dang/${tin.id}`}>{tin.title}</Link><p className="mt-1 text-[11px] text-[#718276]">{tin.typeName}</p></div></div></th><td className="px-5 py-5 text-xs">{tin.nguoiDang}</td><td className="px-5 py-5 text-xs">{tin.date.split('-').reverse().join('/')}</td><td className="px-5 py-5"><NhanTrangThai trangThai={tin.trangThai} /></td><td className="px-5 py-5 text-xs"><SoLuongBaoCao baoCao={tin.baoCao} /></td><td className="px-5 py-5"><Link className="whitespace-nowrap text-xs font-semibold text-emerald-800 hover:underline" to={`/admin/tin-dang/${tin.id}`}>Xem chi tiết →</Link></td></tr>)}</tbody></table></div>{!cacTin.length && <p className="px-5 py-12 text-center text-sm text-[#718276]">Không tìm thấy tin phù hợp. Hãy thay đổi từ khóa hoặc bộ lọc.</p>}</>
}
