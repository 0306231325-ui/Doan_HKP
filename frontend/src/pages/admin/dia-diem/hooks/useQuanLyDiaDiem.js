import { useEffect, useMemo, useRef, useState } from 'react'
import api, { prepareCsrf } from '../../../../services/api'
import { phanTrangDanhSach } from '../../../../components/shared/xuLyPhanTrang.js'
import { kiemTraDiaDiem, locDanhSachDiaDiem } from './xuLyDiaDiem.js'

export default function useQuanLyDiaDiem() {
  const [danhSach, datDanhSach] = useState([])
  const [dangTai, datDangTai] = useState(true)
  const [loiTai, datLoiTai] = useState('')
  const [dangLuu, datDangLuu] = useState(false)
  const dangGui = useRef(false)
  const [lanTai, datLanTai] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    api.get('/admin/dia-diem', { signal: controller.signal }).then(({ data }) => {
      if (!controller.signal.aborted) { datDanhSach(data.data); datLoiTai(''); datDangTai(false) }
    }).catch(() => {
      if (!controller.signal.aborted) { datLoiTai('Không tải được địa điểm. Vui lòng thử lại.'); datDangTai(false) }
    })
    return () => controller.abort()
  }, [lanTai])
  function taiLai() { datDangTai(true); datLanTai((cu) => cu + 1) }
  function xuLyLoi(loi) {
    datLoiLuu(loi.response?.data?.message || 'Không lưu được địa điểm. Vui lòng thử lại.')
    if (loi.response?.status === 422) datLoiBieuMau(Object.fromEntries(Object.entries(loi.response.data.errors || {}).map(([k, v]) => [k, v[0]])))
    if ([404, 409].includes(loi.response?.status)) taiLai()
  }
  const [tuKhoa, datTuKhoa] = useState('')
  const [trangThai, datTrangThai] = useState('tat_ca')
  const [trang, datTrang] = useState(1)
  const [bieuMau, datBieuMau] = useState(null)
  const [loiBieuMau, datLoiBieuMau] = useState({})
  const [loiLuu, datLoiLuu] = useState('')
  const [diaDiemDoiTrangThai, datDiaDiemDoiTrangThai] = useState(null)
  const [thongBao, datThongBao] = useState('')
  const ketQuaLoc = useMemo(() => locDanhSachDiaDiem(danhSach, tuKhoa, trangThai), [danhSach, tuKhoa, trangThai])
  const phanTrang = phanTrangDanhSach(ketQuaLoc, trang, 8)
  const soHoatDong = danhSach.filter((muc) => muc.dangHoatDong).length

  function doiTuKhoa(suKien) {
    datTuKhoa(suKien.target.value)
    datTrang(1)
  }

  function doiTrangThaiLoc(suKien) {
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

  function moThemDiaDiem() {
    datBieuMau({ id: '', tenDiaDiem: '', moTa: '', dangHoatDong: true })
    datLoiBieuMau({})
    datLoiLuu('')
  }

  function moSuaDiaDiem(diaDiem) {
    datBieuMau({ ...diaDiem })
    datLoiBieuMau({})
    datLoiLuu('')
  }

  function dongBieuMau() {
    if (dangGui.current) return
    datBieuMau(null)
    datLoiBieuMau({})
    datLoiLuu('')
  }

  function thayDoiBieuMau(suKien) {
    const { name, value } = suKien.target
    datBieuMau((hienTai) => ({ ...hienTai, [name]: name === 'dangHoatDong' ? value === '1' : value }))
    datLoiBieuMau((hienTai) => ({ ...hienTai, [name]: '' }))
    datLoiLuu('')
  }

  async function luuDiaDiem(suKien) {
    suKien.preventDefault()
    if (dangGui.current) return
    const cacLoi = kiemTraDiaDiem(bieuMau, danhSach)
    datLoiBieuMau(cacLoi)
    if (Object.keys(cacLoi).length) return
    dangGui.current = true
    datDangLuu(true)
    datLoiLuu('')
    const laThemMoi = !bieuMau.id
    try {
      await prepareCsrf()
      const { data } = await api[laThemMoi ? 'post' : 'patch'](laThemMoi ? '/admin/dia-diem' : `/admin/dia-diem/${bieuMau.id}`, {
        tenDiaDiem: bieuMau.tenDiaDiem.trim().replace(/\s+/g, ' '), moTa: bieuMau.moTa.trim(), dangHoatDong: bieuMau.dangHoatDong,
      })
      datDanhSach((cu) => laThemMoi ? [...cu, data.data] : cu.map((muc) => muc.id === data.data.id ? data.data : muc))
      datThongBao(`Đã ${laThemMoi ? 'thêm' : 'cập nhật'} địa điểm “${data.data.tenDiaDiem}”.`)
      datBieuMau(null)
      if (laThemMoi) { datTuKhoa(''); datTrangThai('tat_ca'); datTrang(1) }
    } catch (loi) { xuLyLoi(loi) }
    finally { dangGui.current = false; datDangLuu(false) }
  }

  function moDoiTrangThai(diaDiem) {
    datDiaDiemDoiTrangThai(diaDiem)
    datLoiLuu('')
  }

  function dongDoiTrangThai() {
    if (dangGui.current) return
    datDiaDiemDoiTrangThai(null)
    datLoiLuu('')
  }

  async function xacNhanDoiTrangThai() {
    if (dangGui.current || !diaDiemDoiTrangThai) return
    dangGui.current = true
    datDangLuu(true)
    datLoiLuu('')
    const diaDiem = diaDiemDoiTrangThai
    try {
      await prepareCsrf()
      const { data } = await api.patch(`/admin/dia-diem/${diaDiem.id}/trang-thai`, { dangHoatDong: !diaDiem.dangHoatDong, trangThaiHienTai: diaDiem.dangHoatDong })
      datDanhSach((cu) => cu.map((muc) => muc.id === data.data.id ? data.data : muc))
      datThongBao(`Đã ${data.data.dangHoatDong ? 'kích hoạt' : 'ngừng sử dụng'} địa điểm “${data.data.tenDiaDiem}”.`)
      datDiaDiemDoiTrangThai(null)
    } catch (loi) { xuLyLoi(loi) }
    finally { dangGui.current = false; datDangLuu(false) }
  }

  function dongThongBao() {
    datThongBao('')
  }

  return {
    dangTai, loiTai, dangLuu, taiLai, ...phanTrang, cacDiaDiem: phanTrang.cacMuc, tuKhoa, trangThai, bieuMau, loiBieuMau, loiLuu, diaDiemDoiTrangThai, thongBao,
    tongDiaDiem: danhSach.length, soHoatDong, soNgungSuDung: danhSach.length - soHoatDong,
    doiTuKhoa, doiTrangThaiLoc, xoaBoLoc, chuyenTrang, moThemDiaDiem, moSuaDiaDiem,
    dongBieuMau, thayDoiBieuMau, luuDiaDiem, moDoiTrangThai, dongDoiTrangThai, xacNhanDoiTrangThai, dongThongBao,
  }
}
