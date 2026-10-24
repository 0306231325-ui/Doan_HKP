import { useState } from 'react'
import { ClipboardList, HandHeart, UserRound } from 'lucide-react'

const CAC_MUC = [
  { id: 'thong-tin', nhan: 'Thông tin cá nhân', bieuTuong: UserRound },
  { id: 'tin-dang', nhan: 'Tin đã đăng', bieuTuong: ClipboardList },
  { id: 'yeu-cau', nhan: 'Yêu cầu nhận đồ', bieuTuong: HandHeart },
]

export default function useTrangCaNhan() {
  const [mucHienTai, datMucHienTai] = useState(CAC_MUC[0].id)

  function chonMuc(id) {
    if (CAC_MUC.some((muc) => muc.id === id)) datMucHienTai(id)
  }

  return { cacMuc: CAC_MUC, mucHienTai, chonMuc }
}
