import { useRef, useState } from 'react'
import { CheckCheck, FileCheck2, ShieldCheck } from 'lucide-react'
import api, { prepareCsrf } from '../../../services/api'
import HopThoai from '../../../components/shared/HopThoai'
import { ngay, nut, loiApi, useDuLieu } from './duLieuYeuCau'

import { NhanTrangThai } from './ThanhPhanYeuCau'
import AnhDoiChieu from './AnhDoiChieu'

export default function HoSoYeuCau({ id, lanTai, khiCapNhat }) {
  const ketQua = useDuLieu(`/admin/yeu-cau/${id}`, {}, lanTai)
  if (ketQua.loi) return <p role="alert" className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-700">{ketQua.loi}</p>
  if (!ketQua.data) return <p role="status" className="rounded-2xl bg-white p-8 text-sm text-[#718276]">Đang tải thông tin đối chiếu…</p>
  return <NoiDungHoSo key={`${id}-${lanTai}`} yc={ketQua.data.data} khiCapNhat={khiCapNhat} />
}

function giaTri(answer) {
  const value = answer?.gia_tri_text ?? answer?.gia_tri_so ?? answer?.gia_tri_lua_chon
  return value === null || value === undefined || value === '' ? 'Chưa có thông tin' : typeof value === 'object' ? JSON.stringify(value) : String(value)
}

