import { ChevronRight, ClipboardCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import BoLocThoiGian from './BoLocThoiGian'
import TinhHinhChung from './TinhHinhChung'
import PhanBoTinDang from './PhanBoTinDang'
import TyLeTimLai from './TyLeTimLai'
import TinDangGanDay from './TinDangGanDay'
import useTongQuan from './hooks/useTongQuan'

export default function TongQuan() {
  const tongQuan = useTongQuan()

  return (
    <div className="space-y-5">
      <BoLocThoiGian {...tongQuan} />
      <div className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white">
        <TinhHinhChung {...tongQuan} />
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#d6e4db] bg-[#eaf7ef] px-5 py-4 sm:px-7">
          <p className="flex items-center gap-2 text-sm text-[#607568]">
            <ClipboardCheck className="mr-1 h-5 w-5 text-emerald-900" aria-hidden="true" />
            <strong className="font-bold text-emerald-900">{tongQuan.soChoDuyet} tin</strong> chờ duyệt
          </p>
          <Link to="/admin/tin-dang" className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-emerald-900 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
            Đến hàng chờ <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_1fr]">
          <PhanBoTinDang {...tongQuan} />
          <TyLeTimLai {...tongQuan} />
        </div>
        <TinDangGanDay {...tongQuan} />
      </div>
    </div>
  )
}
