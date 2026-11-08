import { useState } from 'react'
import { ShieldCheck, XCircle } from 'lucide-react'
import HopThoai from '../../../components/shared/HopThoai'

export default function QuyetDinhYeuCau({ yc, duDieuKien, ghiChu, datGhiChu, loi, dangLuu, khiDong, khiXuLy }) {
  const [quyetDinh, datQuyetDinh] = useState('da_xac_minh')
  return <HopThoai tieuDe="Xử lý yêu cầu" moTa={`Yêu cầu YC-${String(yc.id).padStart(4, '0')} · ${yc.nguoi_yeu_cau?.ho_ten || 'Người yêu cầu'}`} khiDong={() => { if (!dangLuu) khiDong() }}>
    <form className="space-y-5 p-5 sm:p-6" onSubmit={(e) => { e.preventDefault(); khiXuLy(quyetDinh) }}>
      <fieldset disabled={dangLuu} className="grid grid-cols-2 gap-3"><legend className="mb-3 text-sm font-semibold text-[#315a43]">Chọn quyết định</legend>
        {[{ value: 'da_xac_minh', nhan: 'Duyệt yêu cầu', Icon: ShieldCheck, mau: 'border-emerald-500 bg-emerald-50 text-emerald-900' }, { value: 'tu_choi', nhan: 'Từ chối', Icon: XCircle, mau: 'border-rose-400 bg-rose-50 text-rose-800' }].map(({ value, nhan, Icon, mau }) => <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-4 text-sm font-semibold ${quyetDinh === value ? mau : 'border-[#d6e4db] text-[#718276]'} focus-within:outline-2 focus-within:outline-emerald-700`}><input type="radio" name="quyetDinh" value={value} checked={quyetDinh === value} onChange={() => datQuyetDinh(value)} className="accent-emerald-800" /><Icon size={17} aria-hidden="true" />{nhan}</label>)}
      </fieldset>
      {quyetDinh === 'da_xac_minh' ? <p className={`rounded-xl p-4 text-sm leading-6 ${duDieuKien ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>{duDieuKien ? 'Bạn đã đối chiếu tất cả câu trả lời là khớp. Xác nhận để duyệt yêu cầu; không cần nhập lý do.' : 'Cần đánh giá tất cả câu trả lời là khớp trước khi duyệt. Đóng hộp thoại để kiểm tra lại thông tin.'}</p> : <label className="block text-sm font-semibold text-[#526c5b]">Lý do từ chối <span className="text-rose-600">*</span><textarea autoFocus required disabled={dangLuu} maxLength={2000} rows={4} value={ghiChu} onChange={(e) => datGhiChu(e.target.value)} placeholder="Nhập lý do để người yêu cầu biết…" className="mt-2 w-full resize-y rounded-xl border border-[#ceded3] p-3 text-sm font-normal leading-6 focus-visible:outline-2 focus-visible:outline-emerald-700" /><span className="mt-2 block text-xs font-normal text-[#8a9f91]">Lý do này sẽ được gửi đến người yêu cầu.</span></label>}
      {loi && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{loi}</p>}
      <div className="flex justify-end gap-3 border-t border-[#edf2ee] pt-4"><button type="button" disabled={dangLuu} onClick={khiDong} className="rounded-xl border border-[#d6e4db] px-4 py-3 text-sm font-semibold text-[#607568] disabled:opacity-40">Quay lại</button><button disabled={dangLuu || (quyetDinh === 'da_xac_minh' ? !duDieuKien : !ghiChu.trim())} className={`rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 ${quyetDinh === 'da_xac_minh' ? 'bg-emerald-900 hover:bg-emerald-800' : 'bg-rose-700 hover:bg-rose-800'}`}>{dangLuu ? 'Đang xử lý…' : quyetDinh === 'da_xac_minh' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}</button></div>
    </form>
  </HopThoai>
}
