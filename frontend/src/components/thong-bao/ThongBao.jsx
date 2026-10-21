import { Bell, CheckCheck, Eye, Settings2, Sparkles, X } from 'lucide-react'
import LoiMoiThongBao from './LoiMoiThongBao'
import useThongBao from '../../pages/thong-bao/hooks/useThongBao'

export default function ThongBao() {
  const { moBang, moLoiMoi, quyen, dangXinQuyen, loi, thamChieuKhung, thamChieuChuong, thamChieuBang, maBang, maTieuDe,
    doiMoBang, dongBang, roiKhung, moHopThoaiMoi, dongLoiMoi, batThongBao } = useThongBao()
  const daBat = quyen === 'granted'
  const biChan = quyen === 'denied'
  const BieuTuong = daBat ? CheckCheck : biChan ? Settings2 : Eye
  return (
    <div ref={thamChieuKhung} onBlur={roiKhung} className="relative">
      <button ref={thamChieuChuong} type="button" onClick={doiMoBang} aria-label="Thông báo" aria-haspopup="dialog" aria-expanded={moBang} aria-controls={moBang ? maBang : undefined} className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${moBang ? 'bg-emerald-100 text-emerald-900' : 'text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950'}`}><Bell className="h-5 w-5" aria-hidden="true" /></button>
      {moBang && <section ref={thamChieuBang} id={maBang} role="dialog" tabIndex={-1} aria-labelledby={maTieuDe} className="fixed left-4 right-4 top-[5.5rem] z-50 max-h-[calc(100dvh_-_7rem)] overflow-y-auto rounded-[1.75rem] border-[3px] border-emerald-950 bg-white p-5 shadow-[6px_8px_0_#064e3b] outline-none sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%_+_1rem)] sm:w-[26rem] sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-[#e1eee5] pb-4"><h2 id={maTieuDe} className="flex items-center gap-2 text-lg font-extrabold text-emerald-950"><Sparkles className="h-5 w-5 text-emerald-600" aria-hidden="true" />Thông báo</h2><button type="button" onClick={dongBang} aria-label="Đóng bảng thông báo" className="rounded-full p-1.5 text-[#91a79a] hover:bg-emerald-50 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-700"><X className="h-5 w-5" aria-hidden="true" /></button></div>
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 py-7 text-center"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f0f8f3]"><Bell className="h-5 w-5 text-[#9ab6a4]" strokeWidth={1.5} aria-hidden="true" /></span><p className="text-sm font-semibold text-[#91a79a]">Chưa có thông báo mới.</p></div>
        <div className="border-t border-[#e1eee5] pt-4"><button type="button" onClick={moHopThoaiMoi} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#edf7f0] px-4 py-3 text-sm font-bold text-[#315a43] hover:bg-[#dfefe5] focus-visible:outline-2 focus-visible:outline-emerald-700"><BieuTuong className="h-4 w-4" aria-hidden="true" />{daBat ? 'Đã cho phép thông báo' : biChan ? 'Hướng dẫn bật thông báo' : 'Mời bật thông báo'}</button></div>
      </section>}
      {moLoiMoi && <LoiMoiThongBao quyen={quyen} dangXinQuyen={dangXinQuyen} loi={loi} dongLoiMoi={dongLoiMoi} batThongBao={batThongBao} />}
    </div>
  )
}
