import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarDays, MapPin, RefreshCw, Search, X } from 'lucide-react'
import HopThoai from '../../../components/shared/HopThoai'
import { nut, useDuLieu } from '../yeu-cau-nhan-lai/duLieuYeuCau'

const nhan = { cho_xac_nhan: 'Chờ xác nhận', da_xac_nhan: 'Đã xác nhận', da_hoan_tat: 'Đã bàn giao', da_huy: 'Đã hủy' }
const mau = { cho_xac_nhan: 'bg-amber-50 text-amber-800', da_xac_nhan: 'bg-blue-50 text-blue-800', da_hoan_tat: 'bg-emerald-50 text-emerald-800', da_huy: 'bg-rose-50 text-rose-800' }
const ngayGio = (value) => value ? new Date(value).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Chưa có'
const truong = 'min-h-11 w-full rounded-xl border border-[#d6e4db] bg-white px-3 text-sm text-[#315a43] focus-visible:outline-2 focus-visible:outline-emerald-700'

export default function QuanLyLichHen() {
  const [params, datParams] = useSearchParams()
  const [tuKhoa, datTuKhoa] = useState(params.get('tuKhoa') || '')
  const [lanTai, datLanTai] = useState(0)
  const [chon, datChon] = useState(null)
  const trang = Math.max(1, Number.parseInt(params.get('page'), 10) || 1)
  const nguon = useDuLieu('/admin/lich-hen', { tuKhoa: params.get('tuKhoa') || undefined, ngay: params.get('ngay') || undefined, trangThai: params.get('trangThai') || undefined, yeuCau: params.get('yeuCau') || undefined, page: trang }, lanTai)
  const ds = nguon.data?.data
  function doiLoc(ten, value) {
    const moi = new URLSearchParams(params)
    if (value) moi.set(ten, value)
    else moi.delete(ten)
    if (ten !== 'page') moi.delete('page')
    datParams(moi)
    datChon(null)
  }
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[#607568]">Theo dõi lịch gặp và tình trạng giao nhận của hai bên.</p><button type="button" className={nut} onClick={() => { datChon(null); datLanTai((n) => n + 1) }}><RefreshCw size={16} />Làm mới</button></div>
    <form onSubmit={(e) => { e.preventDefault(); doiLoc('tuKhoa', tuKhoa.trim()) }} className="grid gap-4 rounded-2xl border border-[#d6e4db] bg-white p-5 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">
      <label className="space-y-2"><span className="text-xs font-medium text-[#607568]">Đồ vật hoặc người tham gia</span><div className="flex gap-2"><input className={truong} value={tuKhoa} maxLength={150} onChange={(e) => datTuKhoa(e.target.value)} placeholder="Nhập tên đồ vật, người giữ, người nhận…" /><button type="submit" aria-label="Tìm kiếm" className={nut}><Search size={17} /></button></div></label>
      <label className="space-y-2"><span className="text-xs font-medium text-[#607568]">Ngày hẹn</span><input type="date" className={truong} value={params.get('ngay') || ''} onChange={(e) => doiLoc('ngay', e.target.value)} /></label>
      <label className="space-y-2"><span className="text-xs font-medium text-[#607568]">Trạng thái</span><select className={truong} value={params.get('trangThai') || ''} onChange={(e) => doiLoc('trangThai', e.target.value)}><option value="">Tất cả trạng thái</option>{Object.entries(nhan).map(([id, ten]) => <option key={id} value={id}>{ten}</option>)}</select></label>
      <button type="button" className={`${nut} self-end min-h-11`} onClick={() => { datTuKhoa(''); datParams({}); datChon(null) }}><X size={15} />Xóa lọc</button>
    </form>
    <section className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white">
      <div className="border-b border-[#edf2ee] px-5 py-4"><h2 className="font-bold text-[#315a43]">Danh sách lịch hẹn</h2></div>
      {nguon.loi ? <p role="alert" className="p-8 text-sm text-rose-700">{nguon.loi}</p> : !ds ? <p role="status" className="p-10 text-center text-sm text-[#607568]">Đang tải lịch hẹn…</p> : !ds.data.length ? <div className="px-5 py-14 text-center"><CalendarDays size={36} className="mx-auto mb-4 text-[#91ab9a]" /><h3 className="font-semibold text-[#315a43]">{params.size ? 'Không có lịch hẹn phù hợp' : 'Chưa có lịch hẹn'}</h3><p className="mt-2 text-sm text-[#718276]">Lịch hẹn đã lưu sẽ xuất hiện tại đây để admin theo dõi.</p></div> : <>
        <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-[#f7faf8] text-xs text-[#718276]"><tr>{['Đồ vật', 'Người giữ / Người nhận', 'Thời gian & địa điểm', 'Trạng thái', 'Thao tác'].map((t) => <th key={t} scope="col" className="px-5 py-3 font-medium">{t}</th>)}</tr></thead><tbody className="divide-y divide-[#edf2ee]">{ds.data.map((h) => <tr key={h.id} className="align-top hover:bg-[#fafcfb]">
          <td className="max-w-64 px-5 py-5"><p className="font-semibold leading-6 text-[#315a43]">{h.tin_dang?.tieu_de || 'Tin không còn hiển thị'}</p><p className="mt-1 text-xs text-[#718276]">LH-{String(h.id).padStart(4, '0')}</p></td>
          <td className="px-5 py-5"><p className="text-[#315a43]">{h.nguoi_giu?.ho_ten || 'Chưa có tên'}</p><p className="mt-2 text-[#718276]">{h.nguoi_nhan?.ho_ten || 'Chưa có tên'}</p></td>
          <td className="px-5 py-5"><p className="font-medium text-[#315a43]">{ngayGio(h.thoi_gian_hen_gap)}</p><p className="mt-2 flex items-start gap-1.5 text-[#718276]"><MapPin size={14} className="mt-0.5 shrink-0" />{h.dia_diem?.ten_dia_diem || 'Chưa có địa điểm'}</p></td>
          <td className="px-5 py-5"><TrangThai hen={h} /></td>
          <td className="px-5 py-5"><button type="button" aria-haspopup="dialog" onClick={() => datChon(h)} className={`${nut} whitespace-nowrap`}>Xem chi tiết</button></td>
        </tr>)}</tbody></table></div>
        {ds.last_page > 1 && <nav aria-label="Phân trang lịch hẹn" className="flex justify-end gap-3 border-t border-[#edf2ee] p-4"><button type="button" className={nut} disabled={trang <= 1} onClick={() => doiLoc('page', String(trang - 1))}>Trước</button><button type="button" className={nut} disabled={trang >= ds.last_page} onClick={() => doiLoc('page', String(trang + 1))}>Sau</button></nav>}
      </>}
    </section>
    {chon && <HopThoai rong tieuDe="Chi tiết lịch hẹn" khiDong={() => datChon(null)}><div className="space-y-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3"><h3 className="max-w-lg text-lg font-bold text-[#315a43]">{chon.tin_dang?.tieu_de || 'Tin không còn hiển thị'}</h3><TrangThai hen={chon} /></div>
      <div className="grid gap-4 rounded-xl bg-[#f5f8f6] p-4 sm:grid-cols-2"><div><p className="text-xs text-[#718276]">Thời gian gặp · Giờ Việt Nam</p><p className="mt-1 font-semibold text-[#315a43]">{ngayGio(chon.thoi_gian_hen_gap)}</p></div><div><p className="text-xs text-[#718276]">Địa điểm</p><p className="mt-1 font-semibold text-[#315a43]">{chon.dia_diem?.ten_dia_diem || 'Chưa có'}</p></div></div>
      <div className="grid gap-4 sm:grid-cols-2"><Nguoi ten="Người giữ đồ" nguoi={chon.nguoi_giu} daXacNhan={chon.nguoi_giu_xac_nhan_luc} /><Nguoi ten="Người nhận đồ" nguoi={chon.nguoi_nhan} daXacNhan={chon.nguoi_nhan_xac_nhan_luc} /></div>
      {chon.ly_do_huy && <p className="whitespace-pre-wrap rounded-xl bg-rose-50 p-4 text-sm text-rose-800">Lý do hủy: {chon.ly_do_huy}</p>}
      {chon.ban_giao && <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"><p>Bàn giao lúc: {ngayGio(chon.ban_giao.thoi_gian_ban_giao)}</p>{chon.ban_giao.ghi_chu_ban_giao && <p className="mt-2 whitespace-pre-wrap">{chon.ban_giao.ghi_chu_ban_giao}</p>}</div>}
      <div className="flex justify-end gap-3 border-t border-[#edf2ee] pt-4">{chon.tin_dang && <Link to={`/admin/tin-dang/${chon.tin_dang.id}`} className={nut}>Xem tin đăng</Link>}<button type="button" className={nut} onClick={() => datChon(null)}>Đóng</button></div>
    </div></HopThoai>}
  </div>
}

function TrangThai({ hen }) { return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${mau[hen.trang_thai] || 'bg-gray-50 text-gray-700'}`}>{nhan[hen.trang_thai] || hen.trang_thai}</span> }
function Nguoi({ ten, nguoi, daXacNhan }) {
  return <section className="min-w-0 rounded-xl border border-[#e1eae4] p-4"><h4 className="text-xs text-[#718276]">{ten}</h4><p className="mt-1 font-semibold text-[#315a43]">{nguoi?.ho_ten || 'Chưa có tên'}</p><p className="mt-3 break-words text-sm text-[#607568]">{nguoi?.so_dien_thoai || 'Chưa có số điện thoại'}</p><p className="mt-1 break-words text-sm text-[#607568]">{nguoi?.email || 'Chưa có email'}</p><p className="mt-3 text-xs text-[#718276]">{daXacNhan ? `Đã xác nhận giao nhận · ${ngayGio(daXacNhan)}` : 'Chưa xác nhận giao nhận'}</p></section>
}
