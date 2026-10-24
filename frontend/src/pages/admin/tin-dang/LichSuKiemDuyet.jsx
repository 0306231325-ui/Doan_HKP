import { History } from 'lucide-react'
import KhungThongTin from '../../../components/shared/KhungThongTin'

export default function LichSuKiemDuyet({ lichSu }) {
  return <KhungThongTin tieuDe="Lịch sử kiểm duyệt" bieuTuong={History}>{!lichSu.length ? <p className="text-sm text-[#718276]">Chưa có thao tác kiểm duyệt.</p> : <ol className="space-y-5 border-l-2 border-[#d6e4db] pl-4">{lichSu.map((muc, i) => <li key={i}><h3 className="text-sm font-bold">{muc.hanhDong}</h3><p className="mt-1 text-xs text-[#718276]">{muc.thoiGian} · Quản trị viên mẫu</p><p className="mt-2 break-words text-sm leading-6 text-[#526c5b]">{muc.lyDo}</p></li>)}</ol>}</KhungThongTin>
}
