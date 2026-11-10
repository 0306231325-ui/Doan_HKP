import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/shared/Button'
import api, { prepareCsrf } from '../../services/api'
import KhungCuocHen from './KhungCuocHen'

const HUONG_DAN_NHAP_MA = {
  goiY: 'Bạn có thể đọc hướng dẫn trước khi nhập mã.',
  tieuDe: 'Hướng dẫn nhập mã bàn giao',
  cacBuoc: [
    ['Nhận mã sau khi giao nhận đồ.', 'Người tạo cuộc hẹn đưa mã bàn giao 6 số cho người còn lại.'],
    ['Nhập đủ 6 số.', 'Đăng nhập bằng tài khoản của người nhận mã và nhập mã, kể cả số 0 ở đầu nếu có.'],
    ['Xác nhận bàn giao.', 'Bấm Xác nhận bàn giao để ghi nhận hoàn tất cho cả hai bên.'],
  ],
  ghiChu: 'Mã có hiệu lực từ giờ hẹn đến trước mốc 24 giờ sau. Nếu mã đã hết hạn, hai bên có thể tạo cuộc hẹn mới.',
}

export default function NhapMaBanGiao() {
  const [ma, datMa] = useState('')
  const [dangGui, datDangGui] = useState(false)
  const [loi, datLoi] = useState('')
  const [ketQua, datKetQua] = useState(null)
  const khoaGui = useRef(false)

  function doiMa(suKien) {
    datMa(suKien.target.value.replace(/[^0-9]/g, '').slice(0, 6))
    datLoi('')
  }

  async function xacNhanBanGiao(suKien) {
    suKien.preventDefault()
    if (ma.length !== 6 || khoaGui.current) return
    khoaGui.current = true
    datDangGui(true)
    datLoi('')
    try {
      await prepareCsrf()
      const { data } = await api.post('/me/cuoc-hen/xac-nhan-ban-giao', { ma })
      datKetQua(data)
      datMa('')
      window.dispatchEvent(new Event('thong-bao:cap-nhat'))
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
          <Link to={`/chi-tiet-yeu-cau?id=${ketQua.yeuCauId}`} className="text-sm font-semibold text-emerald-800 hover:underline">Xem chi tiết cuộc hẹn</Link>
        </div> : <form onSubmit={xacNhanBanGiao} className="space-y-4">
          <label className="block text-sm font-semibold text-emerald-950">
            Mã bàn giao
            <input
              type="text" inputMode="numeric" autoComplete="off" maxLength={6} disabled={dangGui}
              value={ma} onChange={doiMa}
              placeholder="6 số" className="mt-2 block min-h-12 w-full rounded-xl border border-[#ceded3] px-4 py-3 font-mono text-lg tracking-widest focus-visible:outline-2 focus-visible:outline-emerald-700"
            />
          </label>
          {loi && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
          <Button type="submit" disabled={dangGui || ma.length !== 6}>{dangGui ? 'Đang xác nhận…' : 'Xác nhận bàn giao'}</Button>
        </form>}
      </section>
    </KhungCuocHen>
  )
}
