import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../auth/useAuth'
import api, { prepareCsrf } from '../../../services/api'
import useDanhMuc from '../../../components/shared/hooks/useDanhMuc'
import { layNgayVietNam } from '../../admin/tong-quan/hooks/xuLyThongKe.js'
import { kiemTraAnhDangTin, kiemTraTinDang, taoDuLieuGui, layLoiGui } from './xuLyDangTin.js'

export default function useDangTin(loaiBanDau = 'lost') {
  const { user } = useAuth()
  const dieuHuong = useNavigate()
  const [ngayToiDa] = useState(() => layNgayVietNam(new Date()))
  const [duLieu, datDuLieu] = useState(() => ({ loaiTin: loaiBanDau === 'found' ? 'found' : 'lost', danhMucId: '', tieuDe: '', moTa: '', ngayXayRa: ngayToiDa, diaDiemId: '', diaDiemChiTiet: '', soDienThoai: user?.so_dien_thoai || '', email: user?.email || '' }))
  const { danhSach: danhMuc, diaDiem, dangTai: dangTaiDanhMuc, loiTai: loiTaiDanhMuc, taiLai: taiLaiDanhMuc } = useDanhMuc()
  const [cauTraLoi, datCauTraLoi] = useState({})
  const [lanTaiCauHoi, datLanTaiCauHoi] = useState(0)
  const khoa = `${duLieu.danhMucId}#${lanTaiCauHoi}`
  const [nguonCauHoi, datNguonCauHoi] = useState({ khoa: '', data: [], loi: '' })
  const dangTaiCauHoi = Boolean(duLieu.danhMucId) && nguonCauHoi.khoa !== khoa
  const cauHoi = nguonCauHoi.khoa === khoa ? nguonCauHoi.data : []
  const loiTaiCauHoi = nguonCauHoi.khoa === khoa ? nguonCauHoi.loi : ''
  const [anh, datAnh] = useState([])
  const [loiAnh, datLoiAnh] = useState('')
  const [loi, datLoi] = useState('')
  const [buoc, datBuoc] = useState('')
  const [dangGui, datDangGui] = useState(false)
  const khoaGui = useRef(null)
  const dangXuLy = useRef(false)
  const cacUrl = useRef(new Set())
  const nutGui = useRef(null)
  const loaiForm = duLieu.loaiTin === 'found' ? 'nhat' : 'mat'

  useEffect(function napCauHoi() {
    if (!duLieu.danhMucId) return
    const yeuCau = new AbortController()
    api.get('/dang-tin/cau-hoi', { params: { danhMucId: duLieu.danhMucId }, signal: yeuCau.signal }).then(({ data }) => {
      if (!yeuCau.signal.aborted) datNguonCauHoi({ khoa, data: data.data, loi: '' })
    }).catch((loiTai) => {
      if (!yeuCau.signal.aborted) datNguonCauHoi({ khoa, data: [], loi: layLoiGui(loiTai) })
    })
    return () => yeuCau.abort()
  }, [duLieu.danhMucId, khoa])

  useEffect(function quanLyAnh() {
    const urls = cacUrl.current
    return function thuHoiAnh() {
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
    }
  }, [])

  function taiLaiCauHoi() {
    if (dangXuLy.current) return
    datBuoc('')
    datCauTraLoi({})
    datLanTaiCauHoi((cu) => cu + 1)
  }

  function doiTruong(suKien) {
    const { name, value } = suKien.target
    datDuLieu((cu) => ({ ...cu, [name]: value }))
    if (name === 'danhMucId') datCauTraLoi({})
    datLoi('')
  }

  function doiCauTraLoi(suKien) {
    const { name, value } = suKien.target
    datCauTraLoi((cu) => ({ ...cu, [name]: value }))
    datLoi('')
  }

  function chonAnh(suKien) {
    const cacTep = Array.from(suKien.target.files || [])
    suKien.target.value = ''
    const thongBao = kiemTraAnhDangTin(cacTep, anh.length)
    datLoiAnh(thongBao)
    if (thongBao) return
    const anhMoi = cacTep.map((tep) => {
      const url = URL.createObjectURL(tep)
      cacUrl.current.add(url)
      return { id: crypto.randomUUID(), tep, url }
    })
    datAnh((cu) => [...cu, ...anhMoi])
  }

  function xoaAnh(ma) {
    const anhXoa = anh.find((muc) => muc.id === ma)
    if (anhXoa) {
      URL.revokeObjectURL(anhXoa.url)
      cacUrl.current.delete(anhXoa.url)
    }
    datAnh((cu) => cu.filter((muc) => muc.id !== ma))
    datLoiAnh('')
  }

  function xuLyGuiBieuMau(suKien) {
    suKien.preventDefault()
    if (dangXuLy.current) return
    const thongBao = dangTaiCauHoi ? 'Đang tải câu hỏi. Vui lòng đợi.' : loiTaiCauHoi || kiemTraTinDang(duLieu, danhMuc, cauHoi, cauTraLoi, ngayToiDa)
    datLoi(thongBao)
    if (thongBao) return
    nutGui.current = suKien.nativeEvent.submitter
    datBuoc(suKien.nativeEvent.submitter?.value === 'xem_truoc' ? 'xem_truoc' : 'xac_nhan')
  }

  function dongXemTruoc() {
    if (dangXuLy.current) return
    datBuoc('')
    requestAnimationFrame(() => nutGui.current?.focus())
  }

  async function xacNhanDang() {
    if (dangXuLy.current || buoc !== 'xac_nhan') return
    dangXuLy.current = true
    datDangGui(true)
    datLoi('')
    if (!khoaGui.current) khoaGui.current = crypto.randomUUID()
    try {
      await prepareCsrf()
      const { data } = await api.post('/tin-dang', taoDuLieuGui(duLieu, cauHoi, cauTraLoi, anh, khoaGui.current), { headers: { 'Content-Type': undefined } })
      dieuHuong(`/chi-tiet-tin-dang?id=${data.data.id}`, { replace: true, state: { authMessage: data.message, authType: 'success' } })
    } catch (loiGui) {
      datLoi(layLoiGui(loiGui))
      if (loiGui.response?.status === 409) {
        datBuoc('')
      }
    } finally {
      dangXuLy.current = false
      datDangGui(false)
    }
  }

  return { dangTaiDanhMuc, loiTaiDanhMuc, taiLaiDanhMuc, diaDiem, ngayToiDa, dangTaiCauHoi, loiTaiCauHoi, taiLaiCauHoi, duLieu, danhMuc, cauHoi, cauTraLoi, loaiForm, anh, loiAnh, loi, moXemTruoc: Boolean(buoc), moXacNhan: buoc === 'xac_nhan', dangGui, doiTruong, doiCauTraLoi, chonAnh, xoaAnh, xuLyGuiBieuMau, dongXemTruoc, xacNhanDang }
}
