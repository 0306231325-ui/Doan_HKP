import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { prepareCsrf } from '../../services/api'

const trangThai = { cho_kiem_tra: 'Chờ kiểm tra', can_bo_sung: 'Cần bổ sung', da_xac_minh: 'Đã duyệt', tu_choi: 'Từ chối', da_huy: 'Đã hủy' }
export default function TheoDoiYeuCau() {
  const [ketQua, datKetQua] = useState(null)
  const [trang, datTrang] = useState(1)
  const [loi, datLoi] = useState('')
  const [dangLuu, datDangLuu] = useState(false)
  const [boSung, datBoSung] = useState({})
  const [lanTai, datLanTai] = useState(0)
  useEffect(() => {
    const abort = new AbortController()
    api.get('/me/yeu-cau', { params: { page: trang }, signal: abort.signal }).then(({ data }) => { if (!abort.signal.aborted) datKetQua(data.data) }).catch(() => { if (!abort.signal.aborted) datLoi('Không tải được yêu cầu.') })
    return () => abort.abort()
  }, [trang, lanTai])
  async function gui(id) {
    datDangLuu(true); datLoi('')
    try {
      await prepareCsrf()
      await api.post(`/me/yeu-cau/${id}/bo-sung`, { noiDung: boSung[id] })
      datLanTai(lanTai + 1); datBoSung({ ...boSung, [id]: '' })
    } catch (e) { datLoi(e.response?.data?.message || 'Không gửi được thông tin.') }
    finally { datDangLuu(false) }
  }
  return <div className="mx-auto max-w-4xl space-y-5"><header className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-3xl font-extrabold text-emerald-900">Theo dõi yêu cầu</h1><p className="mt-3 text-sm text-[#607568]">Theo dõi xét duyệt, liên hệ và thống nhất lịch giao nhận đồ.</p></div><button className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm" onClick={() => datLanTai(lanTai + 1)}>Tải lại</button></header>{loi && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-rose-700">{loi}</p>}{!ketQua && !loi && <p role="status">Đang tải…</p>}{ketQua?.data.map((y) => <section key={y.id} className="space-y-4 rounded-2xl border border-[#d6e4db] bg-white p-6"><div className="flex flex-wrap justify-between gap-3"><Link className="font-bold text-emerald-900 hover:underline" to={`/chi-tiet-tin-dang?id=${y.tin_dang_id}`}>{y.tin_dang?.tieu_de || 'Tin đã xóa'}</Link><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-800">{y.tin_dang?.trang_thai === 'da_hoan_tat' ? 'Đã trả đồ' : trangThai[y.trang_thai]}</span></div><p className="text-xs text-[#8a9f91]">Yêu cầu #{y.id} · {y.laNguoiGiu ? 'Bạn giữ đồ' : 'Bạn nhận đồ'} · {new Date(y.created_at).toLocaleString('vi-VN')}</p>{y.ghi_chu_admin && y.trang_thai !== 'da_xac_minh' && <div className="rounded-xl bg-amber-50 p-4 text-sm"><p className="mb-1 font-semibold">Phản hồi quản trị viên</p><p className="whitespace-pre-wrap">{y.ghi_chu_admin}</p></div>}{y.trang_thai === 'can_bo_sung' && <div><label className="block text-sm">Thông tin bổ sung<textarea maxLength={2000} rows={3} className="mt-2 w-full rounded-xl border border-[#ceded3] p-3" value={boSung[y.id] || ''} onChange={(e) => datBoSung({ ...boSung, [y.id]: e.target.value })} /></label><button disabled={dangLuu || !boSung[y.id]?.trim()} onClick={() => gui(y.id)} className="mt-3 rounded-xl bg-emerald-900 px-4 py-3 text-sm text-white disabled:opacity-50">Gửi bổ sung</button></div>}<Link to={`/chi-tiet-yeu-cau?id=${y.id}&page=${trang}`} className="inline-flex rounded-xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800">{y.trang_thai === 'da_xac_minh' ? 'Liên hệ & cuộc hẹn' : 'Xem chi tiết yêu cầu'} →</Link></section>)}{ketQua?.total === 0 && <p className="rounded-2xl bg-white p-8 text-center text-[#718276]">Chưa có yêu cầu hoặc cuộc hẹn của bạn.</p>}<div className="flex justify-end gap-4 text-sm"><button disabled={trang === 1} onClick={() => datTrang(trang - 1)}>Trang trước</button><span>{trang} / {ketQua?.last_page || 1}</span><button disabled={!ketQua || trang >= ketQua.last_page} onClick={() => datTrang(trang + 1)}>Trang sau</button></div></div>
}
