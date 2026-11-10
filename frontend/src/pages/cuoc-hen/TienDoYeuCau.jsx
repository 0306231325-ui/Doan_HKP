import { Check, PauseCircle } from 'lucide-react'
import { layTienDo } from './xuLyTienDoYeuCau.js'

const cacBuoc = ['Gửi yêu cầu', 'Được duyệt', 'Có lịch hẹn', 'Hoàn tất']

export default function TienDoYeuCau({ yc }) {
  const { soBuocXong, dungLai, thongBao, tuChoi } = layTienDo(yc)
  return <section aria-label="Tiến độ nhận đồ" className="border-t border-[#edf2ee] px-4 py-5 sm:px-6">
    <ol className="grid grid-cols-4 gap-1 sm:gap-3">
      {cacBuoc.map((ten, i) => {
        const daXong = i < soBuocXong
        const hienTai = i === soBuocXong && !dungLai
        return <li key={ten} aria-current={hienTai ? 'step' : undefined} className="relative flex min-w-0 flex-col items-center text-center">
          {i < 3 && <span aria-hidden="true" className={`absolute left-[calc(50%_+_18px)] right-[calc(-50%_+_14px)] top-4 h-0.5 sm:left-[calc(50%_+_22px)] sm:right-[calc(-50%_+_10px)] ${i + 1 < soBuocXong ? 'bg-emerald-700' : 'bg-[#e1eae4]'}`} />}
          <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${daXong ? 'bg-emerald-800 text-white' : hienTai ? 'border-2 border-emerald-700 bg-white text-emerald-800 ring-4 ring-emerald-50' : 'border border-[#d6e4db] bg-[#f5f8f6] text-[#91a497]'}`}>{daXong ? <Check size={16} aria-hidden="true" /> : i + 1}</span>
          <span className={`mt-3 text-[11px] leading-5 sm:text-sm ${daXong || hienTai ? 'font-semibold text-[#315a43]' : 'text-[#91a497]'}`}>{ten}</span>
          <span className="sr-only">{daXong ? 'Đã hoàn thành' : hienTai ? 'Bước tiếp theo' : 'Chưa hoàn thành'}</span>
        </li>
      })}
    </ol>
    {thongBao && <div role="status" className={`mt-5 flex items-start gap-2 rounded-xl p-3 text-sm leading-6 ${tuChoi ? 'bg-rose-50 text-rose-800' : 'bg-amber-50 text-amber-900'}`}><PauseCircle size={17} className="mt-1 shrink-0" aria-hidden="true" /><div><p>{thongBao}</p>{tuChoi && yc.ghi_chu_admin && <p className="mt-1 whitespace-pre-wrap">Lý do: {yc.ghi_chu_admin}</p>}</div></div>}
  </section>
}
