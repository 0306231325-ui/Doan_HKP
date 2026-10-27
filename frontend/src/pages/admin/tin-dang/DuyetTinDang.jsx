import { Outlet } from 'react-router-dom'
import useDuyetTinDang from './hooks/useDuyetTinDang'

export default function DuyetTinDang() {
  const duLieu = useDuyetTinDang()
  return <div className="space-y-5">
    <p className="text-xs leading-5 text-[#718276]">Chưa kết nối backend. Tin đăng sẽ xuất hiện tại đây khi có dữ liệu từ hệ thống.</p>
    {duLieu.thongBao && <div role="status" className="flex justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"><span>{duLieu.thongBao}</span><button onClick={duLieu.dongThongBao} aria-label="Đóng thông báo">×</button></div>}
    <Outlet context={duLieu} />
  </div>
}
