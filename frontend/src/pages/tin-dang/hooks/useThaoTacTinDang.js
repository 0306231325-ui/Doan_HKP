import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../auth/useAuth'
import useThongBaoThaoTac from '../../../components/shared/hooks/useThongBaoThaoTac'
import api, { prepareCsrf } from '../../../services/api'
import { layLoiGui } from './xuLyDangTin.js'

export default function useThaoTacTinDang(tin, taiLai) {
  const { user } = useAuth()
  const laChuTin = Boolean(user && tin.laChuTin)
  const [thaoTac, datThaoTac] = useState('')
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
      const diaDiem = boLoc.data.diaDiem
      const noiCu = duLieu.diaDiemId
      if (noiCu && !diaDiem.some((muc) => muc.id === noiCu)) {
        datBanSua({ duLieu, diaDiem: [...diaDiem, { id: noiCu, name: tenDiaDiem || 'Khu vực hiện tại' }] })
      } else {
        datBanSua({ duLieu, diaDiem })
      }
    }).catch((loiTai) => {
      if (!signal.aborted) datLoi(layLoiGui(loiTai))
    })
    return () => yeuCau.abort()
  }, [duongDan, laChuTin, thaoTac])

  function moThaoTac(loai) {
    if (!laChuTin || khoaGui.current) return
    datBanSua(null)
    datLoi('')
    datThaoTac(loai)
  }

  function dongThaoTac() {
    if (!khoaGui.current) datThaoTac('')
  }

  function doiTruong(suKien) {
    const { name, value } = suKien.target
    datBanSua((cu) => ({ ...cu, duLieu: { ...cu.duLieu, [name]: value } }))
    datLoi('')
  }

  async function guiThaoTac(suKien) {
    suKien?.preventDefault()
    if (!laChuTin || khoaGui.current || (thaoTac === 'sua' && !banSua) || !thaoTac) return
    khoaGui.current = true
    datDangGui(true)
    datLoi('')
    try {
      await prepareCsrf()
      const { data } = thaoTac === 'xoa' ? await api.delete(duongDan) : await api.patch(duongDan, banSua.duLieu)
      datThaoTac('')
      hienThongBao(data.message)
      taiLai?.()
    } catch (loiGui) {
      datLoi(layLoiGui(loiGui))
    } finally {
      khoaGui.current = false
      datDangGui(false)
    }
  }

  return { laChuTin, thaoTac, banSua, loi, dangGui, moThaoTac, dongThaoTac, doiTruong, guiThaoTac }
}
