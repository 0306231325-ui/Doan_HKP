import { ArrowUpRight, MessageSquare, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import Button from '../../components/shared/Button'
import HopThoai from '../../components/shared/HopThoai'
import HuongDanThaoTac from '../../components/shared/HuongDanThaoTac'
import PhanTrang from '../../components/shared/PhanTrang'
import { dinhDangNgay } from '../danh-sach-do/hooks/xuLyDanhSachDo.js'
import useGiuDo from './hooks/useGiuDo'

const cacBuocGiuDo = [
  ['Chọn tin nhặt được.', 'Chọn tin bạn đã đăng về đúng món đồ. Tin cần đang mở, công khai và có câu hỏi nhận diện.'],
  ['Xác nhận gửi thông báo.', 'Bấm Gửi thông báo, kiểm tra hai tin rồi bấm Xác nhận gửi. Chủ tin báo mất sẽ nhận thông báo.'],
  ['Thống nhất lịch gặp.', 'Hệ thống ghi nhận yêu cầu đã xác minh. Hai bên liên hệ rồi chọn yêu cầu tại Đặt hẹn → Tạo cuộc hẹn.'],
]

export default function GiuDo({ tin }) {
  const { user, loading } = useAuth()
  const viTri = useLocation()
  const dieuHuong = useNavigate()
  const [mo, datMo] = useState(false)

  function moChonTin() {
    if (!user) {
      dieuHuong('/dang-nhap', { state: { from: viTri.pathname + viTri.search, authMessage: 'Vui lòng đăng nhập để báo cho người mất đồ.' } })
      return
    }
    datMo(true)
  }

  return <>
    <button type="button" aria-haspopup="dialog" onClick={moChonTin} disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-900 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-50 sm:w-auto">
      <MessageSquare className="h-4 w-4" aria-hidden="true" />Tôi đang giữ đồ này
    </button>
    {mo && <ChonTinGiuDo tin={tin} khiDong={() => datMo(false)} />}
  </>
}

function ChonTinGiuDo({ tin, khiDong }) {
  const { danhSach, meta, dangTai, loiTai, tinDaChon, tinXacNhan, thaoTac, dangGui, loiGui,
    chonTin, chuyenTrang, taiLai, dongHopThoai, moXacNhanGui, guiThongBao } = useGiuDo(tin.id, khiDong)
  const nutQuayLai = useRef(null)
  const laHuy = thaoTac === 'huy'
  const tieuDe = laHuy ? 'Xác nhận hủy' : thaoTac ? 'Xác nhận gửi thông báo' : 'Chọn tin nhặt được'
  const moTa = laHuy ? 'Bạn có muốn dừng thao tác và đóng hộp chọn tin?' : thaoTac
    ? 'Xác nhận đây là đồ của người báo mất. Hai bên sẽ được đặt lịch ngay, không qua admin.'
    : undefined
  const lopNutPhu = 'min-h-12 rounded-xl border border-[#ceded3] bg-white px-5 py-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-50'

  useEffect(function tapTrungNutQuayLai() {
    if (thaoTac) nutQuayLai.current?.focus()
  }, [thaoTac])

  return <HopThoai rong tieuDe={tieuDe} moTa={moTa} khiDong={dongHopThoai}
    tuyChonTieuDe={!thaoTac && <HuongDanThaoTac
      chiBieuTuong
      tieuDe="Hướng dẫn báo tìm thấy đồ"
      cacBuoc={cacBuocGiuDo}
      ghiChu="Nếu chưa có tin nhặt được, bạn có thể đăng tin rồi quay lại gửi thông báo. Nếu hai bên đã thống nhất giờ và địa điểm, dùng Tạo lịch hẹn trả đồ ngay trên tin báo mất."
    />}
  >
    {thaoTac ? <div className="space-y-5 p-5 sm:p-7" aria-busy={dangGui}>
      {!laHuy && <dl className="grid gap-4 rounded-2xl bg-emerald-50 p-4 text-sm sm:grid-cols-2 sm:p-5">
        <div className="min-w-0 wrap-break-word"><dt className="font-semibold text-emerald-900">Tin báo mất</dt><dd className="mt-1 text-[#526c5b]">{tin.title}</dd></div>
        <div className="min-w-0 wrap-break-word"><dt className="font-semibold text-emerald-900">Tin nhặt được sẽ gửi</dt><dd className="mt-1 text-[#526c5b]">{tinXacNhan?.title}</dd><dd className="mt-1 text-xs text-[#607568]">{tinXacNhan?.referenceCode}</dd></div>
      </dl>}
      {loiGui && <p role="alert" className="text-sm text-rose-700">{loiGui}</p>}
      <div className="flex flex-wrap justify-end gap-3">
        <button ref={nutQuayLai} type="button" onClick={dongHopThoai} disabled={dangGui} className={lopNutPhu}>Quay lại</button>
        {laHuy ? <Button onClick={khiDong}>Xác nhận hủy</Button> : <Button onClick={guiThongBao} disabled={dangGui}>{dangGui ? 'Đang gửi…' : 'Xác nhận gửi'}</Button>}
      </div>
    </div> : <form onSubmit={moXacNhanGui} className="space-y-5 p-5 sm:p-7" aria-busy={dangTai}>
      {dangTai && <p role="status" className="text-sm text-[#607568]">Đang tải tin nhặt được…</p>}
      {loiTai && <div className="space-y-2 text-sm"><p role="alert" className="text-rose-700">{loiTai}</p><Button onClick={taiLai}>Thử lại</Button></div>}
      {danhSach?.length === 0 && <p role="status" className="text-sm text-[#526c5b]">Chưa có tin nhặt được phù hợp.</p>}
      {danhSach?.length > 0 && <fieldset className="space-y-3">
        <legend className="mb-3 text-base font-semibold text-emerald-950">Tin nhặt được của bạn</legend>
        {danhSach.map((muc) => <div key={muc.id} className="flex items-center gap-3 rounded-xl border border-[#ceded3] p-3 hover:bg-emerald-50 has-checked:border-emerald-700 has-checked:bg-emerald-50 sm:p-4">
          <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
            <input type="radio" name="tinNhatId" value={muc.id} checked={tinDaChon === String(muc.id)} onChange={(suKien) => chonTin(suKien.target.value)} className="mt-1 shrink-0 accent-emerald-800" />
            <span className="min-w-0 wrap-break-word text-sm text-emerald-950">
              <span className="block font-semibold">{muc.title}</span>
              <span className="mt-1 block text-xs leading-5 text-[#607568]">{[muc.referenceCode, dinhDangNgay(muc.date), muc.locationDetail || muc.location].filter(Boolean).join(' · ')}</span>
            </span>
          </label>
          <Link to={`/chi-tiet-tin-dang?id=${muc.id}`} target="_blank" rel="noopener" aria-label={`Xem chi tiết ${muc.title} (mở trong tab mới)`} className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg bg-white px-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-700">
            Xem chi tiết <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>)}
        {meta.tongTrang > 1 && <PhanTrang {...meta} chuyenTrang={chuyenTrang} nhanDieuHuong="Phân trang tin nhặt được" hienThongKe={false} />}
      </fieldset>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e1eae4] pt-4">
        <Link to="/dang-tin?loaiTin=found" className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-emerald-800 hover:underline focus-visible:outline-2"><Plus className="h-4 w-4" aria-hidden="true" />Đăng tin nhặt được</Link>
        <div className="ml-auto flex flex-wrap justify-end gap-3">
          <button type="button" onClick={dongHopThoai} className={lopNutPhu}>Hủy</button>
          {danhSach?.length > 0 && <Button type="submit" disabled={!tinXacNhan}>Gửi thông báo</Button>}
        </div>
      </div>
    </form>}
  </HopThoai>
}
