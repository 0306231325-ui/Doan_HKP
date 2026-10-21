import { ArrowLeft, Camera, ClipboardCheck, MapPin } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import FormDangTin from '../../components/tin-dang/FormDangTin'

export default function DangTin() {
  const [thamSo] = useSearchParams()
  const loaiTin = thamSo.get('loaiTin') === 'found' ? 'found' : 'lost'

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-6 sm:space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-[#607568] hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-700"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Về trang chủ</Link>
      <header><h1 className="text-3xl font-extrabold tracking-tight text-emerald-900 sm:text-4xl">Đăng tin đồ thất lạc</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-[#607568] sm:text-base">Bạn bị mất đồ hay vừa nhặt được một món đồ? Chia sẻ thông tin để mọi người dễ tìm kiếm và kết nối với nhau.</p></header>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-8">
        <FormDangTin key={loaiTin} loaiBanDau={loaiTin} />
        <aside className="space-y-5 lg:sticky lg:top-28">
          <div className="rounded-3xl border border-[#d6e4db] bg-white p-6"><h2 className="text-lg font-bold text-[#243c30]">Để dễ tìm đúng đồ</h2><ul className="mt-5 space-y-5 text-sm leading-6 text-[#607568]">{[{ nhan: 'Mô tả rõ đặc điểm', moTa: 'Tên đồ vật, màu sắc và những chi tiết dễ nhận biết.', bieuTuong: ClipboardCheck }, { nhan: 'Ghi đúng nơi và ngày', moTa: 'Thêm vị trí cụ thể để mọi người dễ đối chiếu.', bieuTuong: MapPin }, { nhan: 'Thêm ảnh rõ nét', moTa: 'Ảnh thật giúp nhận biết món đồ nhanh hơn.', bieuTuong: Camera }].map(({ nhan, moTa, bieuTuong: BieuTuong }) => <li key={nhan} className="flex gap-3"><BieuTuong className="mt-1 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" /><div><p className="font-semibold text-[#315a43]">{nhan}</p><p className="mt-1">{moTa}</p></div></li>)}</ul></div>
          <p className="px-2 text-xs leading-6 text-[#718276]">Bạn có thể xem trước nội dung trước khi gửi tin.</p>
        </aside>
      </div>
    </div>
  )
}
