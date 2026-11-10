import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarDays, Clock3, MapPin, Phone, RefreshCw } from 'lucide-react'
import api from '../../services/api'
import dinhDangGioHen from './dinhDangGioHen'

const card = 'space-y-4 rounded-2xl border border-[#d6e4db] bg-white p-5 sm:p-6'
const trangThai = { cho_kiem_tra: 'Chờ kiểm tra', can_bo_sung: 'Cần bổ sung', da_xac_minh: 'Đã duyệt', tu_choi: 'Từ chối', da_huy: 'Đã hủy' }

export default function TaoCuocHen() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const [nguon, datNguon] = useState(null)
  const [loiTai, datLoiTai] = useState('')
  const [lanTai, datLanTai] = useState(0)

  useEffect(() => {
    if (!id) return
    const abort = new AbortController()
    async function tai() {
      try {
        const { data } = await api.get(`/me/yeu-cau/${id}`, { signal: abort.signal })
        if (abort.signal.aborted) return
        datNguon({ id, data: data.data })
        datLoiTai('')
      } catch (loi) {
        if (!abort.signal.aborted) datLoiTai(loi.response?.status === 404 ? 'Không tìm thấy yêu cầu của bạn.' : 'Không tải được yêu cầu. Vui lòng thử lại.')
      }
    }
    tai()
    const timer = window.setInterval(tai, 15000)
    window.addEventListener('focus', tai)
    return () => { abort.abort(); window.clearInterval(timer); window.removeEventListener('focus', tai) }
  }, [id, lanTai])

  const yc = nguon?.id === id ? nguon.data : null
  const hen = yc?.cuoc_hen.find((lich) => ['cho_xac_nhan', 'da_xac_nhan', 'da_hoan_tat'].includes(lich.trang_thai))
  const lichCu = yc?.cuoc_hen[0]
  const hoanTat = hen?.trang_thai === 'da_hoan_tat'
  const lienHe = yc?.lienHe

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-6">
      <Link to="/theo-doi-yeu-cau" className="text-sm font-semibold text-emerald-800">← Theo dõi yêu cầu</Link>
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-emerald-950 sm:text-3xl">Cuộc hẹn nhận lại đồ</h1>
          <p className="mt-2 text-sm leading-6 text-[#607568]">Xem lịch gặp và trạng thái bàn giao của yêu cầu.</p>
        </div>
        <button type="button" aria-label="Tải lại yêu cầu" onClick={() => datLanTai((cu) => cu + 1)} className="rounded-xl border border-[#d6e4db] bg-white p-3">
          <RefreshCw size={17} aria-hidden="true" />
        </button>
      </header>

      {loiTai && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{loiTai}</p>}
      {!id && <p className={card}>Chọn một yêu cầu từ trang Theo dõi yêu cầu để xem chi tiết.</p>}
      {id && !yc && !loiTai && <p role="status">Đang tải yêu cầu…</p>}
      {yc && <>
        <section className={card}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[#607568]">Yêu cầu #{yc.id} · {yc.laNguoiGiu ? 'Bạn là người giữ đồ' : 'Bạn là người nhận đồ'}</p>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">{hoanTat ? 'Đã trả đồ' : trangThai[yc.trang_thai]}</span>
          </div>
          <Link to={`/chi-tiet-tin-dang?id=${yc.tin_dang_id}`} className="block text-lg font-bold text-emerald-950 hover:underline">{yc.tin_dang?.tieu_de || 'Tin không còn hiển thị'}</Link>
          {yc.ghi_chu_admin && yc.trang_thai !== 'da_xac_minh' && <p className="whitespace-pre-wrap rounded-xl bg-amber-50 p-4 text-sm">{yc.ghi_chu_admin}</p>}
        </section>

        {lienHe ? <>
          <section className={card}>
            <h2 className="flex items-center gap-2 font-bold text-[#315a43]"><Phone size={18} aria-hidden="true" />Liên hệ {yc.laNguoiGiu ? 'người nhận' : 'người giữ đồ'}</h2>
            <dl className="grid gap-4 text-sm sm:grid-cols-3">
              {[['Họ tên', lienHe.hoTen], ['Điện thoại', lienHe.soDienThoai], ['Email', lienHe.email]].map(([nhan, giaTri]) => (
                <div key={nhan}><dt className="mb-1 text-xs text-[#607568]">{nhan}</dt><dd className="break-words font-medium text-[#315a43]">{giaTri || 'Chưa cung cấp'}</dd></div>
              ))}
            </dl>
          </section>
          <section className={card}>
            <h2 className="flex items-center gap-2 font-bold text-[#315a43]"><CalendarDays size={18} aria-hidden="true" />Lịch gặp tại trường</h2>
            {hen ? <div className="space-y-3 rounded-xl bg-emerald-50 p-4 text-sm">
              <p className="flex items-center gap-2 font-semibold text-emerald-950"><Clock3 size={16} aria-hidden="true" />{dinhDangGioHen(hen.thoi_gian_hen_gap)}</p>
              <p className="flex items-center gap-2 text-[#607568]"><MapPin size={16} aria-hidden="true" />{hen.dia_diem?.ten_dia_diem}</p>
              {hoanTat ? <p className="border-t border-emerald-100 pt-3 font-semibold text-emerald-900">Hai bên đã xác nhận bàn giao thành công.</p>
                : hen.dungMaBanGiao ? <p className="border-t border-emerald-100 pt-3 text-[#526c5b]">{hen.laNguoiDeXuat ? 'Đã đặt lịch. Đưa mã đã lưu cho người còn lại sau khi giao nhận đồ.' : 'Đã đặt lịch. Sau khi giao nhận đồ, nhập mã do người tạo lịch cung cấp.'}</p>
                : <p className="border-t border-emerald-100 pt-3 text-[#526c5b]">{hen.trang_thai === 'da_xac_nhan' ? 'Lịch đã được xác nhận.' : 'Lịch đang chờ xác nhận.'}</p>}
            </div> : <p className="text-sm leading-6 text-[#526c5b]">{lichCu?.ly_do_huy || 'Chưa có lịch hẹn đang hiệu lực.'}</p>}
            {yc.coTheDatLich && <Link to={`/cuoc-hen/tao?yeuCauId=${yc.id}`} className="inline-block text-sm font-semibold text-emerald-800 hover:underline">Tạo cuộc hẹn</Link>}
            {hen?.dungMaBanGiao && !hoanTat && !hen.laNguoiDeXuat && <Link to="/cuoc-hen/nhap-ma" className="inline-block text-sm font-semibold text-emerald-800 hover:underline">Nhập mã bàn giao</Link>}
          </section>
        </> : <p className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">Liên hệ và cuộc hẹn chỉ mở sau khi admin duyệt. Bạn có thể theo dõi kết quả hoặc gửi bổ sung ở trang Theo dõi yêu cầu.</p>}
      </>}
    </div>
  )
}
