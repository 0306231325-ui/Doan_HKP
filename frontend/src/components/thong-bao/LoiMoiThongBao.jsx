import { ArrowRight, Bell, BellOff, Check, LoaderCircle, ShieldCheck, Sparkles } from 'lucide-react'
import HopThoai from '../shared/HopThoai'

export default function LoiMoiThongBao({ quyen, dangXinQuyen, loi, dongLoiMoi, batThongBao }) {
  const daBat = quyen === 'granted'
  const biChan = quyen === 'denied'
  const khongHoTro = quyen === 'khong_ho_tro'
  const BieuTuong = daBat ? Check : biChan ? BellOff : Bell
  return (
    <HopThoai tieuDe={daBat ? 'Đã cho phép thông báo' : 'Bật thông báo từ Lạc Ơi'} khiDong={dongLoiMoi} noiBat>
      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.4rem] border-2 border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[inset_0_2px_5px_rgba(6,78,59,0.05)]"><BieuTuong className="h-9 w-9" strokeWidth={1.8} aria-hidden="true" /></div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800"><Sparkles className="h-4 w-4" aria-hidden="true" />Cập nhật từ Lạc Ơi</span>
        <h3 className="mt-4 text-2xl font-extrabold leading-snug tracking-tight text-emerald-950 sm:text-3xl">{daBat ? 'Bạn đã cho phép thông báo!' : biChan ? 'Cho phép thông báo trong trình duyệt' : khongHoTro ? 'Xem thông báo ngay tại Lạc Ơi' : 'Bật thông báo để không bỏ lỡ cập nhật!'}</h3>
        <p role={daBat ? 'status' : undefined} className="mt-4 text-sm leading-7 text-[#526c5b] sm:text-base">{daBat ? 'Trình duyệt này đã cho phép Lạc Ơi hiển thị thông báo. Bạn có thể quản lý quyền này trong cài đặt trang web.' : biChan ? 'Thông báo đang bị chặn. Mở phần cài đặt hoặc biểu tượng bên cạnh địa chỉ trang web, chọn Thông báo → Cho phép, rồi quay lại đây.' : khongHoTro ? 'Trình duyệt hoặc thiết bị này chưa hỗ trợ thông báo hệ thống. Bạn vẫn có thể mở chuông để xem thông báo trong ứng dụng.' : 'Theo dõi kết quả duyệt tin, yêu cầu nhận lại đồ và lịch hẹn trao trả. Cho phép thông báo để tiện theo dõi các cập nhật liên quan đến bạn.'}</p>
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-[#edf7f0] px-4 py-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" /><p className="text-sm font-semibold leading-6 text-[#315a43]">Bạn chủ động chọn cho phép và có thể tắt thông báo trong cài đặt trình duyệt bất cứ lúc nào.</p></div>
        {loi && <p role="alert" className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-800">{loi}</p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          {daBat || biChan || khongHoTro ? <button type="button" onClick={dongLoiMoi} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-[4px_5px_0_#064e3b] hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">{daBat ? 'Đã hiểu' : 'Đóng'}<Check className="h-4 w-4" aria-hidden="true" /></button>
            : <><button type="button" onClick={batThongBao} disabled={dangXinQuyen} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-[4px_5px_0_#064e3b] hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-60">{dangXinQuyen ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Bell className="h-4 w-4" aria-hidden="true" />}{dangXinQuyen ? 'Đang chờ cho phép…' : 'Bật thông báo ngay'}{!dangXinQuyen && <ArrowRight className="h-4 w-4" aria-hidden="true" />}</button><button type="button" onClick={dongLoiMoi} className="rounded-xl px-4 py-3 text-sm font-bold text-[#718276] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700">Để sau</button></>}
        </div>
      </div>
    </HopThoai>
  )
}
