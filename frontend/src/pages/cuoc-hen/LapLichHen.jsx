import { CalendarDays, ChevronDown, ClipboardCheck, SearchX } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, Navigate, Outlet, useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import Button from '../../components/shared/Button'
import FormField from '../../components/shared/FormField'
import HopThoai from '../../components/shared/HopThoai'
import ThongBaoTrong from '../../components/shared/ThongBaoTrong'
import useDanhMuc from '../../components/shared/hooks/useDanhMuc'
import useThongBaoThaoTac from '../../components/shared/hooks/useThongBaoThaoTac'
import api, { prepareCsrf } from '../../services/api'
import { chuanHoaTimKiem } from '../danh-sach-do/hooks/xuLyDanhSachDo.js'
import useChiTietTinDang from '../tin-dang/hooks/useChiTietTinDang'
import FormCuocHen from './FormCuocHen'
import KhungCuocHen from './KhungCuocHen'
import useDanhSachYeuCauHen from './hooks/useDanhSachYeuCauHen'
import useChiTietYeuCau from './hooks/useChiTietYeuCau'
import dinhDangGioHen from './dinhDangGioHen'
import { daXacNhanBanGiao } from './xuLyTienDoYeuCau'

const CAC_BUOC_DIEN_LICH = [
  ['Điền thông tin lịch gặp.', 'Ở Bước 2 / 2, mở Thông tin cuộc hẹn để kiểm tra tin đăng, tên và vai trò. Chọn ngày, giờ Việt Nam và địa điểm đã thống nhất, rồi bấm Xác nhận tạo lịch.'],
  ['Lưu mã bàn giao.', 'Mã 6 số chỉ hiện một lần sau khi tạo lịch. Người còn lại nhận thông báo kèm đường dẫn đến cuộc hẹn. Sau khi giao nhận đồ, đưa mã cho người đó để xác nhận.'],
]

const HUONG_DAN_TAO_LICH = {
  goiY: 'Bạn có thể đọc hướng dẫn trước khi tạo cuộc hẹn.',
  tieuDe: 'Hướng dẫn tạo cuộc hẹn',
  cacBuoc: [
    ['Chọn yêu cầu đã duyệt.', 'Tại Đặt hẹn → Tạo cuộc hẹn, chọn yêu cầu rồi bấm Xác nhận và tiếp tục. Cả người giữ đồ và người nhận đều có thể tạo lịch.'],
    ...CAC_BUOC_DIEN_LICH,
  ],
}

const HUONG_DAN_TRA_DO = {
  ...HUONG_DAN_TAO_LICH,
  cacBuoc: [
    ['Mở lịch từ tin báo mất.', 'Nếu đang giữ món đồ, hãy liên hệ chủ tin để thống nhất giờ và địa điểm. Bấm Tạo lịch hẹn trả đồ để vào thẳng Bước 2 / 2. Chủ tin là người nhận đồ.'],
    ...CAC_BUOC_DIEN_LICH,
  ],
}

export default function LapLichHen() {
  const nguonYeuCau = useDanhSachYeuCauHen()
  const [yeuCauIdDaChon, datYeuCau] = useState(null)
  const [params] = useSearchParams()
  const idDangChon = params.get('yeuCau') ?? yeuCauIdDaChon ?? params.get('yeuCauId')
  const chonSan = nguonYeuCau.danhSach.find((muc) => String(muc.id) === String(idDangChon))
  const yeuCau = chonSan ? {
    id: chonSan.id, ma: `YC-${String(chonSan.id).padStart(4, '0')}`, ten: chonSan.tin_dang.tieu_de,
    vaiTro: chonSan.laNguoiGiu ? 'Bạn là người giữ đồ' : 'Bạn là người nhận đồ', nguoiConLai: chonSan.lienHe?.hoTen,
  } : null
  const [tuKhoa, datTuKhoa] = useState('')

  return (
    <KhungCuocHen rong tieuDe="Tạo cuộc hẹn" huongDan={HUONG_DAN_TAO_LICH}>
      <Outlet context={{ yeuCau, datYeuCau, tuKhoa, datTuKhoa, ...nguonYeuCau }} />
    </KhungCuocHen>
  )
}

