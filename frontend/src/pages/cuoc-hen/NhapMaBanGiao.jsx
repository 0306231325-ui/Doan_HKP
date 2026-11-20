import { CalendarDays, KeyRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import Button from '../../components/shared/Button'
import HopThoai from '../../components/shared/HopThoai'
import api, { prepareCsrf } from '../../services/api'
import KhungCuocHen from './KhungCuocHen'
import dinhDangGioHen from './dinhDangGioHen'

const HUONG_DAN_NHAP_MA = {
  goiY: 'Bạn có thể đọc hướng dẫn trước khi nhập mã.',
  tieuDe: 'Hướng dẫn nhập mã bàn giao',
  cacBuoc: [
    ['Nhận mã sau khi giao nhận đồ.', 'Người tạo cuộc hẹn đưa mã 6 số cho người còn lại nhập. Nếu quên mã, người tạo lịch có thể xem lại trong chi tiết cuộc hẹn khi lịch còn hiệu lực.'],
    ['Chọn cuộc hẹn.', 'Ở bước 1, chọn lịch vừa giao nhận rồi bấm Xác nhận và tiếp tục.'],
    ['Nhập mã.', 'Ở bước 2, nhập đủ 6 số, kể cả số 0 ở đầu.'],
    ['Xác nhận bàn giao.', 'Bấm Tiếp tục, kiểm tra mã rồi bấm Xác nhận bàn giao để ghi nhận hoàn tất cho cả hai bên.'],
    ['Cập nhật bài liên quan nếu có.', 'Sau khi thành công, người gửi yêu cầu hoặc người tạo lịch trả đồ từ tin báo mất vào Chi tiết yêu cầu → Cập nhật bài đăng liên quan để chọn bài của mình và đánh dấu hoàn tất.'],
  ],
  ghiChu: 'Hạn xác nhận là 8 giờ sau giờ hẹn. Lịch hết hạn thì không thể dùng mã để xác nhận. Mỗi yêu cầu tối đa 2 cuộc hẹn; nếu cả hai đều bị hủy, yêu cầu bị hủy và tin được mở lại khi không còn lịch khác đang hiệu lực.',
}

const kieuNutPhu = 'rounded-xl border border-[#ceded3] px-4 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-50'
const kieuTruong = 'mt-2 block min-h-12 w-full rounded-xl border border-[#ceded3] bg-white px-4 py-3 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:bg-[#f5f8f6]'
const kieuChanBuoc = 'flex flex-wrap items-center justify-end gap-3 rounded-b-3xl border-t border-[#e1eae4] bg-[#f9fbfa] px-5 py-4 sm:px-7'

function thoiGianDiaDiem(lich) {
  return [lich.gioHen && dinhDangGioHen(lich.gioHen), lich.diaDiem].filter(Boolean).join(' · ')
}

export default function NhapMaBanGiao() {
  const [lanTai, datLanTai] = useState(0)
  const [nguon, datNguon] = useState(null)
  const [idDaChon, datIdDaChon] = useState(null)
  const dangTaiLich = nguon?.lan !== lanTai
  const cacLich = dangTaiLich ? [] : nguon.danhSach
  const lichChon = cacLich.find((lich) => lich.id === idDaChon)

  useEffect(function napLichChoNhapMa() {
    const yeuCau = new AbortController()
    const { signal } = yeuCau
    api.get('/me/cuoc-hen/cho-nhap-ma', { signal })
      .then(({ data }) => {
        if (!signal.aborted) datNguon({ lan: lanTai, danhSach: data.data, loi: '' })
      })
      .catch(() => {
        if (!signal.aborted) datNguon({ lan: lanTai, danhSach: [], loi: 'Không tải được danh sách cuộc hẹn.' })
      })
    return () => yeuCau.abort()
  }, [lanTai])

  function taiLai() {
    datLanTai((lan) => lan + 1)
  }

  function boLichDaXacNhan(id) {
    datNguon((cu) => ({ ...cu, danhSach: cu.danhSach.filter((lich) => lich.id !== id) }))
    datIdDaChon(null)
  }

  return (
    <KhungCuocHen rong tieuDe="Nhập mã bàn giao" huongDan={HUONG_DAN_NHAP_MA}>
      <Outlet context={{ cacLich, lichChon, datIdDaChon, dangTaiLich, loiTai: nguon?.loi, taiLai, boLichDaXacNhan }} />
    </KhungCuocHen>
  )
}

function KhungBuocNhapMa({ buoc, tieuDe, bieuTuong: BieuTuong, children }) {
  return (
    <section className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <div className="border-b border-emerald-100 px-5 py-4 sm:px-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-800">Bước {buoc} / 2</p>
        <h2 className="flex items-center gap-2 text-xl font-bold text-emerald-950">
          <BieuTuong className="size-5 shrink-0 text-emerald-800" aria-hidden="true" />{tieuDe}
        </h2>
      </div>
      {children}
    </section>
  )
}

export function ChonCuocHenNhapMa() {
  const { cacLich, lichChon, datIdDaChon, dangTaiLich, loiTai, taiLai } = useOutletContext()
  const dieuHuong = useNavigate()

  function tiepTuc(suKien) {
    suKien.preventDefault()
    if (lichChon) dieuHuong('ma')
  }

  return (
    <KhungBuocNhapMa buoc={1} tieuDe="Chọn cuộc hẹn" bieuTuong={CalendarDays}>
      <form onSubmit={tiepTuc}>
        <div className="p-5 sm:p-7">
          {dangTaiLich ? <p role="status" className="p-6 text-center text-sm text-[#526c5b]">Đang tải cuộc hẹn…</p>
            : loiTai ? <div className="space-y-3 p-6 text-center">
              <p role="alert" className="text-sm text-rose-700">{loiTai}</p>
              <Button onClick={taiLai}>Thử lại</Button>
            </div> : !cacLich.length ? <div className="space-y-3 p-6 text-center">
              <p className="text-sm text-[#526c5b]">Bạn chưa có cuộc hẹn nào chờ bạn nhập mã bàn giao.</p>
              <Link to="/theo-doi-yeu-cau?tab=lich-hen" className="text-sm font-semibold text-emerald-800 hover:underline">Xem lịch hẹn của bạn</Link>
            </div> : (
              <div role="region" aria-label="Danh sách cuộc hẹn" tabIndex={0} className="max-h-96 overflow-y-auto overscroll-contain rounded-2xl border border-[#d6e4db] bg-[#f5f9f6] p-3 focus-visible:outline-2 focus-visible:outline-emerald-700 sm:p-4">
                <fieldset className="space-y-3">
                  <legend className="sr-only">Cuộc hẹn chờ nhập mã</legend>
                  {cacLich.map((lich) => (
                    <label key={lich.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#ceded3] bg-white p-4 hover:bg-emerald-50 has-checked:border-emerald-700 has-checked:bg-emerald-50">
                      <input type="radio" name="cuocHen" value={lich.id} checked={lichChon?.id === lich.id}
                        onChange={() => datIdDaChon(lich.id)} className="mt-1.5 shrink-0 accent-emerald-800" />
                      <span className="min-w-0">
                        <span className="block break-words font-semibold text-emerald-950">{lich.tieuDe}</span>
                        <span className="mt-1 block text-sm leading-5 text-[#526c5b]">{thoiGianDiaDiem(lich)}</span>
                      </span>
                    </label>
                  ))}
                </fieldset>
              </div>
            )}
        </div>
        <div className={kieuChanBuoc}>
          <Button type="submit" disabled={!lichChon}>Xác nhận và tiếp tục</Button>
        </div>
      </form>
    </KhungBuocNhapMa>
  )
}

export function NhapMaChoCuocHen() {
  const { lichChon, boLichDaXacNhan } = useOutletContext()
  const dieuHuong = useNavigate()
  const [ma, datMa] = useState('')
  const [dangGui, datDangGui] = useState(false)
  const [loi, datLoi] = useState('')
  const [ketQua, datKetQua] = useState(null)
  const [thaoTac, datThaoTac] = useState(null)
  const khoaGui = useRef(false)
  const laQuayLai = thaoTac === 'quay-lai'
  const oNhapMa = useRef(null)

  useEffect(() => {
    oNhapMa.current?.focus()
  }, [])

  function doiMa(suKien) {
    datMa(suKien.target.value.replace(/[^0-9]/g, '').slice(0, 6))
    datLoi('')
  }

  function moXacNhan(suKien) {
    suKien.preventDefault()
    if (lichChon && ma.length === 6 && !khoaGui.current) {
      datLoi('')
      datThaoTac('xac-nhan')
    }
  }

  function quayLai() {
    if (ma) datThaoTac('quay-lai')
    else dieuHuong(-1)
  }

  function dongXacNhan() {
    if (!khoaGui.current) datThaoTac(null)
  }

  async function xacNhanBanGiao() {
    if (thaoTac !== 'xac-nhan' || !lichChon || ma.length !== 6 || khoaGui.current) return
    khoaGui.current = true
    datDangGui(true)
    datLoi('')
    try {
      await prepareCsrf()
      const { data } = await api.post('/me/cuoc-hen/xac-nhan-ban-giao', { cuocHenId: lichChon.id, ma })
      datKetQua(data)
      datMa('')
      datThaoTac(null)
      boLichDaXacNhan(lichChon.id)
      window.dispatchEvent(new Event('thong-bao:cap-nhat'))
    } catch (loiGui) {
      datLoi(loiGui.response?.status === 429 ? 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.' : loiGui.response?.data?.message || 'Chưa thể xác nhận. Vui lòng thử lại.')
    } finally {
      khoaGui.current = false
      datDangGui(false)
    }
  }

  if (ketQua) return (
    <section className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
      <p role="status" className="font-semibold text-emerald-950">{ketQua.message}</p>
      <Link to={`/chi-tiet-yeu-cau?id=${ketQua.yeuCauId}&tab=lich-hen&cuocHen=${ketQua.cuocHenId}`} className="text-sm font-semibold text-emerald-800 hover:underline">Xem chi tiết cuộc hẹn</Link>
    </section>
  )
  if (!lichChon) return <Navigate to="/cuoc-hen/nhap-ma" replace />

  return (
    <KhungBuocNhapMa buoc={2} tieuDe="Nhập mã bàn giao" bieuTuong={KeyRound}>
      <form onSubmit={moXacNhan}>
        <div className="space-y-5 p-5 sm:p-7">
          <div className="rounded-xl border border-[#d6e4db] bg-[#f9fbfa] p-4 text-sm">
            <p className="font-semibold text-emerald-950">{lichChon.tieuDe}</p>
            <p className="mt-1 text-[#526c5b]">{thoiGianDiaDiem(lichChon)}</p>
          </div>
          <label className="block max-w-sm text-sm font-semibold text-emerald-950">
            Mã bàn giao
            <input ref={oNhapMa} type="text" inputMode="numeric" autoComplete="off" maxLength={6} required disabled={dangGui}
              value={ma} onChange={doiMa} placeholder="6 số" className={`${kieuTruong} font-mono text-lg tracking-widest`} />
          </label>
          {loi && !thaoTac && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
        </div>
        <div className={kieuChanBuoc}>
          <button type="button" onClick={quayLai} disabled={dangGui} className={kieuNutPhu}>Quay lại bước 1</button>
          <Button type="submit" aria-haspopup="dialog" disabled={ma.length !== 6 || dangGui}>Tiếp tục</Button>
        </div>
      </form>
      {thaoTac && <HopThoai
        tieuDe={laQuayLai ? 'Quay lại chọn cuộc hẹn?' : 'Xác nhận bàn giao?'}
        moTa={laQuayLai ? 'Mã đã nhập sẽ bị xóa khỏi biểu mẫu.' : 'Xác nhận sau khi hai bên đã giao nhận đồ.'}
        khiDong={dongXacNhan}
      >
        {!laQuayLai && <div className="space-y-3 px-5 pt-4 sm:px-6">
          <div className="text-sm text-emerald-950">
            <p className="font-semibold">{lichChon.tieuDe}</p>
            <p className="mt-1 text-[#526c5b]">{thoiGianDiaDiem(lichChon)}</p>
          </div>
          <p className="text-sm text-emerald-950">Mã bàn giao <strong className="ml-1 font-mono tracking-widest">{ma}</strong></p>
          {loi && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
        </div>}
        <div className="flex flex-wrap justify-end gap-3 px-5 py-4 sm:px-6">
          <button type="button" onClick={dongXacNhan} disabled={dangGui} className={kieuNutPhu}>{laQuayLai ? 'Tiếp tục nhập' : 'Sửa mã'}</button>
          {laQuayLai ? <Button onClick={() => dieuHuong(-1)}>Quay lại bước 1</Button>
            : <Button onClick={xacNhanBanGiao} disabled={dangGui}>{dangGui ? 'Đang xác nhận…' : 'Xác nhận bàn giao'}</Button>}
        </div>
      </HopThoai>}
    </KhungBuocNhapMa>
  )
}
