import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock3, Mail, MapPin, Phone, RefreshCw, UserRound } from 'lucide-react'
import ThongTinYeuCau from './ThongTinYeuCau'
import TienDoYeuCau from './TienDoYeuCau'
import dinhDangGioHen from './dinhDangGioHen'
import useChiTietYeuCau from './hooks/useChiTietYeuCau'
import { nhanTrangThaiLichHen } from './xuLyTienDoYeuCau'

const nut = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d6e4db] bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700'
const card = 'overflow-hidden rounded-2xl border border-[#d6e4db] bg-white'

export default function TaoCuocHen() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const [lanTai, datLanTai] = useState(0)
  const { yc, loi } = useChiTietYeuCau(id, lanTai)
  const cacHen = [...(yc?.cuoc_hen || [])].sort((a, b) => b.id - a.id)
  const cuocHenId = params.get('cuocHen')
  const hen = cacHen.find((h) => String(h.id) === cuocHenId)
    ?? cacHen.find((h) => ['cho_xac_nhan', 'da_xac_nhan', 'da_hoan_tat'].includes(h.trang_thai))
  const hoanTat = yc?.tin_dang?.trang_thai === 'da_hoan_tat' || hen?.trang_thai === 'da_hoan_tat'
  const duyet = yc?.trang_thai === 'da_xac_minh'
  const xemLichHen = duyet && params.get('tab') === 'lich-hen'
  const quayLai = new URLSearchParams()
  const khoaTrang = xemLichHen ? 'pageHen' : 'page'
  if (xemLichHen) quayLai.set('tab', 'lich-hen')
  if (params.has(khoaTrang)) quayLai.set(khoaTrang, params.get(khoaTrang))
  const tamDung = ['cho_kiem_tra', 'can_bo_sung'].includes(yc?.trang_thai) && yc?.tin_dang?.trang_thai === 'cho_ban_giao'
  const nhan = hoanTat ? duyet ? 'Đã nhận đồ' : 'Đã đóng' : tamDung ? 'Tạm dừng xét duyệt' : ({ da_xac_minh: yc?.tin_dang?.loai_tin === 'bao_mat' ? 'Tự hẹn trả đồ' : 'Đã duyệt', cho_kiem_tra: 'Chờ duyệt', can_bo_sung: 'Chờ duyệt', tu_choi: 'Từ chối', da_huy: 'Đã hủy' }[yc?.trang_thai])
  const coTheDatHen = duyet && yc.coTheDatLich
  return <div className="mx-auto max-w-4xl space-y-5 pb-6">
    <div className="flex items-center justify-between gap-3"><Link to={{ pathname: '/theo-doi-yeu-cau', search: quayLai.toString() }} className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-[#607568] hover:text-emerald-900"><ArrowLeft size={16} />Theo dõi yêu cầu</Link><button type="button" aria-label="Làm mới yêu cầu" className={nut} onClick={() => datLanTai((n) => n + 1)}><RefreshCw size={16} /><span className="hidden sm:inline">Làm mới</span></button></div>
    <h1 className="sr-only">{xemLichHen ? 'Chi tiết cuộc hẹn' : 'Chi tiết yêu cầu nhận đồ'}</h1>
    {!id || loi ? <p role="alert" className={`${card} p-6 text-sm text-rose-700`}>{loi || 'Chọn một yêu cầu từ trang Theo dõi yêu cầu để xem chi tiết.'}</p> : !yc ? <p role="status" className={`${card} p-10 text-center text-sm text-[#607568]`}>Đang tải yêu cầu…</p> : <>
      <article className={card}><div className="border-l-4 border-emerald-800 p-5 sm:p-6"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-medium text-[#718276]">{yc.laNguoiGiu ? 'Bạn giữ đồ' : 'Bạn nhận đồ'}</p><span className="rounded-full bg-[#edf5ef] px-3 py-1 text-xs font-semibold text-emerald-800">{nhan}</span></div><Link to={`/chi-tiet-tin-dang?id=${yc.tin_dang_id}`} className="text-xl font-bold leading-7 text-[#243c30] hover:text-emerald-700">{yc.tin_dang?.tieu_de || 'Tin không còn hiển thị'}</Link></div><TienDoYeuCau yc={yc} xemLichHen={xemLichHen} />
      <ThongTinYeuCau key={yc.id} yc={yc} />
      {duyet && yc.lienHe ? <>
        <section className="border-t border-[#edf2ee] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-4">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800"><UserRound size={20} /></span><div><p className="text-xs text-[#718276]">{yc.laNguoiGiu ? 'Người nhận đồ' : 'Người giữ đồ'}</p><h2 className="mt-0.5 font-bold text-[#315a43]">{yc.lienHe.hoTen || 'Chưa có tên'}</h2></div></div>
          <div className="flex flex-wrap gap-x-8 gap-y-4"><ThongTinLienHe Icon={Phone} nhan="Điện thoại" giaTri={yc.lienHe.soDienThoai} href={yc.lienHe.soDienThoai ? `tel:${yc.lienHe.soDienThoai.replace(/[^+\d]/g, '')}` : null} /><ThongTinLienHe Icon={Mail} nhan="Email" giaTri={yc.lienHe.email} href={yc.lienHe.email ? `mailto:${yc.lienHe.email}` : null} /></div>
          </div>
        {coTheDatHen && <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950 sm:w-72 sm:shrink-0">
          <p className="font-semibold">Thống nhất lịch gặp</p>
          <p className="mt-1">Vui lòng liên hệ với người còn lại để thống nhất giờ và địa điểm gặp. Sau đó, vào mục Đặt hẹn để tạo lịch.</p>
        </div>}
          </div>
        </section>
        {hen && <section className="border-t border-[#edf2ee]"><div className="flex items-center justify-between gap-3 border-b border-[#edf2ee] px-5 py-4 sm:px-6"><h2 className="flex items-center gap-2 font-bold text-[#315a43]"><CalendarDays size={18} />Lịch hẹn giao nhận</h2>{hen && <span className="rounded-full bg-[#f1f6f3] px-3 py-1 text-xs text-[#607568]">{nhanTrangThaiLichHen(hen)}</span>}</div>
          {!xemLichHen && <Link to={`/chi-tiet-yeu-cau?id=${yc.id}&tab=lich-hen`} className="mx-5 mt-4 inline-flex text-sm font-semibold text-emerald-800 hover:underline sm:mx-6">Xem tiến trình bàn giao</Link>}
          <div className="space-y-4 p-5 sm:p-6"><div className="grid gap-3 sm:grid-cols-2"><div className="flex items-start gap-3 rounded-xl bg-[#f5f8f6] p-4"><Clock3 size={18} className="mt-0.5 shrink-0 text-emerald-700" /><div><p className="text-xs text-[#718276]">Thời gian gặp</p><p className="mt-1 text-sm font-semibold text-[#315a43]">{hen.thoi_gian_hen_gap ? dinhDangGioHen(hen.thoi_gian_hen_gap) : 'Chưa có thời gian'}</p></div></div><div className="flex items-start gap-3 rounded-xl bg-[#f5f8f6] p-4"><MapPin size={18} className="mt-0.5 shrink-0 text-emerald-700" /><div><p className="text-xs text-[#718276]">Địa điểm</p><p className="mt-1 text-sm font-semibold text-[#315a43]">{hen.dia_diem?.ten_dia_diem || 'Chưa có địa điểm'}</p></div></div></div>{(hen.nguoi_giu_xac_nhan_luc || hen.nguoi_nhan_xac_nhan_luc) && !hoanTat && <div className="space-y-1 text-sm text-[#607568]"><p>Người giữ đồ: {hen.nguoi_giu_xac_nhan_luc ? 'Đã xác nhận giao đồ' : 'Chưa xác nhận'}</p><p>Người nhận đồ: {hen.nguoi_nhan_xac_nhan_luc ? 'Đã xác nhận nhận đồ' : 'Chưa xác nhận'}</p></div>}
            {hen.ly_do_huy && <p className="text-sm text-[#607568]">{hen.ly_do_huy}</p>}
            {hen.dungMaBanGiao && !hoanTat && hen.trang_thai !== 'da_huy' && <div className="space-y-2 border-t border-emerald-100 pt-3 text-sm text-[#526c5b]">
              <p>{hen.laNguoiDeXuat ? 'Đưa mã đã lưu cho người còn lại sau khi giao nhận đồ.' : 'Sau khi giao nhận đồ, nhập mã do người tạo lịch cung cấp.'}</p>
              {!hen.laNguoiDeXuat && <Link to="/cuoc-hen/nhap-ma" className="inline-block font-semibold text-emerald-800 hover:underline">Nhập mã bàn giao</Link>}
            </div>}
          </div>
        </section>}
        {!hen && cacHen[0]?.ly_do_huy && <p className="border-t border-[#edf2ee] p-5 text-sm text-[#607568]">{cacHen[0].ly_do_huy}</p>}

      </> : !tamDung && ['cho_kiem_tra', 'can_bo_sung'].includes(yc.trang_thai) && <p className="border-t border-[#edf2ee] p-5 text-sm leading-6 text-[#607568] sm:p-6">Bạn sẽ xem được thông tin liên hệ sau khi yêu cầu được duyệt.</p>}
      </article>
    </>}
  </div>
}

function ThongTinLienHe({ Icon, nhan, giaTri, href }) {
  if (!giaTri) return null
  return <div className="flex min-w-0 items-start gap-3"><Icon size={17} aria-hidden="true" className="mt-1 shrink-0 text-[#8aa493]" /><div className="min-w-0"><p className="text-xs text-[#718276]">{nhan}</p>{href ? <a href={href} className="mt-1 block break-words text-sm font-medium text-emerald-900 hover:underline">{giaTri}</a> : <p className="mt-1 text-sm text-[#718276]">Chưa cung cấp</p>}</div></div>
}
