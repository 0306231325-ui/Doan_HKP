import { useRef, useState } from 'react'
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
  const [thaoTacChoXacNhan, datThaoTacChoXacNhan] = useState(null)
  const [loiXacNhan, datLoiXacNhan] = useState('')
  const dangGui = useRef(false)

  function batDauSua() {
    if (dangGui.current || thaoTacChoXacNhan) return
    datDuLieu(layDuLieuHoSo(user))
    datMatKhauEmail('')
    datDangSua(true)
  }

  function huySua() {
    if (dangGui.current || thaoTacChoXacNhan) return
    if (coThayDoiHoSo(duLieu, user)) {
      datLoiXacNhan('')
      datThaoTacChoXacNhan({ loai: 'huy' })
      return
    }
    ketThucSua()
  }

  function ketThucSua() {
    datDuLieu(layDuLieuHoSo(user))
    datDangSua(false)
    datMatKhauEmail('')
    datThaoTacChoXacNhan(null)
    datLoiXacNhan('')
  }

  function dongXacNhan() {
    if (dangGui.current) return
    datThaoTacChoXacNhan(null)
    datLoiXacNhan('')
  }

  function doiTruong(suKien) {
    const { name, value } = suKien.target
    datDuLieu((hienTai) => ({ ...hienTai, [name]: value }))
  }

  function luuHoSo(suKien) {
    suKien.preventDefault()
    if (!dangSua || dangGui.current || thaoTacChoXacNhan) return
    if (!coThayDoiHoSo(duLieu, user)) {
      hienThongBao('Bạn chưa thay đổi thông tin nào.', 'info')
      return
    }
    datLoiXacNhan('')
    datThaoTacChoXacNhan({ loai: 'luu', duLieu: chuanHoaHoSo(duLieu) })
  }

  async function xacNhanThaoTac() {
    if (!dangSua || dangGui.current || !thaoTacChoXacNhan) return
    if (thaoTacChoXacNhan.loai === 'huy') {
      ketThucSua()
      return
    }
    dangGui.current = true
    datDangLuu(true)
    datLoiXacNhan('')
    try {
      await prepareCsrf()
      const { data } = await api.patch('/me', { ...thaoTacChoXacNhan.duLieu, current_password: matKhauEmail || undefined })
      capNhatTaiKhoan(data.user)
      datDangSua(false)
      datMatKhauEmail('')
      datThaoTacChoXacNhan(null)
      hienThongBao(data.message || 'Đã lưu thông tin cá nhân.', data.updated === false ? 'info' : 'success')
    } catch (loiGui) {
      if (loiGui.response?.status === 422) {
        datThaoTacChoXacNhan(null)
        hienThongBao(layLoiHoSo(loiGui), 'error')
      } else {
        datLoiXacNhan(layLoiHoSo(loiGui))
      }
    } finally {
      dangGui.current = false
      datDangLuu(false)
    }
  }

  return {
    user, dangSua, duLieu, dangLuu, matKhauEmail, datMatKhauEmail,
    emailThayDoi: duLieu.email.trim().toLowerCase() !== user?.email,
    thaoTacChoXacNhan, loiXacNhan, dongXacNhan, xacNhanThaoTac,
    batDauSua, huySua, doiTruong, luuHoSo,
  }
}
