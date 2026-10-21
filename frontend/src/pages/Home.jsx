import Hero from '../components/Hero'
import ThanhTimKiem from '../components/ThanhTimKiem'
import DanhSachDoThatLac from '../components/DanhSachDoThatLac'
import PhanTrang from '../components/PhanTrang'
import BannerHoTro from '../components/BannerHoTro'
import useDanhSachDo from './danh-sach-do/hooks/useDanhSachDo'

export default function Home() {
  const danhSach = useDanhSachDo()

  return (
    <div className="space-y-8 sm:space-y-12">
      <Hero />
      <ThanhTimKiem {...danhSach} />
      <DanhSachDoThatLac danhSachDo={danhSach.cacDoVat} tongTin={danhSach.tongTin} loiNgay={danhSach.loiNgay} />
      <PhanTrang {...danhSach} />
      <BannerHoTro />
    </div>
  )
}
