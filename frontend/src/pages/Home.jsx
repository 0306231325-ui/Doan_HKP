import Hero from '../components/Hero'
import ThanhTimKiem from '../components/ThanhTimKiem'
import DanhSachDoThatLac from '../components/DanhSachDoThatLac'
import PhanTrang from '../components/PhanTrang'
import BannerHoTro from '../components/BannerHoTro'
import { MOCK_ITEMS } from '../data/mockData'

export default function Home() {
  return (
    <div className="space-y-8 sm:space-y-12">
      <Hero />
      <ThanhTimKiem />
      <DanhSachDoThatLac danhSachDo={MOCK_ITEMS} />
      <PhanTrang />
      <BannerHoTro />
    </div>
  )
}
