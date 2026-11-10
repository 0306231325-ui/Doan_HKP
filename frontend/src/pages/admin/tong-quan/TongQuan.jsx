import BoLocThoiGian from './BoLocThoiGian'
import TinhHinhChung from './TinhHinhChung'
import useTongQuan from './hooks/useTongQuan'

export default function TongQuan() {
  const tongQuan = useTongQuan()

  return (
    <div className="space-y-5">
      <BoLocThoiGian {...tongQuan} />
      <div className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white">
        {tongQuan.dangTai ? <p role="status" className="p-6 text-sm text-[#607568]">Đang tải thống kê…</p>
          : tongQuan.loi ? <p role="alert" className="p-6 text-sm text-rose-700">{tongQuan.loi}</p>
            : <TinhHinhChung {...tongQuan.thongKe} nhanKhoangThoiGian={tongQuan.nhanKhoangThoiGian} />}
      </div>
    </div>
  )
}
