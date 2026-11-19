import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, CalendarDays, ClipboardList, Inbox, MapPin, RefreshCw } from 'lucide-react'
import HopThoai from '../../components/shared/HopThoai'
import useThongBaoThaoTac from '../../components/shared/hooks/useThongBaoThaoTac'
import api, { prepareCsrf } from '../../services/api'
import { nhanTrangThaiLichHen } from '../cuoc-hen/xuLyTienDoYeuCau'

const nut = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#d6e4db] bg-white px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:opacity-40'
const ngayGio = (value) => value ? new Date(value).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Chưa có thời gian'

function trangThai(y) {
  if (y.tin_dang?.trang_thai === 'da_hoan_tat') return y.trang_thai === 'da_xac_minh' ? 'Đã nhận đồ' : 'Đã đóng'
  if (['cho_kiem_tra', 'can_bo_sung'].includes(y.trang_thai)) return y.tin_dang?.trang_thai === 'cho_ban_giao' ? 'Tạm dừng xét duyệt' : 'Chờ duyệt'
  return { da_xac_minh: y.tin_dang?.loai_tin === 'bao_mat' ? 'Tự hẹn trả đồ' : 'Đã duyệt', tu_choi: 'Từ chối', da_huy: 'Đã hủy' }[y.trang_thai] || y.trang_thai
}

function mauTrangThai(y) {
  if (y.tin_dang?.trang_thai === 'da_hoan_tat' && y.trang_thai !== 'da_xac_minh') return 'border-slate-200 bg-slate-100 text-slate-600'
  if (['tu_choi', 'da_huy'].includes(y.trang_thai)) return 'border-rose-200 bg-rose-100 text-rose-800'
  if (['cho_kiem_tra', 'can_bo_sung'].includes(y.trang_thai)) return 'border-amber-200 bg-amber-100 text-amber-800'
  return 'border-emerald-200 bg-emerald-100 text-emerald-800'
}

