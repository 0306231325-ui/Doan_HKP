import { Bell, CheckCheck, ChevronRight, Eye, Settings2, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import LoiMoiThongBao from './LoiMoiThongBao'
import HopThoai from '../shared/HopThoai'
import useThongBao from '../../pages/thong-bao/hooks/useThongBao'

const dinhDangGio = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh',
})

function NoiDungThongBao({ muc }) {
  return <div className="min-w-0 flex-1 break-words">
    <div className="flex items-start gap-2">
      <p className="flex-1 text-sm font-bold text-emerald-950">{muc.tieuDe}</p>
      {!muc.daDoc && <span aria-label="Chưa đọc" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />}
    </div>
    <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-[#526c5b]">{muc.noiDung}</p>
    {muc.taoLuc && <time dateTime={muc.taoLuc} className="mt-2 block text-xs text-[#607568]">{dinhDangGio.format(new Date(muc.taoLuc))}</time>}
  </div>
}

export default function ThongBao() {
  const { moBang, moLoiMoi, quyen, dangXinQuyen, loi, thamChieuKhung, thamChieuChuong, thamChieuBang, maBang, maTieuDe,
    doiMoBang, dongBang, roiKhung, moHopThoaiMoi, dongLoiMoi, batThongBao,
    danhSach, soChuaDoc, dangTai, loiHopThu, danhDauDaDoc,
    mucChoXoa, dangXoa, loiXoa, moXacNhanXoa, dongXacNhanXoa, xacNhanXoa } = useThongBao()
  const daBat = quyen === 'granted'
  const biChan = quyen === 'denied'
  const BieuTuong = daBat ? CheckCheck : biChan ? Settings2 : Eye
  return (
    <div ref={thamChieuKhung} onBlur={roiKhung} className="relative">
      <button ref={thamChieuChuong} type="button" onClick={doiMoBang} aria-label={soChuaDoc ? `Thông báo, ${soChuaDoc} chưa đọc` : 'Thông báo'} aria-haspopup="dialog" aria-expanded={moBang} aria-controls={moBang ? maBang : undefined} className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${moBang ? 'bg-emerald-100 text-emerald-900' : 'text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950'}`}>
        <Bell className="h-5 w-5" aria-hidden="true" />
        {soChuaDoc > 0 && <span aria-hidden="true" className="absolute right-0 top-0 min-w-4 rounded-full bg-emerald-700 px-1 text-[10px] font-bold leading-4 text-white">{soChuaDoc > 99 ? '99+' : soChuaDoc}</span>}
      </button>
      {moBang && <section ref={thamChieuBang} id={maBang} role="dialog" tabIndex={-1} aria-labelledby={maTieuDe} className="fixed left-4 right-4 top-[5.5rem] z-50 max-h-[calc(100dvh_-_7rem)] overflow-y-auto rounded-[1.75rem] border-[3px] border-emerald-950 bg-white p-5 shadow-[6px_8px_0_#064e3b] outline-none sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%_+_1rem)] sm:w-[26rem] sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-[#e1eee5] pb-4"><h2 id={maTieuDe} className="text-lg font-extrabold text-emerald-950">Thông báo</h2><button type="button" onClick={dongBang} aria-label="Đóng bảng thông báo" className="rounded-full p-1.5 text-[#91a79a] hover:bg-emerald-50 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-700"><X className="h-5 w-5" aria-hidden="true" /></button></div>
        {loiHopThu && <p role="alert" className="my-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{loiHopThu}</p>}
        {dangTai && <p role="status" className="py-7 text-center text-sm text-[#607568]">Đang tải thông báo…</p>}
        {!dangTai && !loiHopThu && danhSach.length === 0 && <div className="flex min-h-40 flex-col items-center justify-center gap-3 py-7 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f0f8f3]"><Bell className="h-5 w-5 text-[#9ab6a4]" strokeWidth={1.5} aria-hidden="true" /></span>
          <p className="text-sm font-semibold text-[#607568]">Chưa có thông báo.</p>
        </div>}
        {danhSach.length > 0 && <div className="py-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#607568]">
            <span>Thông báo gần đây</span>
            <button type="button" onClick={() => moXacNhanXoa()} className="rounded font-semibold text-rose-700 hover:underline focus-visible:outline-2">Xóa tất cả</button>
          </div>
          <ul aria-label="Thông báo gần đây" tabIndex={0} className={`max-h-[min(22rem,50dvh)] space-y-2 overscroll-contain rounded-xl pr-2 focus-visible:outline-2 focus-visible:outline-emerald-700 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-emerald-50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-700/55 ${danhSach.length >= 4 ? 'overflow-y-scroll' : 'overflow-y-auto'}`}>
            {danhSach.map((muc) => <li key={muc.id} className={`flex min-h-24 items-start rounded-xl border border-[#e1eee5] ${muc.daDoc ? 'bg-white' : 'bg-emerald-50'}`}>
              {muc.duongDan ? <Link to={muc.duongDan} onClick={() => {
                if (!muc.daDoc) danhDauDaDoc(muc.id)
                dongBang()
              }} className="flex min-w-0 flex-1 items-center gap-2 rounded-xl p-3 hover:bg-emerald-100/60 focus-visible:outline-2 focus-visible:outline-emerald-700">
                <NoiDungThongBao muc={muc} />
                <ChevronRight className="h-4 w-4 shrink-0 text-emerald-800" aria-hidden="true" />
              </Link> : <div className="min-w-0 flex-1 p-3">
                <NoiDungThongBao muc={muc} />
                <button type="button" aria-disabled={muc.daDoc} onClick={() => { if (!muc.daDoc) danhDauDaDoc(muc.id) }} className="mt-2 rounded text-xs font-semibold text-emerald-800 hover:underline focus-visible:outline-2 aria-disabled:text-[#607568] aria-disabled:no-underline">{muc.daDoc ? 'Đã đọc' : 'Đánh dấu đã đọc'}</button>
              </div>}
              <button type="button" onClick={() => moXacNhanXoa(muc)} aria-label={`Xóa thông báo ${muc.tieuDe}`} title="Xóa thông báo" className="m-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#607568] hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-rose-700">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>)}
          </ul>
        </div>}
        <div className="border-t border-[#e1eee5] pt-4"><button type="button" onClick={moHopThoaiMoi} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#edf7f0] px-4 py-3 text-sm font-bold text-[#315a43] hover:bg-[#dfefe5] focus-visible:outline-2 focus-visible:outline-emerald-700"><BieuTuong className="h-4 w-4" aria-hidden="true" />{daBat ? 'Đã cho phép thông báo' : biChan ? 'Hướng dẫn bật thông báo' : 'Mời bật thông báo'}</button></div>
      </section>}
      {mucChoXoa && <HopThoai
        tieuDe={mucChoXoa.id ? 'Xóa thông báo?' : 'Xóa tất cả thông báo?'}
        moTa={mucChoXoa.id ? `Bạn có muốn xóa thông báo “${mucChoXoa.tieuDe}”?` : 'Toàn bộ thông báo trong hộp thư sẽ bị xóa vĩnh viễn.'}
        khiDong={dongXacNhanXoa}
      >
        {loiXoa && <p role="alert" className="mx-5 mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:mx-6">{loiXoa}</p>}
        <div className="flex justify-end gap-3 px-5 py-4 sm:px-6">
          <button type="button" onClick={dongXacNhanXoa} disabled={dangXoa} className="rounded-xl border border-[#ceded3] px-4 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-emerald-50 focus-visible:outline-2 disabled:opacity-50">Hủy</button>
          <button type="button" onClick={xacNhanXoa} disabled={dangXoa} className="rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800 focus-visible:outline-2 disabled:opacity-50">{dangXoa ? 'Đang xóa…' : mucChoXoa.id ? 'Xóa thông báo' : 'Xóa tất cả'}</button>
        </div>
      </HopThoai>}
      {moLoiMoi && <LoiMoiThongBao quyen={quyen} dangXinQuyen={dangXinQuyen} loi={loi} dongLoiMoi={dongLoiMoi} batThongBao={batThongBao} />}
    </div>
  )
}
