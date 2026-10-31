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
  const [moDoiMatKhau, datMoDoiMatKhau] = useState(false)
  const [dangDoiMatKhau, datDangDoiMatKhau] = useState(false)
  const [loiMatKhau, datLoiMatKhau] = useState('')

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

  function moHopThoaiMatKhau() {
    datLoiMatKhau('')
    datMoDoiMatKhau(true)
  }

  function dongHopThoaiMatKhau() {
    if (!dangDoiMatKhau) datMoDoiMatKhau(false)
  }

  async function doiMatKhau(suKien) {
    suKien.preventDefault()
    if (dangDoiMatKhau) return
    const bieuMau = new FormData(suKien.currentTarget)
    if (bieuMau.get('password') !== bieuMau.get('password_confirmation')) {
      datLoiMatKhau('Mật khẩu xác nhận không khớp.')
      return
    }
    datDangDoiMatKhau(true)
    datLoiMatKhau('')
    try {
      await prepareCsrf()
      const { data } = await api.put('/me/mat-khau', Object.fromEntries(bieuMau))
      datMoDoiMatKhau(false)
      hienThongBao(data.message || 'Đổi mật khẩu thành công.')
    } catch (loiGui) {
      datLoiMatKhau(layLoiHoSo(loiGui))
    } finally {
      datDangDoiMatKhau(false)
    }
  }

  return {
    user, dangSua, duLieu, dangLuu, matKhauEmail, datMatKhauEmail,
    emailThayDoi: duLieu.email.trim().toLowerCase() !== user?.email,
    batDauSua, huySua, doiTruong, luuHoSo, moDoiMatKhau, dangDoiMatKhau,
    loiMatKhau, moHopThoaiMatKhau, dongHopThoaiMatKhau, doiMatKhau,
  }
}
