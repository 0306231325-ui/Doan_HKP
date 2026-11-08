import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Hero from '../components/home/Hero'
import ThanhTimKiem from '../components/danh-sach-do/ThanhTimKiem'
import DanhSachDoThatLac from '../components/danh-sach-do/DanhSachDoThatLac'
import BannerHoTro from '../components/home/BannerHoTro'
import useDanhSachDo from './danh-sach-do/hooks/useDanhSachDo'

export default function Home() {
  const danhSach = useDanhSachDo()

  return (
    <div className="space-y-8 sm:space-y-12">
      <Hero />
      <ThanhTimKiem {...danhSach} />
      <DanhSachDoThatLac
        danhSachDo={danhSach.cacDoVat}
        tongTin={danhSach.tongTin}
        dangTai={danhSach.dangTai}
        loiTai={danhSach.loiTai}
        taiLai={danhSach.taiLai}
        loiNgay={danhSach.loiNgay}
        coBoLoc={danhSach.coBoLoc}
        xoaBoLoc={danhSach.xoaBoLoc}
        tuyChon={<Link to="/danh-sach-do" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:self-auto">Xem danh sách tin<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
      />
      <BannerHoTro />
    </div>
  )
}

