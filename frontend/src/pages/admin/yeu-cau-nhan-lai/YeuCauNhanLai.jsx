import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, ClipboardList, Clock3, HandHeart, RefreshCw, Search, CheckCheck, Inbox, X } from 'lucide-react'
import api from '../../../services/api'
import ChiTietYeuCau from './ChiTietYeuCau'
import NhanYeuCau from './NhanYeuCau'
import { nhomTrangThai, ngayGio } from './duLieuYeuCau'

const nutPhu = 'inline-flex items-center justify-center gap-2 rounded-xl border border-[#d6e4db] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#526c5b] transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-40'

export default function YeuCauNhanLai() {
  const [danhSach, datDanhSach] = useState(null)
  const [thongKe, datThongKe] = useState(null)
  const [chiTiet, datChiTiet] = useState(null)
  const [trang, datTrang] = useState(1)
  const [loi, datLoi] = useState('')
  const [dangTai, datDangTai] = useState(false)
  const [dangLamMoi, datDangLamMoi] = useState(false)
  const [loc, datLoc] = useState('')
  const [tuKhoa, datTuKhoa] = useState('')
  useEffect(() => {
    let active = true
    const delay = window.setTimeout(() => api.get('/admin/yeu-cau', { params: { page: trang, trangThai: loc || undefined, tuKhoa: tuKhoa.trim() || undefined } }).then(({ data }) => {
      if (active) { datDanhSach(data.data); datThongKe(data.thongKe) }
    }).catch(() => { if (active) datLoi('Không tải được danh sách yêu cầu.') })
    , 250)
    return () => { active = false; window.clearTimeout(delay) }
  }, [trang, loc, tuKhoa])
  async function moChiTiet(id) {
    datDangTai(true); datLoi('')
    try { const { data } = await api.get(`/admin/yeu-cau/${id}`); datChiTiet(data.data); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    catch { datLoi('Không tải được chi tiết yêu cầu.') }
    finally { datDangTai(false) }
  }
  async function taiLai() {
    datDangLamMoi(true)
    try {
      const { data } = await api.get('/admin/yeu-cau', { params: { page: trang, trangThai: loc || undefined, tuKhoa: tuKhoa.trim() || undefined } })
      datDanhSach(data.data); datThongKe(data.thongKe)
      if (chiTiet) await moChiTiet(chiTiet.id)
    } finally { datDangLamMoi(false) }
  }
  const cacYeuCau = danhSach?.data || []
  const hienThi = cacYeuCau
  const chiSo = [
    { nhan: 'Tổng yêu cầu', so: thongKe?.tong ?? 0, icon: ClipboardList, mau: 'bg-slate-100 text-slate-600' },
    { nhan: 'Chờ kiểm tra', so: thongKe?.choKiemTra ?? 0, icon: Clock3, mau: 'bg-amber-50 text-amber-700' },
    { nhan: 'Đang giao nhận', so: thongKe?.dangGiaoNhan ?? 0, icon: HandHeart, mau: 'bg-sky-50 text-sky-700' },
    { nhan: 'Đã bàn giao', so: thongKe?.hoanTat ?? 0, icon: CheckCheck, mau: 'bg-emerald-50 text-emerald-700' },
  ]
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      {chiTiet ? <button onClick={() => datChiTiet(null)} className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"><ArrowLeft size={16} />Quay lại danh sách</button> : <p className="max-w-2xl text-sm leading-6 text-[#607568]">Kiểm tra bằng chứng và xét duyệt yêu cầu nhận lại đồ.</p>}
      <button disabled={dangLamMoi || dangTai} onClick={() => taiLai().catch(() => datLoi('Không tải được dữ liệu.'))} className={nutPhu}><RefreshCw size={15} className={dangLamMoi ? 'animate-spin' : ''} />Làm mới</button>
    </div>
    {loi && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{loi}</p>}
    {dangTai && <p role="status" className="text-sm text-[#607568]">Đang tải hồ sơ yêu cầu…</p>}
    {chiTiet ? <ChiTietYeuCau key={JSON.stringify(chiTiet)} yc={chiTiet} khiCapNhat={taiLai} /> : <>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">{chiSo.map(({ nhan, so, icon: Icon, mau }) => <div key={nhan} className="rounded-2xl border border-[#d6e4db] bg-white p-4 sm:p-5"><dt className="flex items-center justify-between gap-2 text-xs font-medium text-[#607568]"><span>{nhan}</span><span className={`rounded-xl p-2 ${mau}`}><Icon size={17} aria-hidden="true" /></span></dt><dd className="mt-3 text-3xl font-bold tracking-tight text-emerald-950 tabular-nums">{danhSach ? so : '—'}</dd></div>)}</dl>
      <section aria-labelledby="danh-sach-yeu-cau" className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 p-5 sm:px-6"><div><h2 id="danh-sach-yeu-cau" className="flex items-center gap-2 text-lg font-bold text-[#243c30]">Danh sách yêu cầu<span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">{danhSach?.total ?? '…'}</span></h2><p className="mt-1.5 text-sm text-[#718276]">Mở hồ sơ để đối chiếu bằng chứng và đưa ra quyết định.</p></div></div>
        <div className="border-y border-[#e8efea] bg-[#fcfdfc] px-5 py-4 sm:px-6"><div className="flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><span className="sr-only">Tìm yêu cầu</span><Search size={17} className="pointer-events-none absolute left-3 top-3 text-[#8a9f91]" /><input type="search" value={tuKhoa} onChange={(e) => { datTuKhoa(e.target.value); datTrang(1) }} placeholder="Tìm đồ vật, người yêu cầu, mã yêu cầu…" className="w-full rounded-xl border border-[#ceded3] bg-white py-2.5 pl-10 pr-3 text-sm focus-visible:outline-2 focus-visible:outline-emerald-700" /></label><label><span className="sr-only">Lọc trạng thái</span><select value={loc} onChange={(e) => { datLoc(e.target.value); datTrang(1) }} className="w-full rounded-xl border border-[#ceded3] bg-white p-2.5 text-sm text-[#526c5b] sm:w-60"><option value="">Tất cả trạng thái</option>{Object.entries(nhomTrangThai).map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select></label></div><div className="mt-2.5 flex items-center justify-between gap-3 text-xs text-[#718276]"><p>Thống kê trên toàn bộ yêu cầu. Tìm kiếm và lọc trên tất cả các trang.</p>{(loc || tuKhoa) && <button onClick={() => { datLoc(''); datTuKhoa(''); datTrang(1) }} className="inline-flex shrink-0 items-center gap-1 font-semibold text-emerald-800"><X size={13} />Xóa bộ lọc</button>}</div></div>
        {!danhSach ? <p role="status" className="p-12 text-center text-sm text-[#607568]">Đang tải danh sách…</p> : hienThi.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#f8faf8] text-xs font-semibold text-[#718276]"><tr>{['YÊU CẦU / ĐỒ VẬT', 'NGƯỜI YÊU CẦU', 'THỜI GIAN GỬI', 'TRẠNG THÁI', ''].map((t) => <th key={t} className="px-5 py-3.5 first:pl-6">{t}</th>)}</tr></thead><tbody className="divide-y divide-[#edf2ee]">{hienThi.map((y) => <tr key={y.id} className="transition hover:bg-[#f8fcf9]"><td className="max-w-[300px] px-6 py-5"><p className="mb-1 text-xs font-medium text-[#8a9f91]">YC-{String(y.id).padStart(4, '0')}</p><button disabled={dangTai} onClick={() => moChiTiet(y.id)} className="text-left font-semibold leading-6 text-[#243c30] hover:text-emerald-700">{y.tin_dang?.tieu_de || 'Tin đã xóa'}</button></td><td className="px-5 py-5"><div className="flex items-center gap-2.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf5ef] text-xs font-bold text-emerald-800">{y.nguoi_yeu_cau?.ho_ten?.trim().split(/\s+/).slice(-2).map((t) => t[0]).join('') || '?'}</span><div><p className="font-medium text-[#315a43]">{y.nguoi_yeu_cau?.ho_ten || 'Tài khoản đã xóa'}</p><p className="mt-1 text-xs text-[#8a9f91]">{y.nguoi_yeu_cau?.ma_so || 'Chưa có mã số'}</p></div></div></td><td className="px-5 py-5 text-xs leading-6 text-[#607568]">{ngayGio(y.created_at)}</td><td className="px-5 py-5"><NhanYeuCau yc={y} /></td><td className="px-5 py-5"><button disabled={dangTai} onClick={() => moChiTiet(y.id)} aria-label={`Xem yêu cầu ${y.id}`} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">Chi tiết<ArrowUpRight size={14} /></button></td></tr>)}</tbody></table></div> : <div className="flex flex-col items-center px-5 py-16 text-center"><span className="mb-4 rounded-2xl bg-[#f0f6f2] p-4"><Inbox size={30} strokeWidth={1.5} className="text-[#8aab95]" /></span><h3 className="font-bold text-[#315a43]">{(loc || tuKhoa) ? 'Không có yêu cầu phù hợp' : 'Chưa có yêu cầu nhận lại đồ'}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-[#718276]">{(loc || tuKhoa) ? 'Thử đổi từ khóa hoặc xóa bộ lọc để xem các yêu cầu khác.' : 'Các yêu cầu người dùng gửi sẽ xuất hiện ở đây để bạn kiểm tra và xử lý.'}</p></div>}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8efea] px-5 py-4 text-xs text-[#718276] sm:px-6"><p>Hiển thị {hienThi.length} / {danhSach?.total || 0} yêu cầu</p><div className="flex items-center gap-3"><button aria-label="Trang trước" disabled={trang === 1} onClick={() => datTrang(trang - 1)} className={`${nutPhu} !p-2`}><ChevronLeft size={16} /></button><span>Trang <strong className="text-[#315a43]">{trang}</strong> / {danhSach?.last_page || 1}</span><button aria-label="Trang sau" disabled={!danhSach || trang >= danhSach.last_page} onClick={() => datTrang(trang + 1)} className={`${nutPhu} !p-2`}><ChevronRight size={16} /></button></div></div>
      </section>
    </>}
  </div>
}
