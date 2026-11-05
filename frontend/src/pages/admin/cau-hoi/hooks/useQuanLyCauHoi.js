import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useDanhMuc from '../../../../components/shared/hooks/useDanhMuc'
import useThongBaoThaoTac from '../../../../components/shared/hooks/useThongBaoThaoTac'
import { phanTrangDanhSach } from '../../../../components/shared/xuLyPhanTrang.js'
import api, { prepareCsrf } from '../../../../services/api'
import { kiemTraCauHoi, locCauHoi, taoBieuMau } from './xuLyCauHoi.js'

export default function useQuanLyCauHoi() {
  const { danhSach: danhMuc, dangTai: dangTaiDanhMuc, loiTai: loiTaiDanhMuc, taiLai: taiLaiDanhMuc } = useDanhMuc(true)
  const [danhSach, datDanhSach] = useState([])
  const [nguon, datNguon] = useState({ lan: -1, loi: '' })
  const [lanTai, datLanTai] = useState(0)
  const dangTai = nguon.lan !== lanTai
  const loiTai = dangTai ? '' : nguon.loi
  const [dangLuu, datDangLuu] = useState(false)
  const khoaGui = useRef(false)
  const [thamSo, datThamSo] = useSearchParams()
  const danhMucChon = danhMuc.find((muc) => muc.id === thamSo.get('danh_muc'))
  const danhMucId = danhMucChon?.id
  const [tuKhoa, datTuKhoa] = useState('')
  const [trangThai, datTrangThai] = useState('tat_ca')
  const [trang, datTrang] = useState(1)
  const [bieuMau, datBieuMau] = useState(null)
  const [loi, datLoi] = useState({})
  const [loiLuu, datLoiLuu] = useState('')
  const hienThongBao = useThongBaoThaoTac()
  const [thaoTacChoXacNhan, datThaoTacChoXacNhan] = useState(null)
  const [cauHoiChon, datCauHoiChon] = useState(null)
  const [xemTruoc, datXemTruoc] = useState(false)
  const nutMoHopThoai = useRef(null)
  const daMoHopThoai = useRef(false)
  const coHopThoai = Boolean(bieuMau || thaoTacChoXacNhan || cauHoiChon || xemTruoc)
  const ketQuaLoc = useMemo(() => locCauHoi(danhSach, danhMucId, tuKhoa, trangThai), [danhSach, danhMucId, tuKhoa, trangThai])
  const phanTrang = phanTrangDanhSach(ketQuaLoc, trang, 8)
  const tongCauHoi = locCauHoi(danhSach, danhMucId).length

  useEffect(function napDanhSach() {
    const yeuCau = new AbortController()
    api.get('/admin/cau-hoi', { signal: yeuCau.signal }).then(({ data }) => {
      if (!yeuCau.signal.aborted) {
        datDanhSach(data.data)
        datNguon({ lan: lanTai, loi: '' })
      }
    }).catch((loi) => {
      if (!yeuCau.signal.aborted) datNguon({ lan: lanTai, loi: loi.response?.data?.message || 'Không tải được câu hỏi từ DB. Vui lòng thử lại.' })
    })
    return () => yeuCau.abort()
  }, [lanTai])

  function taiLai() {
    if (!khoaGui.current) datLanTai((cu) => cu + 1)
  }

  useEffect(function khoiPhucFocus() {
    if (daMoHopThoai.current && !coHopThoai) {
      const nut = nutMoHopThoai.current?.isConnected ? nutMoHopThoai.current : document.getElementById('them-cau-hoi')
      nut?.focus()
    }
    daMoHopThoai.current = coHopThoai
  }, [coHopThoai])

  function ghiNhanFocus() {
    if (!coHopThoai) nutMoHopThoai.current = document.activeElement
  }

  function doiDanhMuc(suKien) {
    datThamSo(suKien.target.value ? { danh_muc: suKien.target.value } : {})
    xoaBoLoc()
  }

  function doiTuKhoa(suKien) {
    datTuKhoa(suKien.target.value)
    datTrang(1)
  }

  function doiTrangThai(suKien) {
    datTrangThai(suKien.target.value)
    datTrang(1)
  }

  function xoaBoLoc() {
    datTuKhoa('')
    datTrangThai('tat_ca')
    datTrang(1)
  }

  function chuyenTrang(trangMoi) {
    datTrang(Math.max(1, Math.min(trangMoi, phanTrang.tongTrang)))
  }

  function moThem() {
    if (khoaGui.current || dangTai || loiTai || !danhMucChon?.dangHoatDong) return
    ghiNhanFocus()
    const mau = taoBieuMau(danhMucId)
    datBieuMau({ ...mau, thuTu: Math.min(999, Math.max(0, ...locCauHoi(danhSach, danhMucId).map((muc) => muc.thuTu)) + 1) })
    datLoi({})
    datLoiLuu('')
  }

  function moSua(cauHoi) {
    if (khoaGui.current || dangTai || loiTai) return
    ghiNhanFocus()
    datCauHoiChon(null)
    datBieuMau(structuredClone(cauHoi))
    datLoi({})
    datLoiLuu('')
  }

  function dongBieuMau() {
    if (khoaGui.current) return
    datBieuMau(null)
    datLoiLuu('')
  }

  function doiBieuMau(suKien) {
    const { name, value } = suKien.target
    datBieuMau((cu) => ({ ...cu, [name]: value }))
    datLoi({})
    datLoiLuu('')
  }

  function luuCauHoi(suKien) {
    suKien.preventDefault()
    if (khoaGui.current || dangTai || loiTai) return
    const cacLoi = kiemTraCauHoi(bieuMau, danhSach, danhMuc)
    datLoi(cacLoi)
    if (Object.keys(cacLoi).length) return
    datLoiLuu('')
    datThaoTacChoXacNhan({ loai: 'luu', cauHoi: structuredClone(bieuMau) })
  }

  function moDoiTrangThai(cauHoi) {
    if (khoaGui.current || dangTai || loiTai) return
    ghiNhanFocus()
    datThaoTacChoXacNhan({ loai: 'trang_thai', cauHoi })
    datLoiLuu('')
  }

  function moXoa(cauHoi) {
    if (khoaGui.current || dangTai || loiTai) return
    ghiNhanFocus()
    datThaoTacChoXacNhan({ loai: 'xoa', cauHoi })
    datLoiLuu('')
  }

  function dongXacNhanThaoTac() {
    if (khoaGui.current) return
    datThaoTacChoXacNhan(null)
    datLoiLuu('')
  }

  async function xacNhanThaoTac() {
    if (khoaGui.current || !thaoTacChoXacNhan) return
    const { loai, cauHoi } = thaoTacChoXacNhan
    khoaGui.current = true
    datDangLuu(true)
    datLoiLuu('')
    try {
      await prepareCsrf()
      if (loai === 'luu') {
        const { data } = cauHoi.id ? await api.put(`/admin/cau-hoi/${cauHoi.id}`, cauHoi) : await api.post('/admin/cau-hoi', cauHoi)
        const danhSachMoi = [...danhSach.filter((muc) => muc.id !== data.data.id), data.data]
        datDanhSach(danhSachMoi)
        hienThongBao(data.daThayDoi ? `Đã lưu câu hỏi “${data.data.nhanDangTin}”.` : 'Câu hỏi không có thay đổi.', data.daThayDoi ? 'success' : 'info')
        xoaBoLoc()
        const viTri = locCauHoi(danhSachMoi, data.data.danhMucId).findIndex((muc) => muc.id === data.data.id)
        datTrang(Math.floor(viTri / 8) + 1)
        datBieuMau(null)
      } else if (loai === 'xoa') {
        await api.delete(`/admin/cau-hoi/${cauHoi.id}`, { data: { phienBan: cauHoi.phienBan } })
        datDanhSach((cu) => cu.filter((muc) => muc.id !== cauHoi.id))
        hienThongBao(`Đã xóa câu hỏi “${cauHoi.nhanDangTin}”.`)
      } else {
        const { data } = await api.patch(`/admin/cau-hoi/${cauHoi.id}/trang-thai`, { phienBan: cauHoi.phienBan, dangHoatDong: !cauHoi.dangHoatDong, trangThaiHienTai: cauHoi.dangHoatDong })
        datDanhSach((cu) => cu.map((muc) => muc.id === data.data.id ? data.data : muc))
        hienThongBao(`Đã ${cauHoi.dangHoatDong ? 'ẩn' : 'mở lại'} câu hỏi “${cauHoi.nhanDangTin}”.`)
      }
      datThaoTacChoXacNhan(null)
    } catch (loiThaoTac) {
      const noiDung = loiThaoTac.response?.data?.message || 'Không lưu được vào DB. Vui lòng thử lại.'
      if (loai === 'luu' && loiThaoTac.response?.status === 422) {
        const cacLoi = loiThaoTac.response.data.errors || {}
        datLoi(Object.fromEntries(Object.entries(cacLoi).map(([ten, thongBao]) => [ten.split('.')[0], thongBao[0]])))
        datLoiLuu(noiDung)
        datThaoTacChoXacNhan(null)
      } else if ([404, 409].includes(loiThaoTac.response?.status)) {
        hienThongBao(noiDung, 'error')
        datBieuMau(null)
        datThaoTacChoXacNhan(null)
        datLanTai((cu) => cu + 1)
      } else datLoiLuu(noiDung)
    } finally {
      khoaGui.current = false
      datDangLuu(false)
    }
  }

  function moChiTiet(cauHoi) {
    ghiNhanFocus()
    datCauHoiChon(cauHoi)
  }

  function dongChiTiet() {
    datCauHoiChon(null)
  }

  function moXemTruoc() {
    ghiNhanFocus()
    if (danhMucChon) datXemTruoc(true)
  }

  function dongXemTruoc() {
    datXemTruoc(false)
  }

  return { ...phanTrang, dangTai, loiTai, taiLai, dangLuu, danhMuc, dangTaiDanhMuc, loiTaiDanhMuc, taiLaiDanhMuc, danhMucChon, danhSach, cacCauHoi: phanTrang.cacMuc, tongCauHoi, tuKhoa, trangThai, bieuMau, loi, loiLuu, thaoTacChoXacNhan, cauHoiChon, xemTruoc,
    doiDanhMuc, doiTuKhoa, doiTrangThai, xoaBoLoc, chuyenTrang, moThem, moSua, dongBieuMau, doiBieuMau, luuCauHoi,
    moDoiTrangThai, moXoa, dongXacNhanThaoTac, xacNhanThaoTac, moChiTiet, dongChiTiet, moXemTruoc, dongXemTruoc }
}
