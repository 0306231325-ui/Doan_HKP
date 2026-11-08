import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, ClipboardCheck, Clock3, FileQuestion, Image, LockKeyhole, MessageSquareText, ShieldCheck, X } from 'lucide-react'
import api, { prepareCsrf } from '../../../services/api'
import NhanYeuCau from './NhanYeuCau'
import QuyetDinhYeuCau from './QuyetDinhYeuCau'
import HopThoai from '../../../components/shared/HopThoai'
import { ngayGio } from './duLieuYeuCau'

const giaTri = (a) => a?.gia_tri_text ?? a?.gia_tri_so ?? a?.gia_tri_lua_chon ?? 'Chưa cung cấp'
const nut = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-40'
const ketQua = [
  { giaTri: 'khop', nhan: 'Khớp', icon: Check, mau: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
  { giaTri: 'khong_khop', nhan: 'Không khớp', icon: X, mau: 'border-rose-200 bg-rose-50 text-rose-700' },
  { giaTri: 'chua_du_can_cu', nhan: 'Chưa đủ căn cứ', icon: FileQuestion, mau: 'border-amber-200 bg-amber-50 text-amber-800' },
]

function Khung({ tieuDe, icon: Icon, phuDe, children, className = '', phai }) {
  return <section className={`overflow-hidden rounded-2xl border border-[#d6e4db] bg-white shadow-sm ${className}`}><div className="flex items-start justify-between gap-3 border-b border-[#edf2ee] px-5 py-4"><div><h2 className="flex items-center gap-2.5 text-sm font-bold text-[#243c30]"><Icon size={17} className="text-emerald-700" aria-hidden="true" />{tieuDe}</h2>{phuDe && <p className="mt-1.5 text-xs leading-5 text-[#718276]">{phuDe}</p>}</div>{phai}</div><div className="p-5">{children}</div></section>
}

export default function ChiTietYeuCau({ yc, khiCapNhat }) {
  const [ghiChu, datGhiChu] = useState('')
  const [doiChieu, datDoiChieu] = useState(Object.fromEntries(yc.tra_loi.map((a) => [a.id, a.ket_qua_doi_chieu])))
  const [loi, datLoi] = useState('')
  const [dangLuu, datDangLuu] = useState(false)
  const [anhDangXem, datAnhDangXem] = useState(null)
  const choDuyet = ['cho_kiem_tra', 'can_bo_sung'].includes(yc.trang_thai)
  const [moXuLy, datMoXuLy] = useState(false)
  const soKhop = Object.values(doiChieu).filter((v) => v === 'khop').length
  const duDieuKien = yc.tra_loi.length > 0 && soKhop === yc.tra_loi.length
  async function xuLy(hanhDong) {
    if (hanhDong !== 'da_xac_minh' && !ghiChu.trim()) { datLoi('Vui lòng nhập lý do hoặc kết quả xác minh.'); return }
    datDangLuu(true); datLoi('')
    try {
      await prepareCsrf()
      await api.patch(`/admin/yeu-cau/${yc.id}`, { hanhDong, ghiChu, doiChieu })
      await khiCapNhat()
      datMoXuLy(false)
    } catch (e) { datLoi(e.response?.data?.message || 'Không thực hiện được. Kiểm tra thời gian và thử lại.') }
    finally { datDangLuu(false) }
  }
  return <div className="space-y-5">
    {moXuLy && <QuyetDinhYeuCau yc={yc} duDieuKien={duDieuKien} ghiChu={ghiChu} datGhiChu={datGhiChu} loi={loi} dangLuu={dangLuu} khiDong={() => datMoXuLy(false)} khiXuLy={xuLy} />}
    {anhDangXem && <HopThoai rong tieuDe={anhDangXem.nhan} khiDong={() => datAnhDangXem(null)}><div className="bg-[#f7faf8] p-3 sm:p-5"><img src={anhDangXem.url} alt={anhDangXem.nhan} className="max-h-[70dvh] w-full object-contain" /></div></HopThoai>}
    <section className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5 sm:px-6"><div className="min-w-0 flex-1"><p className="mb-2 text-xs font-semibold tracking-wider text-[#8a9f91]">HỒ SƠ YC-{String(yc.id).padStart(4, '0')}</p><h2 className="text-xl font-bold leading-8 text-emerald-950">{yc.tin_dang?.tieu_de || 'Tin không còn hiển thị'}</h2><p className="mt-2 flex items-center gap-1.5 text-xs text-[#718276]"><Clock3 size={13} />Gửi lúc {ngayGio(yc.created_at)}</p></div><div className="flex flex-col items-end gap-3"><NhanYeuCau yc={yc} /><Link to={`/chi-tiet-tin-dang?id=${yc.tin_dang_id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline">Xem tin đăng<ArrowUpRight size={14} /></Link></div></div>
    </section>

    <div className="grid items-start gap-5 ">
      <div className="min-w-0 space-y-5">
        <Khung tieuDe="Đối chiếu thông tin nhận diện" icon={ShieldCheck} phuDe="So sánh lời khai của hai bên và đánh giá từng câu trả lời." phai={<span className="shrink-0 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">{soKhop}/{yc.tra_loi.length} khớp</span>}>
          <div role="region" aria-label="Nội dung đối chiếu và bằng chứng" tabIndex={0} className="max-h-[70vh] space-y-5 overflow-y-auto overscroll-contain pr-2 [scrollbar-gutter:stable] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-emerald-700 lg:max-h-[680px]">
          <div className="mb-5 flex items-start gap-2 rounded-xl bg-[#f5f8f5] px-3 py-2.5 text-xs leading-5 text-[#718276]"><LockKeyhole size={14} className="mt-0.5 shrink-0" />Thông tin đối chiếu chỉ dành cho quản trị viên, không hiển thị cho người yêu cầu.</div>
          <div className="space-y-5">{yc.tra_loi.map((a, i) => <div key={a.id} className="overflow-hidden rounded-xl border border-[#e0e9e2]">
            <h3 className="flex items-start gap-2.5 bg-[#fafcfb] px-4 py-3 text-sm font-semibold leading-6 text-[#315a43]"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#e9f1ec] text-[10px] text-[#607568]">{i + 1}</span>{a.loi_khai_tin_dang?.phien_ban_cau_hoi?.du_lieu?.noi_dung || 'Câu hỏi nhận diện'}</h3>
            <div className="grid sm:grid-cols-2"><div className="border-b border-[#edf2ee] p-4 sm:border-b-0 sm:border-r"><p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#8a9f91]">Người giữ đồ khai</p><p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#526c5b]">{giaTri(a.loi_khai_tin_dang)}</p></div><div className="bg-emerald-50/40 p-4"><p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Người yêu cầu trả lời</p><p className="whitespace-pre-wrap break-words text-sm font-medium leading-6 text-[#315a43]">{giaTri(a)}</p></div></div>
            <fieldset disabled={!choDuyet || dangLuu} className="border-t border-[#edf2ee] px-4 py-3"><legend className="sr-only">Kết quả câu {i + 1}</legend><div className="flex flex-wrap gap-2">{ketQua.map(({ giaTri: v, nhan, icon: Icon, mau }) => <button type="button" key={v} aria-pressed={doiChieu[a.id] === v} onClick={() => datDoiChieu({ ...doiChieu, [a.id]: doiChieu[a.id] === v ? 'chua_danh_gia' : v })} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:cursor-default ${doiChieu[a.id] === v ? mau : 'border-[#e0e9e2] bg-white text-[#8a9f91] enabled:hover:bg-[#f7faf8]'}`}><Icon size={13} />{nhan}</button>)}</div></fieldset>
          </div>)}{!yc.tra_loi.length && <p className="py-5 text-center text-sm text-[#718276]">Chưa có câu trả lời xác minh.</p>}</div>
          <section className="border-t border-[#e0e9e2] pt-5" aria-label="Lời nhắn và thông tin bổ sung"><h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#315a43]"><MessageSquareText size={16} className="text-emerald-700" />Lời nhắn & thông tin bổ sung</h3><p className="whitespace-pre-wrap break-words rounded-xl bg-[#f7faf8] p-4 text-sm leading-7 text-[#526c5b]">{yc.loi_nhan || 'Người yêu cầu không để lại lời nhắn.'}</p></section>
          <section className="border-t border-[#e0e9e2] pt-5" aria-label="Ảnh bằng chứng"><div className="mb-3 flex items-center justify-between gap-3"><h3 className="flex items-center gap-2 text-sm font-semibold text-[#315a43]"><Image size={16} className="text-emerald-700" />Ảnh bằng chứng</h3><span className="text-xs text-[#8a9f91]">{yc.minh_chung.length} ảnh</span></div><p className="mb-3 text-xs text-[#718276]">Nhấn vào ảnh để xem kích thước đầy đủ.</p>
          {yc.minh_chung.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{yc.minh_chung.map((a, i) => { const url = `${api.defaults.baseURL}/admin/yeu-cau/${yc.id}/anh/${a.id}`; return <button type="button" key={a.id} aria-haspopup="dialog" onClick={() => datAnhDangXem({ url, nhan: a.mo_ta || `Ảnh minh chứng ${i + 1}` })} className="group cursor-zoom-in text-left overflow-hidden rounded-xl border border-[#e0e9e2] focus-visible:outline-2 focus-visible:outline-emerald-700"><img className="aspect-[4/3] w-full bg-[#f7faf8] object-contain transition group-hover:scale-105" src={url} alt={a.mo_ta || `Bằng chứng ${i + 1}`} /><p className="flex items-center justify-between border-t border-[#edf2ee] p-2.5 text-xs text-[#607568]">Bằng chứng {i + 1}<ArrowUpRight size={13} /></p></button> })}</div> : <div className="flex items-center gap-3 rounded-xl border border-dashed border-[#d6e4db] bg-[#fafcfb] p-5"><Image size={24} strokeWidth={1.5} className="shrink-0 text-[#9bb3a2]" /><p className="text-sm text-[#8a9f91]">Người yêu cầu chưa đính kèm ảnh bằng chứng.</p></div>}
          </section>
          </div>
        </Khung>
        {yc.trang_thai !== 'da_xac_minh' && <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#d6e4db] bg-white p-5">
          {choDuyet ? <><p className="text-sm leading-6 text-[#718276]">Kiểm tra thông tin đối chiếu trước khi đưa ra quyết định.</p><button type="button" aria-haspopup="dialog" onClick={() => { datLoi(''); datGhiChu(''); datMoXuLy(true) }} className={nut}><ClipboardCheck size={17} />Xử lý yêu cầu</button></> : <><NhanYeuCau yc={yc} />{yc.ghi_chu_admin && <p className="whitespace-pre-wrap text-sm leading-6 text-[#607568]">{yc.ghi_chu_admin}</p>}</>}
        </div>}
      </div>


    </div>
  </div>
}



