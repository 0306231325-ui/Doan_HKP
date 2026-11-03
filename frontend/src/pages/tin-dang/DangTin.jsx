import { ArrowLeft } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import FormDangTin from '../../components/tin-dang/FormDangTin'
import HuongDanDangTin from './HuongDanDangTin'

export default function DangTin() {
  const [thamSo] = useSearchParams()
  const loaiTin = thamSo.get('loaiTin') === 'found' ? 'found' : 'lost'

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-6 sm:space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-[#607568] hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-700"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Về trang chủ</Link>
      <header><h1 className="text-3xl font-extrabold tracking-tight text-emerald-900 sm:text-4xl">Đăng tin đồ thất lạc</h1></header>
      <HuongDanDangTin />
      <FormDangTin key={loaiTin} loaiBanDau={loaiTin} />
    </div>
  )
}
