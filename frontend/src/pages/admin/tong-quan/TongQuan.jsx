import BoLocThoiGian from './BoLocThoiGian'
import TinhHinhChung from './TinhHinhChung'
import useTongQuan from './hooks/useTongQuan'

export default function TongQuan() {
  const tongQuan = useTongQuan()

  return (
    <div className="space-y-5">
      <BoLocThoiGian {...tongQuan} />
      <div className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white">
        <TinhHinhChung {...tongQuan} />
      </div>
    </div>
  )
}
