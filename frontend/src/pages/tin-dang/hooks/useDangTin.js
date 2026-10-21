import { useEffect, useRef, useState } from 'react'
import { docDanhSachDanhMuc } from '../../admin/danh-muc/hooks/xuLyDanhMuc.js'
import { layCauHoiXemTruoc } from '../../admin/cau-hoi/hooks/xuLyCauHoi.js'
import { kiemTraAnhDangTin, kiemTraTinDang } from './xuLyDangTin.js'

export default function useDangTin(loaiBanDau = 'lost', danhSachCauHoi = []) {
  const [duLieu, datDuLieu] = useState({ loaiTin: loaiBanDau === 'found' ? 'found' : 'lost', danhMucId: '', soDienThoai: '' })
  const [danhMuc] = useState(() => docDanhSachDanhMuc().filter((muc) => muc.dangHoatDong))
  const [cauTraLoi, datCauTraLoi] = useState({})
  const [anh, datAnh] = useState([])
  const [loiAnh, datLoiAnh] = useState('')
  const [loi, datLoi] = useState('')
  const [moXemTruoc, datMoXemTruoc] = useState(false)
  const cacUrl = useRef(new Set())
  const loaiForm = duLieu.loaiTin === 'found' ? 'nhat' : 'mat'
  const cauHoi = layCauHoiXemTruoc(danhSachCauHoi, duLieu.danhMucId, loaiForm)

  useEffect(function quanLyAnh() {
    const urls = cacUrl.current
    return function thuHoiAnh() {
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
    }
  }, [])

  function doiTruong(suKien) {
    const { name, value } = suKien.target
    datDuLieu((cu) => ({ ...cu, [name]: value }))
    if (name === 'danhMucId' || name === 'loaiTin') datCauTraLoi({})
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
    const thongBao = kiemTraTinDang(duLieu, danhMuc, cauHoi, cauTraLoi)
    datLoi(thongBao)
    if (thongBao) return
    if (suKien.nativeEvent.submitter?.value === 'xem_truoc') {
      datMoXemTruoc(true)
    } else {
      datLoi('Chức năng đăng tin chưa sẵn sàng. Tin của bạn chưa được gửi.')
    }
  }

  function dongXemTruoc() {
    datMoXemTruoc(false)
  }

  return { duLieu, danhMuc, cauHoi, cauTraLoi, loaiForm, anh, loiAnh, loi, moXemTruoc, doiTruong, doiCauTraLoi, chonAnh, xoaAnh, xuLyGuiBieuMau, dongXemTruoc }
}
