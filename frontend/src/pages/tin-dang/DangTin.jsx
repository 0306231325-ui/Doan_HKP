import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Link, Navigate, useMatch, useSearchParams } from 'react-router-dom'
import FormDangTin from '../../components/tin-dang/FormDangTin'
import ChonThongTinDangTin from './ChonThongTinDangTin'
import HuongDanDangTin from './HuongDanDangTin'
import useDangTin from './hooks/useDangTin'

export default function DangTin() {
  const [thamSo] = useSearchParams()
  const loaiTin = thamSo.get('loaiTin')
  const loaiBanDau = ['found', 'lost'].includes(loaiTin) ? loaiTin : ''

  return <QuyTrinhDangTin key={loaiBanDau} loaiBanDau={loaiBanDau} />
}

function QuyTrinhDangTin({ loaiBanDau }) {
  const laBuocNoiDung = Boolean(useMatch('/dang-tin/noi-dung'))
  const thamSoLoaiTin = loaiBanDau ? `?loaiTin=${loaiBanDau}` : ''
  const duongDanChon = `/dang-tin${thamSoLoaiTin}`
  const tin = useDangTin(loaiBanDau, `/dang-tin/noi-dung${thamSoLoaiTin}`)
  useEffect(function veDauTrang() { window.scrollTo(0, 0) }, [laBuocNoiDung])

  if (laBuocNoiDung && tin.loiThongTin) return <Navigate to={duongDanChon} replace />

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-6 sm:space-y-8">
      <Link to={laBuocNoiDung ? duongDanChon : '/'} replace={laBuocNoiDung} className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-[#607568] hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {laBuocNoiDung ? 'Quay lại thông tin ban đầu' : 'Về trang chủ'}
      </Link>
      <header>
        <p className="mb-2 text-sm font-semibold text-emerald-800">Bước {laBuocNoiDung ? 2 : 1} / 2</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-emerald-900 sm:text-4xl">{laBuocNoiDung ? 'Đăng tin đồ thất lạc' : 'Lựa chọn đăng tin'}</h1>
      </header>
      {laBuocNoiDung ? <><HuongDanDangTin /><FormDangTin tin={tin} /></> : <ChonThongTinDangTin tin={tin} />}
    </div>
  )
}
