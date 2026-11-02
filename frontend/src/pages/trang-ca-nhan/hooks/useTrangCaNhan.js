import { useEffect, useRef, useState } from 'react'
import { ClipboardList, HandHeart, UserRound } from 'lucide-react'

const CAC_MUC = [
  { id: 'thong-tin', nhan: 'Thông tin cá nhân', bieuTuong: UserRound },
  { id: 'tin-dang', nhan: 'Tin đã đăng', bieuTuong: ClipboardList },
  { id: 'yeu-cau', nhan: 'Yêu cầu nhận đồ', bieuTuong: HandHeart },
]

export default function useTrangCaNhan() {
  const [mucHienTai, datMucHienTai] = useState(CAC_MUC[0].id)
  const [moMenu, datMoMenu] = useState(false)
  const khungMenu = useRef(null)
  const nutMenu = useRef(null)

  useEffect(function theoDoiMenu() {
    if (!moMenu) return
    function nhanNgoaiMenu(suKien) {
      if (!khungMenu.current?.contains(suKien.target)) datMoMenu(false)
    }
    function nhanPhimDong(suKien) {
      if (suKien.key === 'Escape') {
        datMoMenu(false)
        nutMenu.current?.focus()
      }
    }
    document.addEventListener('pointerdown', nhanNgoaiMenu)
    document.addEventListener('keydown', nhanPhimDong)
    return function huyTheoDoiMenu() {
      document.removeEventListener('pointerdown', nhanNgoaiMenu)
      document.removeEventListener('keydown', nhanPhimDong)
    }
  }, [moMenu])

  function doiMoMenu() {
    datMoMenu((hienTai) => !hienTai)
  }

  function dongMenuKhiRoiKhung(suKien) {
    if (!suKien.currentTarget.contains(suKien.relatedTarget)) datMoMenu(false)
  }

  function chonMuc(id) {
    if (CAC_MUC.some((muc) => muc.id === id)) {
      datMucHienTai(id)
      datMoMenu(false)
      nutMenu.current?.focus()
    }
  }

  return { cacMuc: CAC_MUC, mucHienTai, chonMuc, moMenu, doiMoMenu, dongMenuKhiRoiKhung, khungMenu, nutMenu }
}
