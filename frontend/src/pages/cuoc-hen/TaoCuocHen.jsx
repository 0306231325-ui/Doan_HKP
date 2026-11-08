import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarDays, CheckCheck, Clock3, MapPin, Phone, RefreshCw, ShieldCheck } from 'lucide-react'
import api from '../../services/api'

const nut = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40'
const input = 'mt-2 w-full rounded-xl border border-[#ceded3] bg-white p-3 text-sm focus-visible:outline-2 focus-visible:outline-emerald-700'
const card = 'space-y-4 rounded-2xl border border-[#d6e4db] bg-white p-5 sm:p-6'
const ngayGio = (v) => new Date(v).toLocaleString('vi-VN')
const trangThai = { cho_kiem_tra: 'Chờ kiểm tra', can_bo_sung: 'Cần bổ sung', da_xac_minh: 'Đã duyệt', tu_choi: 'Từ chối', da_huy: 'Đã hủy' }

export default function TaoCuocHen() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const [nguon, datNguon] = useState(null)
  const [loiTai, datLoiTai] = useState('')
  const dangLuu = false
  const [moForm, datMoForm] = useState(false)
  const [thoiGian, datThoiGian] = useState('')
  const [diaDiemId, datDiaDiemId] = useState('')
  const [ghiChu, datGhiChu] = useState('')
  const [xacNhan, datXacNhan] = useState(false)
  const [lanTai, datLanTai] = useState(0)
  const [hienTai, datHienTai] = useState(() => Date.now())
  const dangGui = useRef(false)
  const phienDuLieu = useRef(0)
  useEffect(() => {
    if (!id) return
    const abort = new AbortController()
    async function tai() {
      if (dangGui.current) return
      const phien = phienDuLieu.current
      try {
        const { data } = await api.get(`/me/yeu-cau/${id}`, { signal: abort.signal })
        if (!abort.signal.aborted && !dangGui.current && phien === phienDuLieu.current) { datNguon({ id, ...data }); datLoiTai('') }
      } catch (e) {
        if (!abort.signal.aborted) datLoiTai(e.response?.status === 404 ? 'Không tìm thấy yêu cầu của bạn.' : 'Không tải được yêu cầu. Vui lòng thử lại.')
      }
    }
    tai()
    const timer = window.setInterval(tai, 15000)
    window.addEventListener('focus', tai)
    return () => { abort.abort(); window.clearInterval(timer); window.removeEventListener('focus', tai) }
  }, [id, lanTai])
  useEffect(() => {
    const timer = window.setInterval(() => datHienTai(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const yc = nguon?.id === id ? nguon.data : null
  const hen = yc?.cuoc_hen.find((h) => ['cho_xac_nhan', 'da_xac_nhan', 'da_hoan_tat'].includes(h.trang_thai))
  const hoanTat = hen?.trang_thai === 'da_hoan_tat'
  const daXacNhan = hen && (yc.laNguoiGiu ? hen.nguoi_giu_xac_nhan_luc : hen.nguoi_nhan_xac_nhan_luc)
  const coXacNhan = hen && (hen.nguoi_giu_xac_nhan_luc || hen.nguoi_nhan_xac_nhan_luc)
  const chuaDenGio = hen && new Date(hen.thoi_gian_hen_gap).getTime() > hienTai
  return <div className="mx-auto max-w-4xl space-y-5 pb-6">
    <Link to="/theo-doi-yeu-cau" className="text-sm font-semibold text-emerald-800">← Theo dõi yêu cầu</Link>
    <header className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-extrabold text-emerald-950 sm:text-3xl">Cuộc hẹn nhận lại đồ</h1><p className="mt-2 text-sm leading-6 text-[#607568]">Thống nhất lịch gặp, kiểm tra đồ vật và xác nhận giao nhận giữa hai bên.</p></div><button disabled={dangLuu} aria-label="Tải lại yêu cầu" onClick={() => datLanTai(lanTai + 1)} className="rounded-xl border border-[#d6e4db] bg-white p-3 disabled:opacity-40"><RefreshCw size={17} /></button></header>
    {loiTai && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{loiTai}</p>}
    {!id ? <p className={card}>Chọn một yêu cầu từ trang Theo dõi yêu cầu để xem chi tiết.</p> : !yc ? !loiTai && <p role="status">Đang tải yêu cầu…</p> : <>
      <section className={card}><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-[#8a9f91]">Yêu cầu #{yc.id} · {yc.laNguoiGiu ? 'Bạn là người giữ đồ' : 'Bạn là người nhận đồ'}</p><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">{hoanTat ? 'Đã trả đồ' : trangThai[yc.trang_thai]}</span></div><Link to={`/chi-tiet-tin-dang?id=${yc.tin_dang_id}`} className="block text-lg font-bold text-emerald-950 hover:underline">{yc.tin_dang?.tieu_de || 'Tin không còn hiển thị'}</Link>{yc.ghi_chu_admin && yc.trang_thai !== 'da_xac_minh' && <p className="whitespace-pre-wrap rounded-xl bg-amber-50 p-4 text-sm">{yc.ghi_chu_admin}</p>}</section>
      {yc.lienHe ? <>
        <section className={card}><h2 className="flex items-center gap-2 font-bold text-[#315a43]"><Phone size={18} />Liên hệ {yc.laNguoiGiu ? 'người nhận' : 'người giữ đồ'}</h2><p className="text-sm text-[#718276]">Thông tin chỉ mở cho đúng hai bên sau khi admin duyệt.</p><dl className="grid gap-4 text-sm sm:grid-cols-3">{[['Họ tên', yc.lienHe.hoTen], ['Điện thoại', yc.lienHe.soDienThoai], ['Email', yc.lienHe.email]].map(([k, v]) => <div key={k}><dt className="mb-1 text-xs text-[#8a9f91]">{k}</dt><dd className="break-words font-medium text-[#315a43]">{v || 'Chưa cung cấp'}</dd></div>)}</dl></section>
        <section className={card}><h2 className="flex items-center gap-2 font-bold text-[#315a43]"><CalendarDays size={18} />Lịch gặp tại trường</h2>
          {hen ? <div className="space-y-3 rounded-xl bg-emerald-50 p-4 text-sm"><p className="flex items-center gap-2 font-semibold text-emerald-950"><Clock3 size={16} />{ngayGio(hen.thoi_gian_hen_gap)}</p><p className="flex items-center gap-2 text-[#607568]"><MapPin size={16} />{hen.dia_diem?.ten_dia_diem}</p><p className="border-t border-emerald-100 pt-3 text-[#607568]">{hoanTat ? 'Hai bên đã xác nhận giao nhận hoàn tất.' : hen.lichCu ? 'Lịch cũ do admin tạo. Một trong hai bên cần đề xuất lịch mới.' : hen.trang_thai === 'da_xac_nhan' ? 'Hai bên đã thống nhất lịch hẹn.' : hen.laNguoiDeXuat ? 'Bạn đã đề xuất lịch, đang chờ người còn lại đồng ý.' : 'Bạn có một đề xuất lịch hẹn cần phản hồi.'}</p></div> : <p className="text-sm leading-6 text-[#718276]">Chưa có lịch hẹn đang hiệu lực. Một trong hai bên có thể đề xuất thời gian và địa điểm gặp.</p>}
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Phần cuộc hẹn và giao nhận chỉ để xem trước. Đề xuất không được gửi hoặc lưu; chức năng xác nhận chưa được kết nối.</p>
          {!hoanTat && <>
            {hen?.trang_thai === 'cho_xac_nhan' && !hen.laNguoiDeXuat && !hen.lichCu && <button disabled title="Chức năng chưa được kết nối" className={nut}><ShieldCheck size={16} />Đồng ý lịch hẹn</button>}
            {!coXacNhan && <button disabled={dangLuu} onClick={() => datMoForm(!moForm)} className="block text-sm font-semibold text-emerald-800 underline">{moForm ? 'Đóng form đề xuất' : hen ? 'Đề xuất đổi lịch' : 'Tạo đề xuất cuộc hẹn'}</button>}
            {(moForm || (hen?.trang_thai === 'cho_xac_nhan' && !hen.laNguoiDeXuat && !hen.lichCu)) && <label className="block text-sm font-medium text-[#526c5b]">Ghi chú / lý do không thể tham gia<textarea disabled={dangLuu} maxLength={2000} rows={2} className={input} value={ghiChu} onChange={(e) => datGhiChu(e.target.value)} /></label>}
            {moForm && <form onSubmit={(e) => e.preventDefault()} className="space-y-4 rounded-xl border border-[#d6e4db] p-4"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-[#526c5b]">Ngày giờ gặp<input required disabled={dangLuu} type="datetime-local" className={input} value={thoiGian} onChange={(e) => datThoiGian(e.target.value)} /></label><label className="text-sm font-medium text-[#526c5b]">Địa điểm trong trường<select required disabled={dangLuu} className={input} value={diaDiemId} onChange={(e) => datDiaDiemId(e.target.value)}><option value="">Chọn địa điểm</option>{nguon.diaDiem.map((d) => <option key={d.id} value={d.id}>{d.ten_dia_diem}</option>)}</select></label></div><p className="text-xs leading-5 text-[#718276]">Chỉ xem trước thời gian và địa điểm, không thay đổi cuộc hẹn hiện có.</p><button type="button" disabled title="Chức năng gửi đề xuất chưa được kết nối" className={nut}>Gửi đề xuất cuộc hẹn</button></form>}
            {hen?.trang_thai === 'cho_xac_nhan' && !hen.laNguoiDeXuat && !hen.lichCu && <button disabled title="Chức năng chưa được kết nối" className="block text-sm font-semibold text-rose-700">Không thể tham gia lịch này</button>}
          </>}
        </section>
        {hen && ['da_xac_nhan', 'da_hoan_tat'].includes(hen.trang_thai) && !hen.lichCu && <section className={card}><h2 className="flex items-center gap-2 font-bold text-[#315a43]"><CheckCheck size={18} />Xác nhận giao nhận</h2><div className="grid gap-3 text-sm sm:grid-cols-2"><p className="rounded-xl bg-[#f5f9f6] p-4">Người nhặt: <strong>{hen.nguoi_giu_xac_nhan_luc ? 'Đã xác nhận giao đồ' : 'Chưa xác nhận'}</strong></p><p className="rounded-xl bg-[#f5f9f6] p-4">Người mất: <strong>{hen.nguoi_nhan_xac_nhan_luc ? 'Đã xác nhận nhận đồ' : 'Chưa xác nhận'}</strong></p></div>{hoanTat ? <p className="text-sm font-semibold text-emerald-800">Đã trả đồ. Cuộc hẹn hoàn tất và các yêu cầu còn lại đã được đóng.</p> : daXacNhan ? <p className="text-sm text-[#607568]">Đã lưu xác nhận của bạn. Đang chờ người còn lại xác nhận để hoàn tất.</p> : <>{chuaDenGio && <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Chưa đến giờ hẹn. Bạn có thể xác nhận giao nhận từ <strong>{ngayGio(hen.thoi_gian_hen_gap)}</strong>. Nếu gặp sớm hơn, hãy đề xuất đổi lịch và để người còn lại đồng ý.</p>}<p className="text-sm leading-6 text-[#718276]">Chỉ xác nhận sau khi đã gặp, xác minh trực tiếp và thực hiện giao nhận. Hệ thống chỉ đóng tin khi cả hai xác nhận.</p><label className="flex items-start gap-2 text-sm leading-6 text-[#526c5b]"><input disabled type="checkbox" className="mt-1 accent-emerald-800" checked={xacNhan} onChange={(e) => datXacNhan(e.target.checked)} />{yc.laNguoiGiu ? 'Tôi đã giao đồ cho đúng người nhận.' : 'Tôi đã kiểm tra và nhận lại đúng đồ của mình.'}</label><button disabled title="Chức năng chưa được kết nối" className={nut}>{dangLuu ? 'Đang lưu xác nhận…' : yc.laNguoiGiu ? 'Xác nhận đã giao đồ' : 'Xác nhận đã nhận đồ'}</button></>}</section>}
      </> : <p className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">Liên hệ và cuộc hẹn chỉ mở sau khi admin duyệt. Bạn có thể theo dõi kết quả hoặc gửi bổ sung ở trang Theo dõi yêu cầu.</p>}
    </>}
  </div>
}
