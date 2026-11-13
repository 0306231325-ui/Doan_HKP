import { CalendarDays } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import Button from '../../components/shared/Button'
import HopThoai from '../../components/shared/HopThoai'
import useDanhMuc from '../../components/shared/hooks/useDanhMuc'
import api, { prepareCsrf } from '../../services/api'
import FormCuocHen from '../cuoc-hen/FormCuocHen'
import dinhDangGioHen from '../cuoc-hen/dinhDangGioHen'
import { layLoiGui } from './hooks/xuLyDangTin'

export default function TaoLichTraDo({ tin, taiLai }) {
  const { user, loading } = useAuth()
  const viTri = useLocation()
  const dieuHuong = useNavigate()
  const [mo, datMo] = useState(false)

  function moLich() {
    if (!user) {
      dieuHuong('/dang-nhap', { state: { from: viTri.pathname + viTri.search, authMessage: 'Vui lòng đăng nhập để tạo lịch trả đồ.' } })
      return
    }
    datMo(true)
  }

  return <>
    <Button onClick={moLich} disabled={loading} aria-haspopup="dialog" className="inline-flex items-center gap-2">
      <CalendarDays size={18} aria-hidden="true" />Tạo lịch hẹn trả đồ
    </Button>
    {mo && <FormTraDo tin={tin} khiDong={() => { datMo(false); taiLai() }} />}
  </>
}

function FormTraDo({ tin, khiDong }) {
  const { diaDiem, dangTai, loiTai, taiLai } = useDanhMuc()
  const [dangGui, datDangGui] = useState(false)
  const [loi, datLoi] = useState('')
  const [ketQua, datKetQua] = useState(null)
  const [lichCu, datLichCu] = useState(null)
  const khoaGui = useRef(false)

  async function taoLich({ ngay, gio, diaDiem: noiGap }) {
    if (khoaGui.current || !noiGap) return
    khoaGui.current = true
    datDangGui(true)
    datLoi('')
    datLichCu(null)
    try {
      await prepareCsrf()
      const { data } = await api.post(`/tin-dang/${tin.id}/lich-tra-do`, {
        diaDiemId: noiGap.id, thoiGianHen: `${ngay} ${gio}`,
      })
      datKetQua(data.data)
    } catch (loiGui) {
      datLoi(layLoiGui(loiGui))
      if (loiGui.response?.data?.data?.daCoLich) datLichCu(loiGui.response.data.data)
    } finally {
      khoaGui.current = false
      datDangGui(false)
    }
  }

  return <HopThoai rong tieuDe={ketQua ? 'Đã tạo lịch hẹn trả đồ' : 'Tạo lịch hẹn trả đồ'} khiDong={() => { if (!khoaGui.current) khiDong() }}>
    {ketQua ? <div className="space-y-5 p-5 sm:p-7">
      <p className="text-sm text-[#526c5b]">{dinhDangGioHen(ketQua.gioHen)} · {ketQua.diaDiem}</p>
      <div className="rounded-xl bg-emerald-50 p-4 text-emerald-950">
        <p className="text-sm font-semibold">Mã bàn giao</p>
        <p className="mt-1 font-mono text-3xl tracking-widest">{ketQua.ma}</p>
      </div>
      <p className="text-sm leading-6 text-[#526c5b]">Lưu mã này và đưa cho người nhận sau khi trả đồ. Mã chỉ hiện một lần và có hiệu lực từ giờ hẹn đến {dinhDangGioHen(ketQua.hetHanLuc)}.</p>
      <p className="text-sm text-[#526c5b]">Người nhận đã được thông báo lịch hẹn. Không cần admin duyệt.</p>
      <Link to={`/chi-tiet-yeu-cau?id=${ketQua.yeuCauId}&tab=lich-hen`} className="inline-block font-semibold text-emerald-800 hover:underline">Xem chi tiết cuộc hẹn</Link>
    </div> : <>
      <div className="space-y-2 px-5 pt-5 text-sm leading-6 text-[#526c5b] sm:px-7">
        <p className="font-semibold text-emerald-950">{tin.title}</p>
        <p>Bạn là người giữ đồ, {tin.contactPerson} là người nhận. Hãy liên hệ và thống nhất giờ, địa điểm trước khi tạo lịch.</p>
        {dangTai && <p role="status">Đang tải địa điểm…</p>}
        {loiTai && <div role="alert"><p>{loiTai}</p><Button onClick={taiLai}>Thử lại</Button></div>}
        {loi && <p role="alert" className="text-rose-700">{loi}</p>}
        {lichCu && <Link to={`/chi-tiet-yeu-cau?id=${lichCu.yeuCauId}&tab=lich-hen`} className="inline-block font-semibold text-emerald-800 hover:underline">Xem lịch hẹn đã tạo</Link>}
      </div>
      <FormCuocHen cacDiaDiem={diaDiem.map((muc) => ({ id: String(muc.id), ten: muc.name }))}
        khiXemLai={taoLich} khiHuy={khiDong} dangGui={dangGui} nhanXemLai="Xác nhận tạo lịch" />
    </>}
  </HopThoai>
}
