import Hero from '../components/home/Hero'
import ThanhTimKiem from '../components/danh-sach-do/ThanhTimKiem'
import DanhSachDoThatLac from '../components/danh-sach-do/DanhSachDoThatLac'
import PhanTrang from '../components/shared/PhanTrang'
import BannerHoTro from '../components/home/BannerHoTro'
import useDanhSachDo from './danh-sach-do/hooks/useDanhSachDo'

export default function Home() {
  const danhSach = useDanhSachDo()

  return (
    <div className="space-y-8 sm:space-y-12">
      <Hero />
      <ThanhTimKiem {...danhSach} />
      <DanhSachDoThatLac danhSachDo={danhSach.cacDoVat} tongTin={danhSach.tongTin} dangTai={danhSach.dangTai} loiTai={danhSach.loiTai} taiLai={danhSach.taiLai} loiNgay={danhSach.loiNgay} coBoLoc={danhSach.coBoLoc} xoaBoLoc={danhSach.xoaBoLoc} />
      {danhSach.tongTin > 0 && <PhanTrang {...danhSach} />}
      <BannerHoTro />
    </div>
  )
}
