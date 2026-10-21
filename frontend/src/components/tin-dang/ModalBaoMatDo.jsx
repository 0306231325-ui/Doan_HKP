import HopThoai from '../shared/HopThoai'
import FormDangTin from './FormDangTin'

export default function ModalBaoMatDo({ loaiBanDau = 'lost', onClose }) {
  return (
    <HopThoai tieuDe="Đăng tin đồ thất lạc" khiDong={onClose}>
      <div className="p-4 sm:p-5">
        <FormDangTin loaiBanDau={loaiBanDau} />
      </div>
    </HopThoai>
  )
}
