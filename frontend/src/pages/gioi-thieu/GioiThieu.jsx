import { HeartHandshake, MessageCircle, Search, ShieldCheck, UsersRound } from 'lucide-react'
import Hero from '../../components/home/Hero'
import KhungThongTin from '../../components/shared/KhungThongTin'
import CauHoiGioiThieu from './CauHoiGioiThieu'

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
      <Hero />

      <section aria-labelledby="ly-do-lac-oi">
        <div className="mx-auto max-w-2xl text-center"><h2 id="ly-do-lac-oi" className="text-2xl font-extrabold tracking-tight text-emerald-950 sm:text-3xl">Tìm lại đồ thất lạc</h2><p className="mt-4 text-sm leading-7 text-[#607568]">Lạc Ơi giúp người mất đồ và người nhặt được dễ dàng tìm thấy nhau.</p></div>
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
    </div>
  )
}
