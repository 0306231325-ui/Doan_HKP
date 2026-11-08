import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../auth/useAuth'
import api, { prepareCsrf } from '../../../services/api'
import { layLoiHoSo } from './xuLyHoSo'
import useThongBaoThaoTac from '../../../components/shared/hooks/useThongBaoThaoTac'

export default function useAnhDaiDien() {
  const { user, capNhatTaiKhoan } = useAuth()
  const oChonAnh = useRef(null)
  const [hopThoaiAnh, datHopThoaiAnh] = useState('')
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

  function moQuanLyAnh() {
    if (!dangGui.current) datHopThoaiAnh('quan-ly')
  }

  function dongQuanLyAnh() {
    if (dangGui.current) return
    datHopThoaiAnh('')
    datLoiTaiAnh('')
  }

  function doiXacNhanGoAnh() {
    if (dangGui.current) return
    datHopThoaiAnh(hopThoaiAnh === 'go-anh' ? 'quan-ly' : 'go-anh')
    datLoiTaiAnh('')
  }

  function moChonAnh() {
    if (!dangTai && !anhChon) oChonAnh.current?.click()
  }

  function chonAnh(suKien) {
    const anh = suKien.target.files?.[0]
    suKien.target.value = ''
    if (!anh || dangGui.current || anhChon) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(anh.type) || anh.size > 2 * 1024 * 1024) {
      datLoiTaiAnh('Chọn ảnh JPG, PNG hoặc WebP không quá 2 MB.')
      return
    }
    datLoiTaiAnh('')
    datAnhChon({ tepAnh: anh, urlAnh: URL.createObjectURL(anh) })
    datHopThoaiAnh('')
  }

  function huyChonAnh() {
    if (!dangGui.current) {
      datAnhChon(null)
      datLoiTaiAnh('')
      datHopThoaiAnh('quan-ly')
    }
  }

  async function xacNhanAnhDaiDien() {
    const goAnh = hopThoaiAnh === 'go-anh'
    if (dangGui.current || (!goAnh && !anhChon)) return
    dangGui.current = true
    datDangTai(true)
    datLoiTaiAnh('')
    try {
      await prepareCsrf()
      let phanHoi
      if (goAnh) {
        phanHoi = await api.delete('/me/anh-dai-dien')
      } else {
        const bieuMau = new FormData()
        bieuMau.append('anh_dai_dien', anhChon.tepAnh)
        phanHoi = await api.post('/me/anh-dai-dien', bieuMau, { headers: { 'Content-Type': undefined } })
      }
      const { data } = phanHoi
      capNhatTaiKhoan(data.user)
      datAnhChon(null)
      datHopThoaiAnh('')
      hienThongBao(data.message)
    } catch (loiGui) {
      datLoiTaiAnh(layLoiHoSo(loiGui))
    } finally {
      dangGui.current = false
      datDangTai(false)
    }
  }

  return { user, oChonAnh, hopThoaiAnh, dangTai, urlAnh: anhChon?.urlAnh, loiTaiAnh, moQuanLyAnh, dongQuanLyAnh, doiXacNhanGoAnh, moChonAnh, chonAnh, huyChonAnh, xacNhanAnhDaiDien }
}
