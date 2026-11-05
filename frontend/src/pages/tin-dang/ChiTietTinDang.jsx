import { ArrowLeft, CalendarDays, ChevronRight, ClipboardList, Flag, HandHeart, ImageOff, Images, Info, MapPin, MessageSquare, Share2, UserRound, ZoomIn } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/shared/Button'
import HopThoai from '../../components/shared/HopThoai'
import KhungThongTin from '../../components/shared/KhungThongTin'
import ThongBaoTrong from '../../components/shared/ThongBaoTrong'
import useChiTietTinDang from './hooks/useChiTietTinDang'
import { dinhDangNgay } from '../danh-sach-do/hooks/xuLyDanhSachDo'

export default function ChiTietTinDang() {
  const { tin, dangTai, loi, taiLai, quayLai } = useChiTietTinDang()
  const [anhDangXem, datAnhDangXem] = useState(null)
  const anh = tin?.images?.length ? tin.images : [tin?.imageUrl].filter((url) => url && url !== '/do-vat-trong.svg')
  const cotAnh = anh.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : anh.length === 2 ? 'sm:grid-cols-2' : ''
  const thoiGian = tin ? [dinhDangNgay(tin.date), tin.gioXayRa].filter(Boolean).join(' · ') : ''
  const lopTieuDeMuc = 'mb-4 flex items-center gap-2.5 text-base font-bold text-[#243c30]'

  function dungAnhThayThe(suKien) {
    const img = suKien.currentTarget
    if (img.getAttribute('src') !== '/do-vat-trong.svg') img.src = '/do-vat-trong.svg'
  }

  function dongAnh() {
    datAnhDangXem(null)
  }

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
        <Link to={quayLai} className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-[#ceded3] bg-white px-4 py-2.5 text-sm font-semibold text-[#315a43] transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Quay lại danh sách</Link>
      </header>

      {dangTai ? <p role="status" className="rounded-3xl bg-white p-10 text-center text-[#607568]">Đang tải tin đăng…</p> : loi ? <div role="alert" className="space-y-4 rounded-3xl bg-white p-10 text-center"><p>{loi}</p><Button onClick={taiLai}>Thử lại</Button></div> : !tin ? <ThongBaoTrong bieuTuong={Info} tieuDe="Không tìm thấy tin đăng" moTa="Tin đăng không tồn tại hoặc không còn được hiển thị. Bạn có thể quay lại danh sách để tìm tin khác." /> : <KhungThongTin tieuDe="Thông tin tin đăng" anTieuDe>
        <div className="divide-y divide-[#e4ece7]">
          <section className="pb-6">
            <h2 className={lopTieuDeMuc}><Images className="h-5 w-5 text-emerald-700" aria-hidden="true" />Hình ảnh đồ vật</h2>
            {anh.length ? (
              <div className={`grid gap-3 ${cotAnh}`}>
                {anh.map((url, i) => (
                  <button key={url} type="button" aria-label={`Phóng to ảnh ${i + 1}`} aria-haspopup="dialog" onClick={() => datAnhDangXem({ url, viTri: i + 1, tinId: tin.id })} className="relative cursor-zoom-in overflow-hidden rounded-2xl bg-[#f5faf7] hover:ring-2 hover:ring-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                    <img src={url} alt={`${tin.title} · Ảnh ${i + 1}`} className="aspect-[4/3] max-h-96 w-full object-contain" onError={dungAnhThayThe} />
                    <span className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-emerald-900 shadow-sm"><ZoomIn className="h-4 w-4" aria-hidden="true" /></span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex min-h-40 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#cbded1] bg-[#f5faf7] px-5 text-center">
                <ImageOff className="h-9 w-9 text-[#9bb3a2]" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-sm font-semibold text-[#526c5b]">Chưa có hình ảnh</p>
              </div>
            )}
          </section>
          <section aria-label="Thông tin cơ bản" className="py-6">
            <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-[2fr_1fr_1fr]">
              {[['Tiêu đề', tin.title], ['Loại tin', tin.typeName], ['Danh mục', tin.category]].map(([nhan, giaTri]) => (
                <div key={nhan} className="min-w-0">
                  <dt className="text-xs font-medium text-[#718276]">{nhan}</dt>
                  <dd className="mt-2 break-words text-sm font-semibold text-[#315a43]">{giaTri || 'Chưa có thông tin'}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="py-6">
            <h2 className={lopTieuDeMuc}><ClipboardList className="h-5 w-5 text-emerald-700" aria-hidden="true" />Thông tin đồ vật</h2>
            <p className="whitespace-pre-line text-sm leading-7 text-[#607568]">{tin.description || 'Chưa có mô tả đồ vật.'}</p>
          </section>

          <section className="py-6">
            <h2 className={lopTieuDeMuc}><MapPin className="h-5 w-5 text-emerald-700" aria-hidden="true" />Thời gian và địa điểm</h2>
            <dl className="grid gap-3 sm:grid-cols-3">
              {[{ nhan: 'Thời gian ghi nhận', bieuTuong: CalendarDays, giaTri: thoiGian }, { nhan: 'Khu vực', bieuTuong: MapPin, giaTri: tin.location }, { nhan: 'Vị trí chi tiết', bieuTuong: Info, giaTri: tin.locationDetail }].map(({ nhan, bieuTuong: BieuTuong, giaTri }) => <div key={nhan} className="flex gap-3 rounded-2xl bg-[#f7faf8] p-4"><BieuTuong className="mt-0.5 h-4 w-4 shrink-0 text-[#8ba594]" aria-hidden="true" /><div><dt className="text-xs font-medium text-[#718276]">{nhan}</dt><dd className="mt-1.5 text-sm text-[#315a43]">{giaTri || 'Chưa có thông tin'}</dd></div></div>)}
            </dl>
          </section>
          <section className="py-6">
            <h2 className={lopTieuDeMuc}><UserRound className="h-5 w-5 text-emerald-700" aria-hidden="true" />Người đăng &amp; liên hệ</h2>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#edf5ef] text-[#9bb3a2]"><UserRound className="h-6 w-6" aria-hidden="true" /></span>
              <p className="text-sm font-medium leading-6 text-[#718276]">{tin.contactPerson}</p>
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {[['Số điện thoại', tin.contactPhone], ['Email / Gmail', tin.contactEmail]].map(([nhan, giaTri]) => <div key={nhan} className="space-y-1 text-sm"><dt className="text-[#718276]">{nhan}</dt><dd className="break-words font-medium text-[#315a43]">{giaTri || 'Không cung cấp'}</dd></div>)}
            </dl>
            {tin.contactError ? <p role="alert" className="mt-4 text-sm text-rose-700">{tin.contactError} <button type="button" onClick={taiLai} className="underline">Thử lại</button></p> : !tin.contactUnlocked && <p className="mt-4 text-xs leading-5 text-[#718276]">{tin.type === 'found' ? 'Gửi yêu cầu nhận đồ để xem liên hệ đầy đủ.' : 'Tin đăng hiển thị một phần thông tin liên hệ.'}</p>}
          </section>
        </div>

        <section className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-5 sm:px-5">
          <h2 className={lopTieuDeMuc}><HandHeart className="h-5 w-5 text-emerald-700" aria-hidden="true" />Thao tác với tin đăng</h2>
          <div className="flex flex-wrap gap-3">
            {tin.canClaim && <Link to={`/yeu-cau-nhan-do?id=${tin.id}`} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-900 px-4 py-3 text-center text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"><HandHeart className="h-4 w-4" aria-hidden="true" />{tin.hasClaim ? 'Xem yêu cầu đã gửi' : 'Yêu cầu nhận lại đồ'}</Link>}
            {[{ nhan: 'Tôi đang giữ đồ này', bieuTuong: MessageSquare }, { nhan: 'Chia sẻ tin', bieuTuong: Share2 }, { nhan: 'Báo cáo tin đăng', bieuTuong: Flag }].map(({ nhan, bieuTuong: BieuTuong }) => <button key={nhan} type="button" disabled title="Chức năng này chưa được kết nối" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#ceded3] bg-white px-4 py-3 text-sm font-semibold text-[#526c5b] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"><BieuTuong className="h-4 w-4" aria-hidden="true" />{nhan}</button>)}
          </div>
        </section>
      </KhungThongTin>}
      {anhDangXem && anhDangXem.tinId === tin?.id && (
        <HopThoai rong tieuDe={`Ảnh ${anhDangXem.viTri} / ${anh.length}`} khiDong={dongAnh}>
          <img src={anhDangXem.url} alt={`${tin.title} · Ảnh ${anhDangXem.viTri}`} className="max-h-[70dvh] w-full bg-[#f5faf7] object-contain" onError={dungAnhThayThe} />
        </HopThoai>
      )}
    </div>
  )
}
