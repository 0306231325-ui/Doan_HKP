import { CalendarDays, ClipboardCheck, SearchX } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, Navigate, Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import Button from '../../components/shared/Button'
import FormField from '../../components/shared/FormField'
import HopThoai from '../../components/shared/HopThoai'
import ThongBaoTrong from '../../components/shared/ThongBaoTrong'
import useDanhMuc from '../../components/shared/hooks/useDanhMuc'
import { chuanHoaTimKiem } from '../danh-sach-do/hooks/xuLyDanhSachDo.js'
import FormCuocHen from './FormCuocHen'
import KhungCuocHen from './KhungCuocHen'
import useDanhSachYeuCauHen from './hooks/useDanhSachYeuCauHen'

export default function LapLichHen() {
  const nguonYeuCau = useDanhSachYeuCauHen()
  const [yeuCau, datYeuCau] = useState(null)
  const [tuKhoa, datTuKhoa] = useState('')

  return (
    <KhungCuocHen rong tieuDe="Tạo cuộc hẹn" moTa="Người giữ đồ hoặc người nhận đều có thể tạo lịch theo giờ và địa điểm hai bên đã thống nhất.">
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

  function doiTuKhoa(suKien) {
    datTuKhoa(suKien.target.value)
    vungCuon.current?.scrollTo(0, 0)
  }

  function dongChiTietYeuCau() {
    datYeuCauDangXem(null)
  }

  function xacNhanYeuCau(suKien) {
    suKien.preventDefault()
    if (yeuCau) dieuHuong('thong-tin')
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
                      <input type="radio" name="yeuCau" value={muc.id} checked={yeuCau?.id === muc.id} onChange={() => datYeuCau(muc)} className="mt-1.5 shrink-0 accent-emerald-800" />
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
          {yeuCau && <p className="text-sm font-semibold text-emerald-900">Đã chọn {yeuCau.ten} · {yeuCau.ma}</p>}
          <Button type="submit" disabled={!yeuCau} className="ml-auto">Xác nhận và tiếp tục</Button>
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
  const { yeuCau } = useOutletContext()
  const dieuHuong = useNavigate()
  const { diaDiem, dangTai, loiTai, taiLai } = useDanhMuc()

  if (!yeuCau) return <Navigate to="/cuoc-hen/tao" replace />

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <div className="border-b border-emerald-100 px-5 py-4 sm:px-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-800">Bước 2 / 2</p>
        <h2 className="flex items-center gap-2 text-xl font-bold text-emerald-950"><CalendarDays className="size-5 text-emerald-800" aria-hidden="true" /> Điền thông tin lịch gặp</h2>
        <p className="mt-2 text-sm font-semibold text-[#526c5b]">{yeuCau.ten} · {yeuCau.ma}</p>
      </div>
      {dangTai && <p role="status" className="px-5 pt-4 text-sm text-[#526c5b] sm:px-7">Đang tải địa điểm…</p>}
      {loiTai && <div className="flex flex-wrap items-center gap-3 px-5 pt-4 text-sm text-rose-700 sm:px-7"><p role="alert">Không tải được địa điểm.</p><Button onClick={taiLai}>Thử lại</Button></div>}
      <p className="px-5 pt-4 text-sm text-[#526c5b] sm:px-7">Tính năng lưu cuộc hẹn đang được hoàn thiện.</p>
      <FormCuocHen
        cacDiaDiem={diaDiem.map((muc) => ({ id: String(muc.id), ten: muc.name }))}
        khiHuy={() => dieuHuong('/cuoc-hen/tao')}
        nhanXemLai="Xác nhận tạo lịch"
        nhanHuy="Quay lại"
      />
    </section>
  )
}
