import { ArrowLeft, CalendarDays, ChevronRight, ClipboardList, Flag, HandHeart, ImageOff, Images, Info, MapPin, MessageSquare, Phone, Share2, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../../components/shared/Button'
import KhungThongTin from '../../components/shared/KhungThongTin'
import ThongBaoTrong from '../../components/shared/ThongBaoTrong'

export default function ChiTietTinDang() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-6 sm:space-y-8">
      <nav aria-label="Đường dẫn trang" className="flex flex-wrap items-center gap-2 text-xs text-[#718276] sm:text-sm">
        <Link to="/" className="rounded-md hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-700">Trang chủ</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <Link to="/danh-sach-do" className="rounded-md hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-700">Tra cứu</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span aria-current="page" className="font-semibold text-[#315a43]">Chi tiết tin đăng</span>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-emerald-900 sm:text-4xl">Chi tiết tin đăng</h1>
          <p className="mt-3 text-sm leading-6 text-[#607568]">Thông tin đồ vật, hình ảnh và cách liên hệ với người đăng.</p>
        </div>
        <Link to="/danh-sach-do" className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-[#ceded3] bg-white px-4 py-2.5 text-sm font-semibold text-[#315a43] transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Quay lại tra cứu</Link>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
        <div className="min-w-0 space-y-6">
          <KhungThongTin tieuDe="Hình ảnh đồ vật" bieuTuong={Images}>
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#cbded1] bg-[#f5faf7] px-5 text-center sm:aspect-[16/10]">
              <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-[#9bb3a2] shadow-sm"><ImageOff className="h-9 w-9" strokeWidth={1.5} aria-hidden="true" /></span>
              <div><p className="text-sm font-semibold text-[#526c5b]">Chưa có hình ảnh</p><p className="mt-1.5 text-xs leading-5 text-[#718276]">Hình ảnh của tin đăng sẽ hiển thị tại đây.</p></div>
            </div>
          </KhungThongTin>

          <KhungThongTin tieuDe="Thông tin tin đăng" bieuTuong={Info}>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {['Tiêu đề', 'Mã tin', 'Loại tin', 'Trạng thái', 'Danh mục', 'Ngày đăng'].map((nhan) => <div key={nhan} className="border-b border-[#edf2ee] pb-3"><dt className="text-xs font-medium text-[#718276]">{nhan}</dt><dd className="mt-2 text-sm font-semibold text-[#315a43]"><span aria-label="Chưa có thông tin">—</span></dd></div>)}
            </dl>
          </KhungThongTin>

          <KhungThongTin tieuDe="Thông tin đồ vật" bieuTuong={ClipboardList}>
            <ThongBaoTrong bieuTuong={ClipboardList} tieuDe="Chưa có thông tin đồ vật" moTa="Mô tả và các thông tin công khai của đồ vật sẽ hiển thị tại đây." />
          </KhungThongTin>

          <KhungThongTin tieuDe="Thời gian và địa điểm" bieuTuong={MapPin}>
            <dl className="space-y-4">
              {[{ nhan: 'Thời gian ghi nhận', bieuTuong: CalendarDays }, { nhan: 'Khu vực', bieuTuong: MapPin }, { nhan: 'Vị trí chi tiết', bieuTuong: Info }].map(({ nhan, bieuTuong: BieuTuong }) => <div key={nhan} className="flex gap-3 rounded-2xl bg-[#f7faf8] p-4"><BieuTuong className="mt-0.5 h-4 w-4 shrink-0 text-[#8ba594]" aria-hidden="true" /><div><dt className="text-xs font-medium text-[#718276]">{nhan}</dt><dd className="mt-1.5 text-sm text-[#315a43]"><span aria-label="Chưa có thông tin">—</span></dd></div></div>)}
            </dl>
          </KhungThongTin>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28">
          <KhungThongTin tieuDe="Người đăng & liên hệ" bieuTuong={UserRound}>
            <div className="flex items-center gap-3 border-b border-[#e4ece7] pb-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#edf5ef] text-[#9bb3a2]"><UserRound className="h-6 w-6" aria-hidden="true" /></span>
              <p className="text-sm font-medium leading-6 text-[#718276]">Chưa có thông tin người đăng</p>
            </div>
            <dl className="mt-5 space-y-4">
              {['Người đăng', 'Số điện thoại', 'Email'].map((nhan) => <div key={nhan} className="flex items-center justify-between gap-3 text-sm"><dt className="text-[#718276]">{nhan}</dt><dd className="font-medium text-[#315a43]"><span aria-label="Chưa có thông tin">—</span></dd></div>)}
            </dl>
            <Button disabled title="Chưa có thông tin liên hệ" className="mt-5 inline-flex w-full items-center justify-center gap-2"><Phone className="h-4 w-4" aria-hidden="true" />Liên hệ người đăng</Button>
          </KhungThongTin>

          <KhungThongTin tieuDe="Thao tác với tin đăng" bieuTuong={HandHeart}>
            <div className="space-y-3">
              <Button disabled title="Chưa có dữ liệu tin đăng" className="inline-flex w-full items-center justify-center gap-2"><HandHeart className="h-4 w-4" aria-hidden="true" />Yêu cầu nhận lại đồ</Button>
              {[{ nhan: 'Tôi đang giữ đồ này', bieuTuong: MessageSquare }, { nhan: 'Chia sẻ tin', bieuTuong: Share2 }, { nhan: 'Báo cáo tin đăng', bieuTuong: Flag }].map(({ nhan, bieuTuong: BieuTuong }) => <button key={nhan} type="button" disabled title="Chưa có dữ liệu tin đăng" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#ceded3] bg-white px-4 py-3 text-sm font-semibold text-[#526c5b] disabled:cursor-not-allowed disabled:opacity-50"><BieuTuong className="h-4 w-4" aria-hidden="true" />{nhan}</button>)}
            </div>
          </KhungThongTin>
        </aside>
      </div>
    </div>
  )
}
