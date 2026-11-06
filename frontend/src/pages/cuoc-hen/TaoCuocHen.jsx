import { useState } from 'react'
import { CalendarDays, HandHeart } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/shared/Button'
import HopThoai from '../../components/shared/HopThoai'
import FormCuocHen from './FormCuocHen'

const cacDiaDiem = []

export default function TaoCuocHen() {
  const [moForm, datMoForm] = useState(false)
  const [xemLai, datXemLai] = useState(false)
  const [banNhap, datBanNhap] = useState(null)

  function dongForm() {
    datMoForm(false)
    datXemLai(false)
  }

  return <div className="mx-auto max-w-3xl space-y-6 pb-6">
    <Link to="/yeu-cau-nhan-do" className="rounded-lg text-sm font-semibold text-[#526c5b] hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-700">← Yêu cầu nhận đồ</Link>
    <header>
      <h1 className="text-3xl font-extrabold tracking-tight text-emerald-900">Chi tiết yêu cầu nhận đồ</h1>
      <p className="mt-3 text-sm leading-6 text-[#607568]">Theo dõi yêu cầu và thống nhất lịch gặp với người giữ đồ.</p>
    </header>

    <section aria-labelledby="thong-tin-yeu-cau" className="overflow-hidden rounded-3xl border border-[#d6e4db] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e1eae4] px-5 py-5 sm:px-7">
        <h2 id="thong-tin-yeu-cau" className="flex items-center gap-2 text-lg font-bold text-[#243c30]"><HandHeart className="h-5 w-5 text-emerald-800" aria-hidden="true" />Yêu cầu nhận lại đồ</h2>
      </div>
      <p className="p-5 text-sm leading-6 text-[#718276] sm:p-7">Chưa có thông tin yêu cầu nhận đồ.</p>
    </section>

    <section aria-labelledby="cuoc-hen-nhan-do" className="rounded-3xl border border-[#d6e4db] bg-white p-5 sm:p-7">
      <h2 id="cuoc-hen-nhan-do" className="flex items-center gap-2 text-lg font-bold text-[#243c30]"><CalendarDays className="h-5 w-5 text-emerald-800" aria-hidden="true" />Cuộc hẹn nhận đồ</h2>
      <p className="mt-3 text-sm leading-6 text-[#607568]">Chưa có cuộc hẹn.</p>
      <Button onClick={() => datMoForm(true)} className="mt-5 inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" aria-hidden="true" />Đề xuất cuộc hẹn</Button>
    </section>

    {moForm && <HopThoai tieuDe={xemLai ? 'Xem lại cuộc hẹn' : 'Đề xuất cuộc hẹn'} khiDong={dongForm}>
      {xemLai ? <div className="space-y-5 p-5 sm:p-7">
        <dl className="grid gap-4 text-sm text-[#315a43] sm:grid-cols-2">
          {[['Ngày gặp', banNhap.ngay.split('-').reverse().join('/')], ['Giờ gặp', banNhap.gio], ['Địa điểm gặp', banNhap.diaDiem.ten]].map(([nhan, giaTri]) => <div key={nhan}><dt className="text-xs text-[#718276]">{nhan}</dt><dd className="mt-1 font-semibold">{giaTri}</dd></div>)}
        </dl>
        <p className="text-xs leading-5 text-[#718276]">Thông tin xem trước, đề xuất chưa được gửi.</p>
        <div className="flex flex-wrap justify-end gap-3"><button type="button" onClick={() => datXemLai(false)} className="rounded-xl border border-[#ceded3] px-4 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-emerald-50">Chỉnh sửa</button><Button onClick={dongForm}>Đóng bản xem trước</Button></div>
      </div> : <FormCuocHen cacDiaDiem={cacDiaDiem} giaTriBanDau={banNhap} khiXemLai={(duLieu) => { datBanNhap(duLieu); datXemLai(true) }} khiHuy={dongForm} />}
    </HopThoai>}
  </div>
}
