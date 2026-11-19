import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../auth/useAuth'
import useThongBaoThaoTac from '../../../components/shared/hooks/useThongBaoThaoTac'
import api, { prepareCsrf } from '../../../services/api'
import { layLoiGui } from './xuLyDangTin.js'

export default function useThaoTacTinDang(tin, taiLai, quayLaiKhiXoa) {
  const { user } = useAuth()
  const laChuTin = Boolean(user && tin.laChuTin)
  const [thaoTac, datThaoTac] = useState('')
  const [choXacNhan, datChoXacNhan] = useState('')
  const [banSua, datBanSua] = useState(null)
  const [loi, datLoi] = useState('')
  const [dangGui, datDangGui] = useState(false)
  const khoaGui = useRef(false)
  const hienThongBao = useThongBaoThaoTac()
  const duongDan = `/tin-dang/${tin.id}`

  useEffect(function napBanSua() {
    if (!laChuTin || thaoTac !== 'sua') return
    const yeuCau = new AbortController()
    const { signal } = yeuCau
    Promise.all([
      api.get(`${duongDan}/chinh-sua`, { signal }),
      api.get('/tra-cuu/bo-loc', { signal }),
    ]).then(([tin, boLoc]) => {
      if (signal.aborted) return
      const { tenDiaDiem, ...duLieu } = tin.data.data
      const banNhap = { duLieu, duLieuGoc: duLieu, diaDiem: boLoc.data.diaDiem }
      const noiCu = duLieu.diaDiemId
      if (noiCu && !banNhap.diaDiem.some((muc) => muc.id === noiCu)) {
        banNhap.diaDiem = [...banNhap.diaDiem, { id: noiCu, name: tenDiaDiem || 'Khu vực hiện tại' }]
      }
      datBanSua(banNhap)
    }).catch((loiTai) => {
      if (!signal.aborted) datLoi(layLoiGui(loiTai))
    })
    return () => yeuCau.abort()
  }, [duongDan, laChuTin, thaoTac])

  function moThaoTac(loai) {
    if (!laChuTin || khoaGui.current) return
    datBanSua(null)
    datLoi('')
    datChoXacNhan('')
    datThaoTac(loai)
  }

  function dongThaoTac() {
    if (khoaGui.current) return
    if (choXacNhan) {
      datChoXacNhan('')
      return
    }
    if (thaoTac === 'sua' && banSua && Object.entries(banSua.duLieu).some(([ten, giaTri]) => giaTri !== banSua.duLieuGoc[ten])) {
      datChoXacNhan('huy')
      return
    }
    datThaoTac('')
  }

  function doiTruong(suKien) {
    const { name, value } = suKien.target
    datBanSua((cu) => ({ ...cu, duLieu: { ...cu.duLieu, [name]: value } }))
    datLoi('')
  }

  function yeuCauLuu(suKien) {
    suKien.preventDefault()
    if (khoaGui.current || !banSua || choXacNhan) return
    datLoi('')
    datChoXacNhan('luu')
  }

  async function xacNhanThaoTac() {
    if (!laChuTin || khoaGui.current || !thaoTac) return
    if (choXacNhan === 'huy') {
      datChoXacNhan('')
      datThaoTac('')
      return
    }
    if (thaoTac === 'sua' && (choXacNhan !== 'luu' || !banSua)) return
    khoaGui.current = true
    datDangGui(true)
    datLoi('')
    try {
      await prepareCsrf()
      const { data } = thaoTac === 'xoa' ? await api.delete(duongDan) : await api.patch(duongDan, banSua.duLieu)
      datThaoTac('')
      datChoXacNhan('')
      const noiDen = thaoTac === 'xoa' ? quayLaiKhiXoa : undefined
      hienThongBao(data.message, 'success', noiDen)
      if (!noiDen) taiLai?.()
    } catch (loiGui) {
      if (thaoTac === 'sua' && loiGui.response?.status === 422) datChoXacNhan('')
      datLoi(layLoiGui(loiGui))
    } finally {
      khoaGui.current = false
      datDangGui(false)
    }
  }

  return { laChuTin, thaoTac, choXacNhan, banSua, loi, dangGui, moThaoTac, dongThaoTac, doiTruong, yeuCauLuu, xacNhanThaoTac }
}
