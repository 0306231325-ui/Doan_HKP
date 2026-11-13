import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/shared/Button'
import HopThoai from '../../components/shared/HopThoai'
import api, { prepareCsrf } from '../../services/api'
import KhungCuocHen from './KhungCuocHen'

const HUONG_DAN_NHAP_MA = {
  goiY: 'Bạn có thể đọc hướng dẫn trước khi nhập mã.',
  tieuDe: 'Hướng dẫn nhập mã bàn giao',
  cacBuoc: [
    ['Nhận mã sau khi giao nhận đồ.', 'Người tạo cuộc hẹn đưa mã bàn giao 6 số cho người còn lại.'],
    ['Nhập đủ 6 số.', 'Người nhận mã đăng nhập vào tài khoản của mình, mở Đặt hẹn → Nhập mã bàn giao và nhập cả số 0 ở đầu nếu có.'],
    ['Xác nhận bàn giao.', 'Bấm Tiếp tục, kiểm tra mã rồi bấm Xác nhận bàn giao để ghi nhận hoàn tất cho cả hai bên.'],
  ],
  ghiChu: 'Mã dùng được từ giờ hẹn và hết hạn sau 24 giờ. Nếu mã đã hết hạn, hai bên có thể đặt lại lịch.',
}

const kieuNutPhu = 'rounded-xl border border-[#ceded3] px-4 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-50'

export default function NhapMaBanGiao() {
  const dieuHuong = useNavigate()
  const [ma, datMa] = useState('')
  const [dangGui, datDangGui] = useState(false)
  const [loi, datLoi] = useState('')
  const [ketQua, datKetQua] = useState(null)
  const [thaoTac, datThaoTac] = useState(null)
  const khoaGui = useRef(false)
  const laHuy = thaoTac === 'huy'

  function doiMa(suKien) {
    datMa(suKien.target.value.replace(/[^0-9]/g, '').slice(0, 6))
    datLoi('')
  }

  function moXacNhan(suKien) {
    suKien.preventDefault()
    if (ma.length === 6 && !khoaGui.current) {
      datLoi('')
      datThaoTac('xac-nhan')
    }
  }

  function huyNhapMa() {
    if (ma) datThaoTac('huy')
    else dieuHuong('/cuoc-hen', { replace: true })
  }

  function dongXacNhan() {
    if (!khoaGui.current) datThaoTac(null)
  }

  async function xacNhanBanGiao() {
    if (thaoTac !== 'xac-nhan' || ma.length !== 6 || khoaGui.current) return
    khoaGui.current = true
    datDangGui(true)
    datLoi('')
    try {
      await prepareCsrf()
      const { data } = await api.post('/me/cuoc-hen/xac-nhan-ban-giao', { ma })
      datKetQua(data)
      datMa('')
      datThaoTac(null)
    } catch (loiGui) {
      datLoi(loiGui.response?.status === 429 ? 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.' : loiGui.response?.data?.message || 'Chưa thể xác nhận. Vui lòng thử lại.')
    } finally {
      khoaGui.current = false
      datDangGui(false)
    }
  }

  return (
    <KhungCuocHen tieuDe="Nhập mã bàn giao" huongDan={HUONG_DAN_NHAP_MA}>
      <section className="max-w-lg rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-8">
        {ketQua ? <div className="space-y-4">
          <p role="status" className="font-semibold text-emerald-950">{ketQua.message}</p>
          <Link to={`/chi-tiet-yeu-cau?id=${ketQua.yeuCauId}&tab=lich-hen`} className="text-sm font-semibold text-emerald-800 hover:underline">Xem chi tiết cuộc hẹn</Link>
        </div> : <form onSubmit={moXacNhan} className="space-y-4">
          <label className="block text-sm font-semibold text-emerald-950">
            Mã bàn giao
            <input
              type="text" inputMode="numeric" autoComplete="off" maxLength={6} disabled={dangGui}
              value={ma} onChange={doiMa}
              placeholder="6 số" className="mt-2 block min-h-12 w-full rounded-xl border border-[#ceded3] px-4 py-3 font-mono text-lg tracking-widest focus-visible:outline-2 focus-visible:outline-emerald-700"
            />
          </label>
          {loi && !thaoTac && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
          <div className="flex flex-wrap justify-end gap-3">
            <button type="button" onClick={huyNhapMa} className={kieuNutPhu}>Hủy nhập mã</button>
            <Button type="submit" disabled={ma.length !== 6}>Tiếp tục</Button>
          </div>
        </form>}
      </section>
      {thaoTac && <HopThoai
        tieuDe={laHuy ? 'Hủy nhập mã?' : 'Xác nhận bàn giao?'}
        moTa={laHuy ? 'Mã đã nhập sẽ bị xóa khỏi biểu mẫu.' : 'Xác nhận sau khi hai bên đã giao nhận đồ.'}
        khiDong={dongXacNhan}
      >
        {!laHuy && <div className="space-y-3 px-5 pt-4 sm:px-6">
          <p className="text-sm text-emerald-950">Mã bàn giao <strong className="ml-1 font-mono tracking-widest">{ma}</strong></p>
          {loi && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
        </div>}
        <div className="flex flex-wrap justify-end gap-3 px-5 py-4 sm:px-6">
          <button type="button" onClick={dongXacNhan} disabled={dangGui} className={kieuNutPhu}>{laHuy ? 'Tiếp tục nhập' : 'Sửa mã'}</button>
          {laHuy ? <Button onClick={() => dieuHuong('/cuoc-hen', { replace: true })}>Hủy nhập mã</Button>
            : <Button onClick={xacNhanBanGiao} disabled={dangGui}>{dangGui ? 'Đang xác nhận…' : 'Xác nhận bàn giao'}</Button>}
        </div>
      </HopThoai>}
    </KhungCuocHen>
  )
}
