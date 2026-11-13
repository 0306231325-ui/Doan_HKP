import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Inbox, RefreshCw } from 'lucide-react'
import { nut, nhan, useDuLieu } from './duLieuYeuCau'
import { NhanTrangThai, PhanTrang } from './ThanhPhanYeuCau'
import HoSoYeuCau from './HoSoYeuCau'
import BoLocLoaiDo from './BoLocLoaiDo'
import TheTinYeuCau from './TheTinYeuCau'
import ChiTietTinPopup from './ChiTietTinPopup'

export default function YeuCauNhanLai() {
  const khungDanhSach = useRef(null)
  const [moTin, datMoTin] = useState(false)
  const [trangThaiNhom, datTrangThaiNhom] = useState('')
  const [danhMucId, datDanhMucId] = useState('')
  const [tuKhoa, datTuKhoa] = useState('')
  const [trang, datTrang] = useState(1)
  const [doVat, datDoVat] = useState(null)
  const [trangHoSo, datTrangHoSo] = useState(1)
  const [loc, datLoc] = useState('')
  const [maHoSo, datMaHoSo] = useState(null)
  const [lanTai, datLanTai] = useState(0)
  const danhMuc = useDuLieu('/admin/danh-muc', {}, lanTai)
  const nhom = useDuLieu('/admin/yeu-cau', { nhom: 1, trangThaiNhom: trangThaiNhom || undefined, danhMucId: danhMucId || undefined, tuKhoa: tuKhoa || undefined, page: trang }, lanTai)
  const hoSo = useDuLieu(doVat ? '/admin/yeu-cau' : null, { tinDangId: doVat?.tin_dang_id, trangThai: loc || undefined, page: trangHoSo }, lanTai)
  const cacNhom = nhom.data?.data
  const cacHoSo = hoSo.data?.data
  const tinHienTai = cacHoSo?.data[0]?.tin_dang || doVat?.tin_dang
  const dangBanGiao = tinHienTai?.trang_thai === 'cho_ban_giao'
  const daDong = tinHienTai?.trang_thai === 'da_hoan_tat'
  const boLocTrangThai = daDong
    ? ['nhom_da_duyet', 'da_dong', 'tu_choi', 'da_huy']
    : dangBanGiao
      ? ['nhom_da_duyet', 'tam_cho_ban_giao', 'tu_choi', 'da_huy']
      : ['san_sang_duyet', 'tu_choi', 'da_huy']
  function chonDo(nhomDo) { datDoVat(nhomDo); datTrangHoSo(1); datLoc(''); datMaHoSo(null) }
  function doiTrangDanhSach(value) {
    datTrang(value)
    khungDanhSach.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  function doiTrangHoSo(value) { datTrangHoSo(value); datMaHoSo(null) }

  return <div className="space-y-5">

    {!doVat ? <>
      <div className="flex justify-end"><button type="button" className={nut} onClick={() => datLanTai((n) => n + 1)}><RefreshCw size={16} />Làm mới</button></div>
      <BoLocLoaiDo trangThai={trangThaiNhom} khiLocTrangThai={(value) => { datTrangThaiNhom(value); datTrang(1) }} danhSach={danhMuc.data?.data || []} giaTri={danhMucId} khiChon={(id) => { datDanhMucId(id); datTrang(1) }} loi={danhMuc.loi} tuKhoa={tuKhoa} khiTimKiem={(value) => { datTuKhoa(value); datTrang(1) }} />
      <section ref={khungDanhSach} className="scroll-mt-24 overflow-hidden rounded-2xl border border-[#d6e4db] bg-white"><div className="flex flex-wrap items-center justify-between gap-4 p-5"><div><h3 className="font-bold text-[#243c30]">Đồ vật có yêu cầu <span className="ml-2 text-sm font-normal text-[#718276]">{cacNhom?.total ?? '…'}</span></h3></div></div>
        {nhom.loi ? <p role="alert" className="p-8 text-rose-700">{nhom.loi}</p> : !cacNhom ? <p role="status" className="p-10 text-center text-sm text-[#718276]">Đang tải đồ vật…</p> : !cacNhom.data.length ? <Trong /> : <div className="grid grid-cols-1 gap-5 px-5 pb-5 sm:grid-cols-2 lg:grid-cols-3">{cacNhom.data.map((n) => <TheTinYeuCau key={n.tin_dang_id} nhom={n} khiChon={() => chonDo(n)} />)}</div>}
        <PhanTrang duLieu={cacNhom} trang={trang} doiTrang={doiTrangDanhSach} />
      </section>
    </> : <>
      <header className="flex flex-col gap-4 py-1 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="min-w-0 space-y-2">
          <button type="button" onClick={() => { datDoVat(null); datMaHoSo(null); datMoTin(false) }} className="inline-flex min-h-9 items-center gap-2 rounded-lg text-sm font-medium text-[#607568] transition-colors hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><ArrowLeft size={16} />Danh sách đồ vật</button>
          <div className="flex min-w-0 items-center gap-3">
            <img src={doVat.anh_bia || '/do-vat-trong.svg'} alt="" onError={(e) => { if (!e.currentTarget.src.endsWith('/do-vat-trong.svg')) e.currentTarget.src = '/do-vat-trong.svg' }} className="h-12 w-12 shrink-0 rounded-lg bg-white object-cover" />
            <div className="min-w-0"><h3 className="break-words text-lg font-bold leading-7 text-[#243c30]">{doVat.tin_dang?.tieu_de || 'Tin không còn hiển thị'}</h3></div>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 lg:pt-9">
          <button type="button" aria-haspopup="dialog" onClick={() => datMoTin(true)} className={`${nut} min-h-10`}>Xem tin đăng<ArrowRight size={15} /></button>
          <button type="button" onClick={() => datLanTai((n) => n + 1)} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#607568] transition-colors hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-700"><RefreshCw size={15} />Làm mới</button>
        </div>
      </header>
      <div className="grid items-start gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <section className="overflow-hidden rounded-2xl border border-[#d6e4db] bg-white"><div className="space-y-3 border-b border-[#e8efea] p-4"><h3 className="font-bold text-[#243c30]">Người yêu cầu</h3><label className="block"><span className="sr-only">Lọc trạng thái hồ sơ</span><select value={loc} onChange={(e) => { datLoc(e.target.value); doiTrangHoSo(1) }} className="w-full rounded-xl border border-[#d6e4db] p-2.5 text-sm"><option value="">Tất cả hồ sơ</option>{boLocTrangThai.map((s) => <option key={s} value={s}>{nhan[s] || 'Từ chối / Đã hủy'}</option>)}</select></label></div>
          {hoSo.loi ? <p role="alert" className="p-5 text-sm text-rose-700">{hoSo.loi}</p> : !cacHoSo ? <p role="status" className="p-8 text-sm text-[#718276]">Đang tải hồ sơ…</p> : !cacHoSo.data.length ? <Trong /> : <div className="max-h-[650px] divide-y divide-[#edf2ee] overflow-y-auto">{cacHoSo.data.map((y) => <button key={y.id} aria-pressed={maHoSo === y.id} onClick={() => datMaHoSo(y.id)} className={`block w-full border-l-4 p-4 text-left transition hover:bg-emerald-50 ${maHoSo === y.id ? 'border-emerald-800 bg-emerald-50' : 'border-transparent'}`}><p className="text-xs text-[#718276]">YC-{String(y.id).padStart(4, '0')}</p><p className="mb-2 mt-1 font-bold text-[#243c30]">{y.nguoi_yeu_cau?.ho_ten || 'Tài khoản đã xóa'}</p><NhanTrangThai yc={y} /></button>)}</div>}
          <PhanTrang duLieu={cacHoSo} trang={trangHoSo} doiTrang={doiTrangHoSo} />
        </section>
        {maHoSo ? <HoSoYeuCau key={maHoSo} id={maHoSo} lanTai={lanTai} khiCapNhat={() => { datLoc(''); datTrangHoSo(1); datLanTai((n) => n + 1) }} /> : <section className="rounded-2xl border border-dashed border-[#cbded0] bg-white p-12 text-center"><Inbox size={36} className="mx-auto mb-4 text-[#8aab95]" /><h3 className="font-bold text-[#315a43]">Chọn một hồ sơ để đối chiếu</h3></section>}
      </div>
    </>}
    {moTin && doVat && <ChiTietTinPopup key={doVat.tin_dang_id} id={doVat.tin_dang_id} khiDong={() => datMoTin(false)} />}
  </div>
}

function Trong() { return <div className="p-10 text-center text-sm text-[#718276]"><Inbox size={28} className="mx-auto mb-3 text-[#8aab95]" />Không có yêu cầu phù hợp.</div> }
