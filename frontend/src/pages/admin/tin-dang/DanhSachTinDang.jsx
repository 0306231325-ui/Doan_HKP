import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Files, Clock, EyeOff, Flag } from 'lucide-react'
import PhanTrang from '../../../components/shared/PhanTrang'
import BoLocTinDang from './BoLocTinDang'
import BangTinDang from './BangTinDang'

export default function DanhSachTinDang() {
  const { cacTin } = useOutletContext()
  const [tuKhoa, datTuKhoa] = useState('')
  const [trangThai, datTrangThai] = useState('tat_ca')
  const [loai, datLoai] = useState('tat_ca')
  const [coBaoCao, datCoBaoCao] = useState(false)
  const [trang, datTrang] = useState(1)
  const ketQua = cacTin.filter((tin) => (trangThai === 'tat_ca' || tin.trangThai === trangThai) && (loai === 'tat_ca' || tin.type === loai) && (!coBaoCao || tin.baoCao.some((bc) => bc.trangThai === 'cho_xu_ly')) && `${tin.fullName} ${tin.referenceCode} ${tin.nguoiDang}`.toLocaleLowerCase('vi').includes(tuKhoa.trim().toLocaleLowerCase('vi')))
  const tongTrang = Math.max(1, Math.ceil(ketQua.length / 5))
  const trangHienTai = Math.min(trang, tongTrang)
  const tu = (trangHienTai - 1) * 5
  function doiBoLoc(ham, giaTri) { ham(giaTri); datTrang(1) }
  const thongKe = [ ['Tổng tin đăng', cacTin.length, Files], ['Chờ duyệt', cacTin.filter((tin) => tin.trangThai === 'cho_duyet').length, Clock], ['Đã ẩn', cacTin.filter((tin) => tin.trangThai === 'da_an').length, EyeOff], ['Báo cáo chưa xử lý', cacTin.reduce((tong, tin) => tong + tin.baoCao.filter((bc) => bc.trangThai === 'cho_xu_ly').length, 0), Flag] ]
  return <>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{thongKe.map(([nhan, so, BieuTuong]) => <div key={nhan} className="rounded-2xl border border-[#d6e4db] bg-white p-5"><div className="flex items-center justify-between"><strong className="text-3xl font-bold text-emerald-900">{so}</strong><BieuTuong className="h-5 w-5 text-emerald-700" aria-hidden="true" /></div><p className="mt-2 text-xs text-[#718276]">{nhan}</p></div>)}</div>
    <section className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white"><div className="px-5 py-6 sm:px-6"><h2 className="text-lg font-bold text-[#1d3026]">Danh sách & kiểm duyệt tin đăng</h2><p className="mt-1 text-sm text-[#718276]">Đối chiếu báo cáo và quản lý trạng thái hiển thị của tin.</p></div>
      <BoLocTinDang {...{ tuKhoa, trangThai, loai, coBaoCao }} doiTuKhoa={(v) => doiBoLoc(datTuKhoa, v)} doiTrangThai={(v) => doiBoLoc(datTrangThai, v)} doiLoai={(v) => doiBoLoc(datLoai, v)} doiBaoCao={(v) => doiBoLoc(datCoBaoCao, v)} />
      <BangTinDang cacTin={ketQua.slice(tu, tu + 5)} />
      <div className="px-5"><PhanTrang trangHienTai={trangHienTai} tongTrang={tongTrang} tongTin={ketQua.length} tuViTri={ketQua.length ? tu + 1 : 0} denViTri={Math.min(tu + 5, ketQua.length)} chuyenTrang={datTrang} /></div>
    </section>
  </>
}