export default function TheoDoiYeuCau() {
  const [params, datParams] = useSearchParams()
  const hienThongBao = useThongBaoThaoTac()
  const tab = params.get('tab') === 'lich-hen' ? 'lich-hen' : 'yeu-cau'
  const khoaTrang = tab === 'lich-hen' ? 'pageHen' : 'page'
  const trang = Math.max(1, Number.parseInt(params.get(khoaTrang), 10) || 1)
  const [lanTai, datLanTai] = useState(0)
  const [nguon, datNguon] = useState(null)
  const [yeuCauHuy, datYeuCauHuy] = useState(null)
  const [dangHuy, datDangHuy] = useState(false)
  const [loiHuy, datLoiHuy] = useState('')
  const khoaHuy = useRef(false)
  const khoa = `${tab}-${trang}-${lanTai}`
  const ketQua = nguon?.khoa === khoa ? nguon.data : null
  const loi = nguon?.khoa === khoa ? nguon.loi : ''
  useEffect(() => {
    const abort = new AbortController()
    function tai() {
      api.get('/me/yeu-cau', { params: { page: trang, loai: tab === 'lich-hen' ? 'lich_hen' : undefined }, signal: abort.signal })
        .then(({ data }) => { if (!abort.signal.aborted) datNguon({ khoa, data: data.data }) })
        .catch(() => { if (!abort.signal.aborted) datNguon({ khoa, loi: 'Không tải được dữ liệu. Vui lòng thử lại.' }) })
    }
    tai()
    const timer = tab === 'lich-hen' ? window.setInterval(tai, 15000) : null
    window.addEventListener('focus', tai)
    return () => {
      abort.abort()
      if (timer !== null) window.clearInterval(timer)
      window.removeEventListener('focus', tai)
    }
  }, [tab, trang, khoa])
  function chonTab(value) {
    const moi = new URLSearchParams(params)
    if (value === 'lich-hen') moi.set('tab', value)
    else moi.delete('tab')
    datParams(moi)
  }
  function doiTrang(value) {
    const moi = new URLSearchParams(params)
    moi.set(khoaTrang, String(value))
    datParams(moi)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function dongXacNhanHuy() {
    if (khoaHuy.current) return
    datYeuCauHuy(null)
    datLoiHuy('')
  }

  async function xacNhanHuy() {
    if (!yeuCauHuy || khoaHuy.current) return
    khoaHuy.current = true
    datDangHuy(true)
    datLoiHuy('')
    try {
      await prepareCsrf()
      const { data } = await api.post(`/me/yeu-cau/${yeuCauHuy.id}/huy`)
      datYeuCauHuy(null)
      datLanTai((n) => n + 1)
      hienThongBao(data.message)
    } catch (loiGui) {
      if (loiGui.response?.status === 409) {
        datLanTai((n) => n + 1)
        datLoiHuy(loiGui.response.data.message)
      } else {
        datLoiHuy('Chưa thể hủy yêu cầu. Vui lòng thử lại.')
      }
    } finally {
      khoaHuy.current = false
      datDangHuy(false)
    }
  }
  return <div className="mx-auto max-w-4xl space-y-5">
    <header className="flex items-start justify-between gap-4"><div><h1 className="text-3xl font-extrabold text-emerald-900">Theo dõi yêu cầu</h1><p className="mt-2 text-sm text-[#607568]">Theo dõi kết quả nhận đồ và lịch hẹn giao nhận của bạn.</p></div><button type="button" className={nut} onClick={() => datLanTai((n) => n + 1)}><RefreshCw size={16} /><span className="hidden sm:inline">Làm mới</span><span className="sr-only sm:hidden">Làm mới</span></button></header>
    <nav aria-label="Loại theo dõi" className="flex gap-1 rounded-2xl border border-[#d6e4db] bg-white p-1.5">{[{ id: 'yeu-cau', ten: 'Yêu cầu nhận đồ', Icon: ClipboardList }, { id: 'lich-hen', ten: 'Lịch hẹn', Icon: CalendarDays }].map(({ id, ten, Icon }) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => chonTab(id)} className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-emerald-700 ${tab === id ? 'bg-emerald-900 text-white' : 'text-[#607568] hover:bg-emerald-50'}`}><Icon size={17} aria-hidden="true" />{ten}</button>)}</nav>

    <section aria-label={tab === 'lich-hen' ? 'Danh sách lịch hẹn' : 'Danh sách yêu cầu'} className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white">
      <div className="border-b border-[#edf2ee] px-5 py-4 sm:px-6"><h2 className="font-bold text-[#315a43]">{tab === 'lich-hen' ? 'Danh sách lịch hẹn' : 'Danh sách yêu cầu'}</h2></div>
      <div className="divide-y divide-[#edf2ee]">
    {loi ? <p role="alert" className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-700">{loi}</p> : !ketQua ? <p role="status" className="rounded-2xl bg-white p-10 text-center text-sm text-[#607568]">Đang tải…</p> : !ketQua.data.length ? <div className="p-10 text-center"><Inbox size={32} className="mx-auto mb-3 text-[#8aab95]" /><h2 className="font-bold text-[#315a43]">{tab === 'lich-hen' ? 'Chưa có lịch hẹn' : 'Chưa có yêu cầu nhận đồ'}</h2>{tab === 'lich-hen' && <><p className="mt-2 text-sm text-[#718276]">Bạn có thể đặt hẹn khi yêu cầu nhận đồ được duyệt.</p><button type="button" className={`${nut} mt-4`} onClick={() => chonTab('yeu-cau')}>Xem yêu cầu nhận đồ</button></>}</div> : ketQua.data.map((y) => tab === 'lich-hen' ? <section key={y.id} className="space-y-4 p-5 sm:p-6"><h2 className="font-bold text-emerald-900">{y.tin_dang?.tieu_de || 'Tin đã xóa'}</h2>{y.cuoc_hen.map((h) => <div key={h.id} className="rounded-xl border border-[#e1eae4] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold text-[#315a43]">{y.lienHe?.hoTen || 'Người tham gia'} · {y.laNguoiGiu ? 'Bạn giữ đồ' : 'Bạn nhận đồ'}</p><span className="rounded-full bg-[#f1f6f3] px-3 py-1 text-xs text-[#526c5b]">{nhanTrangThaiLichHen(h)}</span></div><p className="mt-3 flex items-center gap-2 text-sm text-[#607568]"><CalendarDays size={16} />{ngayGio(h.thoi_gian_hen_gap)}</p><p className="mt-2 flex items-center gap-2 text-sm text-[#607568]"><MapPin size={16} />{h.dia_diem?.ten_dia_diem || 'Chưa có địa điểm'}</p>{h.ly_do_huy && <p className="mt-3 text-sm text-rose-700">Lý do hủy: {h.ly_do_huy}</p>}</div>)}<Link to={`/chi-tiet-yeu-cau?id=${y.id}&tab=lich-hen&pageHen=${trang}`} className={nut}>Xem cuộc hẹn<ArrowRight size={15} /></Link></section> : <article key={y.id} className="relative space-y-4 p-5 transition-colors hover:bg-[#f5faf7] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="font-bold text-emerald-900">{y.tin_dang?.tieu_de || 'Tin đã xóa'}</h2>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${mauTrangThai(y)}`}>{trangThai(y)}</span>
      </div>
      <p className="text-xs text-[#718276]">{y.laNguoiGiu ? 'Bạn giữ đồ' : 'Bạn nhận đồ'} · Gửi lúc {ngayGio(y.created_at)}</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/chi-tiet-yeu-cau?id=${y.id}&page=${trang}`}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 after:absolute after:inset-0 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-emerald-700"
        >
          Xem chi tiết<ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
        </Link>
        {y.coTheHuyYeuCau && <button
          type="button"
          onClick={() => datYeuCauHuy(y)}
          aria-haspopup="dialog"
          className="relative z-10 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
        >
          Hủy yêu cầu
        </button>}
      </div>
    </article>)}
      </div>
    {ketQua && !loi && ketQua.last_page > 1 && <nav aria-label="Phân trang" className="flex flex-wrap items-center justify-end gap-3 border-t border-[#edf2ee] px-5 py-4 sm:px-6 text-sm text-[#607568]">
      {ketQua.last_page > 1 && <div className="flex items-center gap-3">
        <button type="button" className={nut} disabled={trang <= 1} onClick={() => doiTrang(trang - 1)}>Trước</button>
        <button type="button" className={nut} disabled={trang >= ketQua.last_page} onClick={() => doiTrang(trang + 1)}>Sau</button>
      </div>}
    </nav>}
    </section>
    {yeuCauHuy && <HopThoai tieuDe="Hủy yêu cầu nhận đồ?" moTa="Yêu cầu sẽ dừng xét duyệt sau khi bạn xác nhận." khiDong={dongXacNhanHuy}>
      <div className="space-y-4 p-5 sm:p-6">
        <p className="break-words text-sm font-semibold text-[#315a43]">{yeuCauHuy.tin_dang?.tieu_de}</p>
        {loiHuy && <p role="alert" className="text-sm text-rose-700">{loiHuy}</p>}
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={dongXacNhanHuy} disabled={dangHuy} className={nut}>Giữ yêu cầu</button>
          <button type="button" onClick={xacNhanHuy} disabled={dangHuy} className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:opacity-50">
            {dangHuy ? 'Đang hủy…' : 'Xác nhận hủy'}
          </button>
        </div>
      </div>
    </HopThoai>}
  </div>
}
