import CauHoiGioiThieu from './CauHoiGioiThieu'

const CAC_BUOC = [
  { tieuDe: 'Đăng tin hoặc tìm kiếm', noiDung: 'Mô tả món đồ bạn bị mất, đăng tin nhặt được hoặc tra cứu những thông tin có liên quan.' },
  { tieuDe: 'Kết nối và đối chiếu', noiDung: 'Trao đổi đặc điểm nhận biết và thông tin liên quan để xác định đúng đồ vật, đúng người nhận.' },
  { tieuDe: 'Hẹn gặp và trao trả', noiDung: 'Thống nhất một địa điểm phù hợp trong trường và cùng đưa món đồ về với chủ nhân.' },
]

export default function GioiThieu() {
  return (
    <div className="space-y-12 sm:space-y-16">
      <section id="cach-hoat-dong" aria-labelledby="tieu-de-cach-hoat-dong" className="scroll-mt-28 rounded-[2rem] border border-[#d6e4db] bg-white p-6 sm:p-9">
        <h2 id="tieu-de-cach-hoat-dong" className="text-2xl font-extrabold tracking-tight text-emerald-950 sm:text-3xl">Ba bước để kết nối</h2>
        <ol className="mt-8 grid gap-7 lg:grid-cols-3 lg:gap-8">
          {CAC_BUOC.map(({ tieuDe, noiDung }, viTri) => (
            <li key={tieuDe} className="border-t border-[#dce7dd] pt-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sm font-extrabold text-emerald-800">0{viTri + 1}</span>
              <h3 className="mt-4 text-base font-bold text-[#243c30]">{tieuDe}</h3>
              <p className="mt-2 text-sm leading-7 text-[#607568]">{noiDung}</p>
            </li>
          ))}
        </ol>
      </section>

      <CauHoiGioiThieu />
    </div>
  )
}