export function ChonYeuCauHen() {
  const { yeuCau, datYeuCau, tuKhoa, datTuKhoa, danhSach, dangTai, loi, taiLai } = useOutletContext()
  const dieuHuong = useNavigate()
  const vungCuon = useRef(null)
  const [yeuCauDangXem, datYeuCauDangXem] = useState(null)
  const tuKhoaChuan = chuanHoaTimKiem(tuKhoa)
  const ketQua = danhSach.map((muc) => ({
    id: muc.id,
    ma: `YC-${String(muc.id).padStart(4, '0')}`,
    ten: muc.tin_dang.tieu_de,
    vaiTro: muc.laNguoiGiu ? 'Bạn là người giữ đồ' : 'Bạn là người nhận đồ',
    nguoiConLai: muc.lienHe?.hoTen,
  })).filter((muc) => chuanHoaTimKiem(`${muc.ma} ${muc.ten}`).includes(tuKhoaChuan))
  const dangChon = ketQua.find((muc) => muc.id === yeuCau?.id)

  function doiTuKhoa(suKien) {
    datTuKhoa(suKien.target.value)
    vungCuon.current?.scrollTo(0, 0)
  }

  function dongChiTietYeuCau() {
    datYeuCauDangXem(null)
  }

  function xacNhanYeuCau(suKien) {
    suKien.preventDefault()
    if (dangTai || !dangChon) return
    datYeuCau(dangChon.id)
    dieuHuong('thong-tin')
  }

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <div className="border-b border-emerald-100 px-5 py-4 sm:px-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-800">Bước 1 / 2</p>
        <h2 className="flex items-center gap-2 text-xl font-bold text-emerald-950"><ClipboardCheck className="size-5 text-emerald-800" aria-hidden="true" /> Chọn yêu cầu đã duyệt</h2>
        <p className="mt-2 text-sm text-[#526c5b]">Chọn một yêu cầu để đặt lịch bàn giao.</p>
      </div>
      <div role="search" aria-label="Tra cứu yêu cầu đã duyệt" className="px-5 pt-5 sm:px-7 sm:pt-6">
        <FormField label="Tìm yêu cầu" type="search" name="tuKhoaYeuCau" value={tuKhoa} onChange={doiTuKhoa} placeholder="Nhập tên đồ hoặc mã yêu cầu…" />
      </div>
      <form onSubmit={xacNhanYeuCau}>
        <div className="px-5 py-4 sm:px-7">
          {dangTai && <p role="status" className="p-8 text-center text-sm text-[#526c5b]">Đang tải yêu cầu…</p>}
          {loi && <div className="space-y-3 p-8 text-center"><p role="alert" className="text-sm text-rose-700">{loi}</p><Button onClick={taiLai}>Thử lại</Button></div>}
          {!dangTai && !loi && (ketQua.length ? (
            <div ref={vungCuon} role="region" aria-label="Danh sách yêu cầu đã duyệt" tabIndex={0} className="max-h-96 overflow-y-auto overscroll-contain rounded-2xl border border-[#d6e4db] bg-[#f5f9f6] p-3 focus-visible:outline-2 focus-visible:outline-emerald-700 [scrollbar-gutter:stable] sm:p-4">
              <fieldset className="space-y-3">
                <legend className="sr-only">Yêu cầu đã duyệt</legend>
                {ketQua.map((muc) => (
                  <div key={muc.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-[#ceded3] bg-white p-4 hover:bg-emerald-50 has-checked:border-emerald-700 has-checked:bg-emerald-50 sm:flex-nowrap sm:gap-4">
                    <label className="flex min-w-0 basis-full cursor-pointer items-start gap-3 sm:flex-1">
                      <input type="radio" name="yeuCau" value={muc.id} checked={dangChon?.id === muc.id} onChange={() => datYeuCau(muc.id)} className="mt-1.5 shrink-0 accent-emerald-800" />
                      <span className="min-w-0">
                        <span className="block font-semibold text-emerald-950">{muc.ten}</span>
                        <span className="mt-1 block text-sm leading-5 text-[#526c5b]">{muc.ma} · {muc.vaiTro}</span>
                      </span>
                    </label>
                    <div className="ml-6 flex flex-wrap items-center gap-2 sm:ml-0 sm:shrink-0">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-900">Đã duyệt</span>
                      <button type="button" onClick={() => datYeuCauDangXem(muc)} aria-label={`Xem chi tiết yêu cầu ${muc.ma}`} aria-haspopup="dialog" className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-700">Xem chi tiết</button>
                    </div>
                  </div>
                ))}
              </fieldset>
            </div>
          ) : (
            <ThongBaoTrong
              bieuTuong={SearchX}
              tieuDe={danhSach.length ? 'Không tìm thấy yêu cầu' : 'Chưa có yêu cầu có thể đặt lịch'}
              moTa={danhSach.length ? 'Thử nhập tên đồ hoặc mã yêu cầu khác.' : 'Yêu cầu nhận lại đồ đã duyệt sẽ hiển thị tại đây khi có thể đặt lịch.'}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-3xl border-t border-[#e1eae4] bg-[#f9fbfa] px-5 py-4 sm:px-7">
          {dangChon && <p className="text-sm font-semibold text-emerald-900">Đã chọn {dangChon.ten} · {dangChon.ma}</p>}
          <Button type="submit" disabled={dangTai || !dangChon} className="ml-auto">Xác nhận và tiếp tục</Button>
        </div>
      </form>
      {yeuCauDangXem && (
        <HopThoai tieuDe="Chi tiết yêu cầu" khiDong={dongChiTietYeuCau}>
          <div className="space-y-4 p-5 sm:p-6">
            <h3 className="text-lg font-bold text-emerald-950">{yeuCauDangXem.ten}</h3>
            <dl className="grid gap-4 rounded-xl bg-emerald-50 p-4 text-sm sm:grid-cols-2">
              <div><dt className="font-semibold text-emerald-950">Mã yêu cầu</dt><dd>{yeuCauDangXem.ma}</dd></div>
              <div><dt className="font-semibold text-emerald-950">Trạng thái</dt><dd>Đã duyệt</dd></div>
              <div><dt className="font-semibold text-emerald-950">Vai trò của bạn</dt><dd>{yeuCauDangXem.vaiTro}</dd></div>
              <div><dt className="font-semibold text-emerald-950">Người còn lại</dt><dd>{yeuCauDangXem.nguoiConLai || 'Chưa có thông tin'}</dd></div>
            </dl>
            <div className="flex flex-wrap items-center justify-end gap-4">
              <Link to={`/chi-tiet-yeu-cau?id=${yeuCauDangXem.id}`} className="text-sm font-semibold text-emerald-800 hover:underline">Mở trang chi tiết</Link>
              <Button onClick={dongChiTietYeuCau}>Đóng</Button>
            </div>
          </div>
        </HopThoai>
      )}
    </section>
  )
}

export function NhapThongTinLichHen() {
  const { yeuCau, dangTai, loi, taiLai } = useOutletContext()
  return <ThongTinLichHen yeuCau={yeuCau} dangTaiNguon={dangTai} loiNguon={loi} taiLaiNguon={taiLai} />
}

export function LapLichTraDo() {
  const { tinId } = useParams()
  const { tin, dangTai, loi, taiLai } = useChiTietTinDang(tinId)

  return (
    <KhungCuocHen rong tieuDe="Tạo cuộc hẹn" huongDan={HUONG_DAN_TRA_DO}>
      <ThongTinLichHen key={tinId} tinId={tinId} tin={tin} dangTaiNguon={dangTai} loiNguon={loi} taiLaiNguon={taiLai} />
    </KhungCuocHen>
  )
}

function ThongTinLichHen({ yeuCau, tinId, tin, dangTaiNguon, loiNguon, taiLaiNguon }) {
  const { user } = useAuth()
  const dieuHuong = useNavigate()
  const hienThongBao = useThongBaoThaoTac()
  const { diaDiem, dangTai, loiTai, taiLai } = useDanhMuc()
  const khoaGui = useRef(false)
  const [dangGui, datDangGui] = useState(false)
  const [loiGui, datLoiGui] = useState(null)
  const [lichDaTao, datLichDaTao] = useState(null)
  const { yc } = useChiTietYeuCau(lichDaTao?.yeuCauId)
  const hen = yc?.cuoc_hen?.find((muc) => muc.id === lichDaTao?.cuocHenId)
  const daBanGiao = daXacNhanBanGiao(hen)
  const daHuy = hen?.trang_thai === 'da_huy'
  const duongDanQuayLai = tinId ? `/chi-tiet-tin-dang?id=${tinId}` : '/cuoc-hen/tao'

  async function taoCuocHen({ ngay, gio, diaDiem: noiGap }) {
    if (khoaGui.current || !(yeuCau || tin?.coTheTaoLichTraDo) || !noiGap) return
    khoaGui.current = true
    datDangGui(true)
    datLoiGui(null)
    try {
      await prepareCsrf()
      const lich = { diaDiemId: noiGap.id, thoiGianHen: `${ngay} ${gio}` }
      const { data } = tinId
        ? await api.post(`/tin-dang/${tin.id}/lich-tra-do`, lich)
        : await api.post('/me/cuoc-hen', { ...lich, yeuCauId: yeuCau.id })
      datLichDaTao(data.data)
      if (!tinId) taiLaiNguon()
    } catch (loi) {
      const phanHoi = loi.response?.data
      const lichCu = tinId ? phanHoi?.data : phanHoi
      if (loi.response?.status === 409 && lichCu?.daCoLich) {
        const duongDan = `/chi-tiet-yeu-cau?id=${lichCu.yeuCauId}&tab=lich-hen&cuocHen=${lichCu.cuocHenId}`
        hienThongBao('Yêu cầu đã có cuộc hẹn. Bạn đang xem lịch đã lưu.', 'info', duongDan)
        return
      }
      datLoiGui({
        noiDung: Object.values(phanHoi?.errors || {}).flat()[0] || phanHoi?.message || 'Chưa thể tạo cuộc hẹn. Vui lòng thử lại.',
        xemLich: Boolean(yeuCau) && loi.response?.status === 409,
      })
    } finally {
      khoaGui.current = false
      datDangGui(false)
    }
  }

  if (lichDaTao) return (
    <section aria-label="Kết quả tạo cuộc hẹn" className="space-y-5 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-xl font-bold text-emerald-950">Đã tạo cuộc hẹn</h2>
      <p className="text-sm text-[#526c5b]">{dinhDangGioHen(lichDaTao.gioHen)} · {lichDaTao.diaDiem}</p>
      {daBanGiao ? <p role="status" className="rounded-xl bg-emerald-50 p-4 font-semibold text-emerald-950">Hai bên đã xác nhận bàn giao thành công.</p>
        : daHuy ? <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{hen.ly_do_huy || 'Cuộc hẹn đã bị hủy.'}</p>
          : <>
            <div className="rounded-xl bg-emerald-50 p-4 text-emerald-950">
              <p className="text-sm font-semibold">Mã bàn giao</p>
              <p className="mt-1 font-mono text-3xl tracking-widest">{lichDaTao.ma}</p>
            </div>
            <p className="text-sm leading-6 text-[#526c5b]">Mã chỉ hiện một lần. Hãy lưu lại và đưa cho người còn lại sau khi giao nhận đồ. Mã dùng từ giờ hẹn đến {dinhDangGioHen(lichDaTao.hetHanLuc)}.</p>
          </>}
      <Link to={`/chi-tiet-yeu-cau?id=${lichDaTao.yeuCauId}&tab=lich-hen`} className="font-semibold text-emerald-800 hover:underline">Xem chi tiết cuộc hẹn</Link>
    </section>
  )

  if (dangTaiNguon) return <p role="status" className="rounded-2xl bg-white p-6 text-sm text-[#526c5b]">{tinId ? 'Đang tải tin báo mất…' : 'Đang tải yêu cầu đã chọn…'}</p>
  if (loiNguon) return <div role="alert" className="space-y-3 rounded-2xl bg-white p-6 text-sm text-rose-700"><p>{loiNguon}</p><Button onClick={taiLaiNguon}>Thử lại</Button></div>
  if (tinId && !tin?.coTheTaoLichTraDo) return (
    <div className="space-y-3 rounded-2xl bg-white p-6 text-sm">
      <p role="alert" className="text-rose-700">{tin ? 'Tin này hiện không thể tạo lịch trả đồ.' : 'Không tìm thấy tin báo mất.'}</p>
      <Link to={duongDanQuayLai} className="font-semibold text-emerald-800 hover:underline">Quay lại tin đăng</Link>
    </div>
  )
  if (!tinId && !yeuCau) return <Navigate to="/cuoc-hen/tao" replace />

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <div className="border-b border-emerald-100 px-5 py-4 sm:px-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-800">Bước 2 / 2</p>
        <h2 className="flex items-center gap-2 text-xl font-bold text-emerald-950"><CalendarDays className="size-5 text-emerald-800" aria-hidden="true" /> Điền thông tin lịch gặp</h2>
        <details className="group mt-4 rounded-xl border border-[#d6e4db] bg-[#f9fbfa]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-700 [&::-webkit-details-marker]:hidden">
            Thông tin cuộc hẹn
            <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="space-y-3 border-t border-[#d6e4db] px-4 py-3 text-sm text-[#526c5b]">
            <dl className="space-y-2">
              <div><dt className="inline font-semibold text-emerald-950">Tin đăng:</dt><dd className="ml-2 inline">{tinId ? tin.title : yeuCau.ten}</dd></div>
              {yeuCau && <div><dt className="inline font-semibold text-emerald-950">Mã yêu cầu:</dt><dd className="ml-2 inline">{yeuCau.ma}</dd></div>}
              <div><dt className="inline font-semibold text-emerald-950">Bạn:</dt><dd className="ml-2 inline">{user?.ho_ten || 'Chưa có thông tin'}</dd></div>
              <div><dt className="inline font-semibold text-emerald-950">Vai trò của bạn:</dt><dd className="ml-2 inline">{tinId ? 'Người giữ đồ' : yeuCau.vaiTro}</dd></div>
              <div><dt className="inline font-semibold text-emerald-950">{tinId ? 'Người nhận đồ' : 'Người còn lại'}:</dt><dd className="ml-2 inline">{(tinId ? tin.contactPerson : yeuCau.nguoiConLai) || 'Chưa có thông tin'}</dd></div>
            </dl>
            <p>Hãy thống nhất giờ và địa điểm trước khi tạo lịch.</p>
          </div>
        </details>
      </div>
      {dangTai && <p role="status" className="px-5 pt-4 text-sm text-[#526c5b] sm:px-7">Đang tải địa điểm…</p>}
      {loiTai && <div className="flex flex-wrap items-center gap-3 px-5 pt-4 text-sm text-rose-700 sm:px-7"><p role="alert">Không tải được địa điểm.</p><Button onClick={taiLai}>Thử lại</Button></div>}
      {loiGui && <div className="space-y-2 px-5 pt-4 text-sm sm:px-7">
        <p role="alert" className="text-rose-700">{loiGui.noiDung}</p>
        {loiGui.xemLich && <Link to={`/chi-tiet-yeu-cau?id=${yeuCau.id}&tab=lich-hen`} className="font-semibold text-emerald-800 hover:underline">Xem lịch hẹn của yêu cầu</Link>}
      </div>}
      <FormCuocHen
        cacDiaDiem={diaDiem.map((muc) => ({ id: String(muc.id), ten: muc.name }))}
        khiXemLai={taoCuocHen}
        dangGui={dangGui}
        khiHuy={() => dieuHuong(duongDanQuayLai)}
        nhanXemLai="Xác nhận tạo lịch"
        nhanHuy="Quay lại"
      />
    </section>
  )
}
