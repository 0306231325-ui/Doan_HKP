import { useRef, useState } from 'react'
import { useAuth } from '../useAuth'

export default function useDangXuat() {
  const { logout } = useAuth()
  const [moXacNhan, datMoXacNhan] = useState(false)
  const [dangXuLy, datDangXuLy] = useState(false)
  const [loi, datLoi] = useState('')
  const dangGui = useRef(false)

  function moHopThoai() {
    if (dangGui.current) return
    datLoi('')
    datMoXacNhan(true)
  }

  function dongHopThoai() {
    if (dangGui.current) return
    datMoXacNhan(false)
    datLoi('')
  }

  async function xacNhanDangXuat() {
    if (!moXacNhan || dangGui.current) return
    dangGui.current = true
    datDangXuLy(true)
    datLoi('')
    try {
      await logout()
      datMoXacNhan(false)
    } catch {
      datLoi('Chưa thể đăng xuất. Vui lòng thử lại.')
    } finally {
      dangGui.current = false
      datDangXuLy(false)
    }
  }

  return { moXacNhan, dangXuLy, loi, moHopThoai, dongHopThoai, xacNhanDangXuat }
}
