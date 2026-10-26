import { ArrowDown, ArrowRight, Heart, HeartHandshake, MessageCircle, Search, ShieldCheck, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import KhungThongTin from '../../components/shared/KhungThongTin'
import TrinhChieuAnh from '../../components/shared/TrinhChieuAnh'
import CauHoiGioiThieu from './CauHoiGioiThieu'

const CAC_ANH_GIOI_THIEU = [
  { src: '/gioithieu/GTHIEU01.jpg', alt: 'Minh họa trao trả đồ nhặt được và ghi nhận hành động tử tế' },
  { src: '/gioithieu/GIOITHIEU02.jpg', alt: 'Minh họa việc hoàn trả tài sản' },
  { src: '/gioithieu/GIOITHIEU03.jpg', alt: 'Minh họa tiếp nhận và kiểm tra đồ vật' },
]

const CAC_GIA_TRI = [
  { tieuDe: 'Kết nối trong trường', bieuTuong: UsersRound, noiDung: 'Một nơi tập trung thông tin đồ thất lạc, giúp người mất và người nhặt dễ tìm thấy nhau hơn.' },
  { tieuDe: 'Tử tế từ điều nhỏ', bieuTuong: HeartHandshake, noiDung: 'Một tin đăng, một lời nhắn hay một lần trao trả đều góp phần xây dựng cộng đồng biết quan tâm.' },
  { tieuDe: 'Chia sẻ có trách nhiệm', bieuTuong: ShieldCheck, noiDung: 'Cung cấp thông tin rõ ràng, tôn trọng quyền riêng tư và đối chiếu cẩn thận trước khi nhận lại đồ.' },
]

const CAC_BUOC = [
  { tieuDe: 'Đăng tin hoặc tìm kiếm', bieuTuong: Search, noiDung: 'Mô tả món đồ bạn bị mất, đăng tin nhặt được hoặc tra cứu những thông tin có liên quan.' },
  { tieuDe: 'Kết nối và đối chiếu', bieuTuong: MessageCircle, noiDung: 'Trao đổi đặc điểm nhận biết và thông tin liên quan để xác định đúng đồ vật, đúng người nhận.' },
  { tieuDe: 'Hẹn gặp và trao trả', bieuTuong: HeartHandshake, noiDung: 'Thống nhất một địa điểm phù hợp trong trường và cùng đưa món đồ về với chủ nhân.' },
]

export default function GioiThieu() {
  return (
    <div className="space-y-12 sm:space-y-16">
      <section aria-labelledby="tieu-de-gioi-thieu" className="relative isolate overflow-hidden rounded-[2rem] border border-[#d1e5d8] bg-white px-6 py-9 sm:px-10 sm:py-12 lg:px-12">
        <div className="pointer-events-none absolute -top-28 -right-24 h-96 w-96 rounded-full bg-emerald-50 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold tracking-wide text-emerald-800"><Heart className="h-3.5 w-3.5" aria-hidden="true" />VỀ LẠC ƠI</p>
            <h1 id="tieu-de-gioi-thieu" className="mt-6 text-4xl leading-tight font-black tracking-tight text-emerald-950 sm:text-5xl">Để những món đồ lạc <span className="text-emerald-700">tìm được đường về.</span></h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#607568] sm:text-base sm:leading-8">Có những món đồ nhỏ nhưng mang theo rất nhiều kỷ niệm. Lạc Ơi là nơi kết nối người làm mất với người nhặt được, để sự tử tế trong trường trở thành những cuộc gặp gỡ ý nghĩa.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/danh-sach-do" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><Search className="h-4 w-4" aria-hidden="true" />Tra cứu đồ thất lạc<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <a href="#cach-hoat-dong" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d6e4db] bg-white px-5 py-3 text-sm font-semibold text-[#344d3e] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Tìm hiểu cách hoạt động<ArrowDown className="h-4 w-4" aria-hidden="true" /></a>
            </div>
          </div>

          <TrinhChieuAnh danhSachAnh={CAC_ANH_GIOI_THIEU} nhan="Hình ảnh giới thiệu Lạc Ơi" className="aspect-[4/3] min-w-0 rounded-[2rem] border border-emerald-100 bg-[#f8fbf9]" />
        </div>
      </section>

      <section aria-labelledby="ly-do-lac-oi">
        <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">Một cộng đồng, nhiều sự sẻ chia</p><h2 id="ly-do-lac-oi" className="mt-3 text-2xl font-extrabold tracking-tight text-emerald-950 sm:text-3xl">Lạc một món đồ, đừng lạc mất hy vọng.</h2><p className="mt-4 text-sm leading-7 text-[#607568]">Thay vì để thông tin trôi qua trong những cuộc trò chuyện rời rạc, Lạc Ơi mang mọi người đến gần nhau qua một nơi tìm kiếm và chia sẻ chung.</p></div>
        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {CAC_GIA_TRI.map(({ tieuDe, bieuTuong, noiDung }) => <KhungThongTin key={tieuDe} tieuDe={tieuDe} bieuTuong={bieuTuong}><p className="text-sm leading-7 text-[#607568]">{noiDung}</p></KhungThongTin>)}
        </div>
      </section>

      <section id="cach-hoat-dong" aria-labelledby="tieu-de-cach-hoat-dong" className="scroll-mt-28 rounded-[2rem] border border-[#d6e4db] bg-white p-6 sm:p-9">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-bold tracking-widest text-emerald-700 uppercase">Từ thất lạc đến tìm lại</p><h2 id="tieu-de-cach-hoat-dong" className="mt-3 text-2xl font-extrabold tracking-tight text-emerald-950 sm:text-3xl">Ba bước để kết nối</h2></div><p className="max-w-xs text-sm leading-6 text-[#607568]">Bắt đầu bằng một tin đăng.<br />Tiếp nối bằng sự quan tâm.</p></div>
        <ol className="mt-8 grid gap-7 lg:grid-cols-3 lg:gap-8">
          {CAC_BUOC.map(({ tieuDe, bieuTuong: BieuTuong, noiDung }, viTri) => (
            <li key={tieuDe} className="relative border-t border-[#dce7dd] pt-5"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sm font-extrabold text-emerald-800">0{viTri + 1}</span><BieuTuong className="h-5 w-5 text-[#718276]" aria-hidden="true" /></div><h3 className="mt-4 text-base font-bold text-[#243c30]">{tieuDe}</h3><p className="mt-2 text-sm leading-7 text-[#607568]">{noiDung}</p></li>
          ))}
        </ol>
      </section>

      <CauHoiGioiThieu />

      <section aria-labelledby="cung-lac-oi" className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-[#cce3d4] bg-[#dceee2] p-6 sm:p-9 lg:flex-row lg:items-center">
        <div className="max-w-xl"><h2 id="cung-lac-oi" className="text-2xl font-extrabold tracking-tight text-emerald-950">Bạn có thể là người mang lại một niềm vui.</h2><p className="mt-3 text-sm leading-7 text-[#526c5b]">Nếu vừa nhặt được một món đồ, hãy chia sẻ thông tin để người đang tìm có thêm cơ hội nhận lại.</p></div>
        <Link to="/dang-tin?loaiTin=found" className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-900 px-5 py-3.5 text-sm font-bold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:w-auto">Đăng tin nhặt được<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </section>
    </div>
  )
}
