import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../auth/useAuth'
import api, { prepareCsrf } from '../../../services/api'
import { layLoiHoSo } from './xuLyHoSo'
import useThongBaoThaoTac from '../../../components/shared/hooks/useThongBaoThaoTac'

export default function useAnhDaiDien() {
  const { user, capNhatTaiKhoan } = useAuth()
  const oChonAnh = useRef(null)
  const [dangTai, datDangTai] = useState(false)
  const [anhChon, datAnhChon] = useState(null)
  const [loiTaiAnh, datLoiTaiAnh] = useState('')
  const dangGui = useRef(false)
  const hienThongBao = useThongBaoThaoTac()

  useEffect(function quanLyAnhXemTruoc() {
    return function thuHoiAnh() {
      if (anhChon) URL.revokeObjectURL(anhChon.urlAnh)
    }
  }, [anhChon])

  function moChonAnh() {
    if (!dangTai && !anhChon) oChonAnh.current?.click()
  }

  function chonAnh(suKien) {
    const anh = suKien.target.files?.[0]
    suKien.target.value = ''
    if (!anh || dangGui.current || anhChon) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(anh.type) || anh.size > 2 * 1024 * 1024) {
      hienThongBao('Chọn ảnh JPG, PNG hoặc WebP không quá 2 MB.', 'error')
      return
    }
    datLoiTaiAnh('')
    datAnhChon({ tepAnh: anh, urlAnh: URL.createObjectURL(anh) })
  }

  function huyChonAnh() {
    if (!dangGui.current) {
      datAnhChon(null)
      datLoiTaiAnh('')
    }
  }

  async function xacNhanDoiAnh() {
    if (dangGui.current || !anhChon) return
    dangGui.current = true
    datDangTai(true)
    datLoiTaiAnh('')
    try {
      await prepareCsrf()
      const bieuMau = new FormData()
      bieuMau.append('anh_dai_dien', anhChon.tepAnh)
      const { data } = await api.post('/me/anh-dai-dien', bieuMau, { headers: { 'Content-Type': undefined } })
      capNhatTaiKhoan(data.user)
      datAnhChon(null)
      hienThongBao(data.message || 'Đã đổi ảnh đại diện.')
    } catch (loiGui) {
      datLoiTaiAnh(layLoiHoSo(loiGui))
    } finally {
      dangGui.current = false
      datDangTai(false)
    }
  }

  return { user, oChonAnh, dangTai, tepAnh: anhChon?.tepAnh, urlAnh: anhChon?.urlAnh, loiTaiAnh, moChonAnh, chonAnh, huyChonAnh, xacNhanDoiAnh }
}
