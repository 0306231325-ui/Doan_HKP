import { useRef, useState } from 'react'
import { useAuth } from '../../../auth/useAuth'
import api, { prepareCsrf } from '../../../services/api'
import { layLoiHoSo } from './xuLyHoSo'
import useThongBaoThaoTac from '../../../components/shared/hooks/useThongBaoThaoTac'

export default function useAnhDaiDien() {
  const { user, capNhatTaiKhoan } = useAuth()
  const oChonAnh = useRef(null)
  const [dangTai, datDangTai] = useState(false)
  const hienThongBao = useThongBaoThaoTac()

  function moChonAnh() {
    if (!dangTai) oChonAnh.current?.click()
  }

  async function chonAnh(suKien) {
    const anh = suKien.target.files?.[0]
    suKien.target.value = ''
    if (!anh || dangTai) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(anh.type) || anh.size > 2 * 1024 * 1024) {
      hienThongBao('Chọn ảnh JPG, PNG hoặc WebP không quá 2 MB.', 'error')
      return
    }
    datDangTai(true)
    try {
      await prepareCsrf()
      const bieuMau = new FormData()
      bieuMau.append('anh_dai_dien', anh)
      const { data } = await api.post('/me/anh-dai-dien', bieuMau, { headers: { 'Content-Type': undefined } })
      capNhatTaiKhoan(data.user)
      hienThongBao(data.message || 'Đã đổi ảnh đại diện.')
    } catch (loiGui) {
      hienThongBao(layLoiHoSo(loiGui), 'error')
    } finally {
      datDangTai(false)
    }
  }

  return { user, oChonAnh, dangTai, moChonAnh, chonAnh }
}