function NoiDungHoSo({ yc, khiCapNhat }) {
  const cauTraLoi = yc.tra_loi || []
  const [hanhDong, datHanhDong] = useState(yc.trang_thai === 'da_xac_minh' ? 'tu_choi' : 'da_xac_minh')
  const [ghiChu, datGhiChu] = useState('')
  const [xacNhan, datXacNhan] = useState(false)
  const [dangLuu, datDangLuu] = useState(false)
  const [loi, datLoi] = useState('')
  const khoaGui = useRef(false)
  const tin = yc.tin_dang
  const choDuyet = ['cho_kiem_tra', 'can_bo_sung'].includes(yc.trang_thai)
  const coTheXuLy = tin && tin.trang_thai !== 'da_hoan_tat' && choDuyet
  const choPhepDuyet = choDuyet && tin?.trang_thai === 'dang_mo' && cauTraLoi.length > 0
  const nguoi = yc.nguoi_yeu_cau
  const ngayGui = yc.created_at ? new Date(yc.created_at) : null
  const thoiGianGui = ngayGui && !Number.isNaN(ngayGui.getTime())
    ? `${ngayGui.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })} · ${ngayGui.toLocaleDateString('vi-VN')}`
    : 'Chưa có thông tin'
  async function luu(e) {
    e.preventDefault()
    if (hanhDong !== 'da_xac_minh' && !ghiChu.trim()) { datLoi('Vui lòng nhập lý do từ chối.'); return }
    if (khoaGui.current) return
    khoaGui.current = true; datDangLuu(true); datLoi('')
    try {
      await prepareCsrf()
      await api.patch(`/admin/yeu-cau/${yc.id}`, { hanhDong, ghiChu, ...(hanhDong === 'da_xac_minh' ? { xacNhanDoiChieu: true } : {}) })
      datXacNhan(false); khiCapNhat()
    } catch (error) { datLoi(loiApi(error)) }
    finally { khoaGui.current = false; datDangLuu(false) }
  }
  function moXacNhan(action) {
    if (dangLuu || (action === 'da_xac_minh' && !choPhepDuyet)) return
    datHanhDong(action); datGhiChu(''); datLoi(''); datXacNhan(true)
  }
  return <section className="min-w-0 overflow-hidden rounded-2xl border border-[#d6e4db] bg-white">
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e8efea] p-5"><div className="min-w-0"><h3 className="text-xl font-bold text-[#243c30]">{nguoi?.ho_ten || 'Tài khoản đã xóa'}</h3><p className="mt-2 break-words text-xs text-[#718276]">MSSV: {nguoi?.ma_so || 'Chưa có thông tin'}</p><p className="mt-1 text-xs text-[#718276]">Gửi lúc: {thoiGianGui}</p></div><NhanTrangThai yc={yc} /></div>
    <div className="space-y-6 p-5">
      {(yc.loi_nhan || yc.thoi_gian_mat || yc.dia_diem_mat_chi_tiet) && <div><h4 className="mb-2 flex items-center gap-2 font-bold text-[#315a43]"><FileCheck2 size={17} />Thông tin mất đồ</h4>{yc.loi_nhan && <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#607568]">{yc.loi_nhan}</p>}{yc.thoi_gian_mat && <p className="mt-2 text-xs text-[#718276]">Thời gian mất: {ngay(yc.thoi_gian_mat)}</p>}{yc.dia_diem_mat_chi_tiet && <p className="mt-2 text-xs text-[#718276]">Địa điểm: {yc.dia_diem_mat_chi_tiet}</p>}</div>}
      <div><h4 className="flex items-center gap-2 font-bold text-[#315a43]"><ShieldCheck size={17} />Đối chiếu thông tin</h4><div className="mt-3 space-y-3">{cauTraLoi.map((a, i) => <div key={a.id} className="rounded-xl border border-[#e1eae4] p-4"><p className="mb-3 text-sm font-semibold text-[#315a43]">{i + 1}. {a.loi_khai_tin_dang?.phien_ban_cau_hoi?.du_lieu?.noi_dung || 'Thông tin nhận dạng'}</p><div className="grid gap-3 text-sm sm:grid-cols-2"><div className="rounded-lg bg-[#f3f8f4] p-3"><p className="mb-1 text-xs text-[#718276]">Người giữ đồ khai báo</p><p className="whitespace-pre-wrap break-words text-[#315a43]">{giaTri(a.loi_khai_tin_dang)}</p></div><div className="rounded-lg bg-[#fafaf7] p-3"><p className="mb-1 text-xs text-[#718276]">Người xin nhận trả lời</p><p className="whitespace-pre-wrap break-words text-[#315a43]">{giaTri(a)}</p></div></div></div>)}{!cauTraLoi.length && <p className="text-sm text-[#718276]">Không có câu trả lời để đối chiếu. Không thể duyệt hồ sơ này.</p>}</div></div>
      <AnhDoiChieu yc={yc} />
      {yc.ghi_chu_admin && yc.trang_thai !== 'da_xac_minh' && <div className="rounded-xl bg-[#f3f8f4] p-4"><h4 className="mb-1 text-sm font-bold text-[#315a43]">Phản hồi đã gửi</h4><p className="whitespace-pre-wrap text-sm text-[#607568]">{yc.ghi_chu_admin}</p></div>}
      {coTheXuLy && <div className="flex flex-wrap gap-3 border-t border-[#e8efea] pt-5">
        {choDuyet && <button type="button" aria-haspopup="dialog" disabled={dangLuu || !choPhepDuyet} title={!choPhepDuyet ? 'Đồ vật phải còn mở và hồ sơ có thông tin đối chiếu.' : undefined} onClick={() => moXacNhan('da_xac_minh')} className={`${nut} !bg-emerald-900 !text-white`}><CheckCheck size={16} />Duyệt</button>}
        <button type="button" aria-haspopup="dialog" disabled={dangLuu} onClick={() => moXacNhan('tu_choi')} className={`${nut} !border-rose-200 !text-rose-700 hover:!bg-rose-50`}>{choDuyet ? 'Từ chối' : 'Thu hồi duyệt'}</button>
      </div>}

    </div>
    {xacNhan && <HopThoai tieuDe={hanhDong === 'da_xac_minh' ? 'Xác nhận duyệt' : choDuyet ? 'Xác nhận từ chối' : 'Xác nhận thu hồi duyệt'} khiDong={() => { if (!dangLuu) datXacNhan(false) }}>
      <form onSubmit={luu} className="space-y-4 p-5">
        <p className="text-sm leading-6 text-[#526c5b]">{hanhDong === 'da_xac_minh' ? `Bạn xác nhận đã đối chiếu toàn bộ thông tin và đồng ý duyệt ${nguoi?.ho_ten || 'người này'} nhận đồ? Các hồ sơ khác sẽ tạm dừng xét duyệt cho đến khi bàn giao xong.` : choDuyet ? `Bạn muốn từ chối yêu cầu của ${nguoi?.ho_ten || 'người này'}?` : 'Thu hồi quyết định duyệt? Lịch hẹn đang hoạt động sẽ bị hủy và đồ vật được mở để xét các hồ sơ khác.'}</p>
        {hanhDong !== 'da_xac_minh' && <label className="block text-sm font-medium text-[#526c5b]">{choDuyet ? 'Lý do từ chối' : 'Lý do thu hồi'}<textarea autoFocus required disabled={dangLuu} rows={3} maxLength={2000} value={ghiChu} onChange={(e) => datGhiChu(e.target.value)} placeholder="Nhập lý do…" className="mt-2 w-full rounded-xl border border-[#d6e4db] p-3 font-normal focus-visible:outline-2 focus-visible:outline-emerald-700" /></label>}
        {loi && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{loi}</p>}
        <div className="flex justify-end gap-2"><button type="button" className={nut} disabled={dangLuu} onClick={() => datXacNhan(false)}>Hủy</button><button type="submit" className={`${nut} ${hanhDong === 'da_xac_minh' ? '!bg-emerald-900 !text-white' : '!border-rose-700 !bg-rose-700 !text-white'}`} disabled={dangLuu}>{dangLuu ? 'Đang lưu…' : hanhDong === 'da_xac_minh' ? 'Xác nhận duyệt' : choDuyet ? 'Xác nhận từ chối' : 'Xác nhận thu hồi'}</button></div>
      </form>
    </HopThoai>}

  </section>
}
