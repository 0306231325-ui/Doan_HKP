import { useAuth } from '../../auth/useAuth'
import DanhSachDoThatLac from '../../components/danh-sach-do/DanhSachDoThatLac'
import ThanhTimKiem from '../../components/danh-sach-do/ThanhTimKiem'
import PhanTrang from '../../components/shared/PhanTrang'
import useTinDaDang from './hooks/useTinDaDang'

export default function TinDaDang() {
  const { user } = useAuth()
  const { danhSachDo, meta, dangTai, loiTai, taiLai, chuyenTrang, tuKhoa, timKiem, xoaTimKiem } = useTinDaDang(user.id)

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-emerald-900 sm:text-3xl">Tin đã đăng</h1>
        <p className="mt-2 text-sm leading-6 text-[#687d70]">Theo dõi và quản lý các tin báo mất, nhặt được của bạn.</p>
      </header>
      <ThanhTimKiem tieuDe="Tìm trong tin đã đăng" tuKhoaBanDau={tuKhoa} timKiem={timKiem} />
      <DanhSachDoThatLac
        tieuDe="Các tin của bạn"
        moTa={`${meta?.tongTin ?? 0} tin phù hợp`}
        danhSachDo={danhSachDo}
        dangTai={dangTai}
        loiTai={loiTai}
        taiLai={taiLai}
        coBoLoc={Boolean(tuKhoa)}
        xoaBoLoc={xoaTimKiem}
        hienTrangThai
      />
      {meta?.tongTin > 0 && <PhanTrang {...meta} chuyenTrang={chuyenTrang} nhanDieuHuong="Phân trang tin đã đăng" />}
    </div>
  )
}
