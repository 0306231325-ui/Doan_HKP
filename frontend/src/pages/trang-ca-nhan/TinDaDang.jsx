import DanhSachDoThatLac from '../../components/danh-sach-do/DanhSachDoThatLac'
import PhanTrang from '../../components/shared/PhanTrang'
import useTinDaDang from './hooks/useTinDaDang'

export default function TinDaDang({ nguoiDungId }) {
  const { danhSachDo, meta, dangTai, loiTai, taiLai, chuyenTrang } = useTinDaDang(nguoiDungId)

  return (
    <div className="space-y-5">
      <DanhSachDoThatLac
        tieuDe="Tin đã đăng"
        moTa="Theo dõi và quản lý các tin báo mất, nhặt được của bạn."
        danhSachDo={danhSachDo}
        dangTai={dangTai}
        loiTai={loiTai}
        taiLai={taiLai}
        hienTrangThai
      />
      {meta?.tongTrang > 1 && <PhanTrang {...meta} chuyenTrang={chuyenTrang} nhanDieuHuong="Phân trang tin đã đăng" />}
    </div>
  )
}
