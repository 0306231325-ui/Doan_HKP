import { useState } from 'react'
import { useAuth } from '../../../auth/useAuth'
import api, { prepareCsrf } from '../../../services/api'
import { chuanHoaHoSo, coThayDoiHoSo, layDuLieuHoSo, layLoiHoSo } from './xuLyHoSo'
import useThongBaoThaoTac from '../../../components/shared/hooks/useThongBaoThaoTac'

export default function useThongTinCaNhan() {
  const { user, capNhatTaiKhoan } = useAuth()
  const [dangSua, datDangSua] = useState(false)
  const [duLieu, datDuLieu] = useState(() => layDuLieuHoSo(user))
  const [dangLuu, datDangLuu] = useState(false)
  const hienThongBao = useThongBaoThaoTac()
  const [matKhauEmail, datMatKhauEmail] = useState('')

  function batDauSua() {
    datDuLieu(layDuLieuHoSo(user))
    datMatKhauEmail('')
    datDangSua(true)
  }

  function huySua() {
    if (dangLuu) return
    datDangSua(false)
    datMatKhauEmail('')
  }

  function doiTruong(suKien) {
    const { name, value } = suKien.target
    datDuLieu((hienTai) => ({ ...hienTai, [name]: value }))
  }

  async function luuHoSo(suKien) {
    suKien.preventDefault()
    if (!dangSua || dangLuu) return
    if (!coThayDoiHoSo(duLieu, user)) {
      hienThongBao('Bạn chưa thay đổi thông tin nào.', 'info')
      return
    }
    datDangLuu(true)
    try {
      await prepareCsrf()
      const { data } = await api.patch('/me', { ...chuanHoaHoSo(duLieu), current_password: matKhauEmail || undefined })
      capNhatTaiKhoan(data.user)
      datDangSua(false)
      datMatKhauEmail('')
      hienThongBao(data.message || 'Đã lưu thông tin cá nhân.', data.updated === false ? 'info' : 'success')
    } catch (loiGui) {
      hienThongBao(layLoiHoSo(loiGui), 'error')
    } finally {
      datDangLuu(false)
    }
  }

  return {
    user, dangSua, duLieu, dangLuu, matKhauEmail, datMatKhauEmail,
    emailThayDoi: duLieu.email.trim().toLowerCase() !== user?.email,
    batDauSua, huySua, doiTruong, luuHoSo,
  }
}
