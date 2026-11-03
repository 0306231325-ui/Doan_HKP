import { Outlet } from 'react-router-dom'
import { CheckCircle2, X } from 'lucide-react'
import useDuyetTinDang from './hooks/useDuyetTinDang'

export default function DuyetTinDang() {
  const duLieu = useDuyetTinDang()
  return <div className="space-y-5">
    {duLieu.loi && <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{duLieu.loi}<button className="ml-4 underline" onClick={duLieu.taiLai}>Tải lại</button></div>}
    {duLieu.thongBao && <div role="status" aria-atomic="true" className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-4 text-sm text-emerald-900 shadow-xl sm:right-6 sm:top-6"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" /><span className="flex-1 leading-6">{duLieu.thongBao}</span><button onClick={duLieu.dongThongBao} aria-label="Đóng thông báo" className="rounded-lg p-1 text-emerald-700 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700"><X className="h-4 w-4" aria-hidden="true" /></button></div>}
    {duLieu.dangTai ? <p role="status" className="p-6 text-sm">Đang tải tin đăng…</p> : <Outlet context={duLieu} />}
  </div>
}
