import { useState } from 'react'
import HopThoai from '../../../components/shared/HopThoai'
import TruongCauHoi from '../../../components/shared/TruongCauHoi'
import { layCauHoiXemTruoc } from './hooks/xuLyCauHoi.js'

export default function XemTruocForm({ danhSach, danhMuc, danhMucChon, dongXemTruoc }) {
  const [loaiForm, datLoaiForm] = useState('mat')
  const [danhMucId, datDanhMucId] = useState(danhMucChon?.id || '')
  const mucChon = danhMuc.find((muc) => muc.id === danhMucId)
  const coTheXem = !danhMucId || Boolean(mucChon?.dangHoatDong)
  const cauHoi = coTheXem ? layCauHoiXemTruoc(danhSach, danhMucId || null, loaiForm) : []
  const lopNhap = 'w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-2.5 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'

  function doiLoaiForm(suKien) {
    datLoaiForm(suKien.target.value)
  }

  return (
    <HopThoai tieuDe="Xem thử form" moTa="Câu hỏi cơ bản được ghép với câu riêng của danh mục. Các ô nhập thử không lưu câu trả lời." khiDong={dongXemTruoc}>
      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div><label htmlFor="danh-muc-form-xem-truoc" className="mb-2 block text-sm font-semibold text-[#243c30]">Danh mục xem thử</label><select id="danh-muc-form-xem-truoc" value={danhMucId} onChange={(suKien) => datDanhMucId(suKien.target.value)} className={lopNhap}><option value="">Chỉ câu hỏi cơ bản</option>{danhMuc.map((muc) => <option key={muc.id} value={muc.id}>{muc.tenDanhMuc}{muc.dangHoatDong ? '' : ' (Ngừng sử dụng)'}</option>)}</select></div>
        <div><label htmlFor="loai-form-xem-truoc" className="mb-2 block text-sm font-semibold text-[#243c30]">Biểu mẫu</label><select id="loai-form-xem-truoc" value={loaiForm} onChange={doiLoaiForm} className={lopNhap}><option value="mat">Đăng tin báo mất</option><option value="nhat">Đăng tin nhặt được</option><option value="nhan_lai">Gửi yêu cầu nhận lại</option></select></div>
        {loaiForm === 'nhan_lai' && <p className="text-xs leading-5 text-[#718276]">Dùng lại toàn bộ câu hỏi theo danh mục. Đáp án của người nhặt không được hiển thị cho người xin nhận lại.</p>}
        {!cauHoi.length && <p className="rounded-xl bg-[#f5f9f6] px-4 py-5 text-sm leading-6 text-[#718276]">{coTheXem ? 'Chưa có câu hỏi đang hoạt động cho biểu mẫu này.' : 'Danh mục đã ngừng sử dụng hoặc không còn tồn tại.'}</p>}
        <div key={`${danhMucId}-${loaiForm}`} className="space-y-5">
          {cauHoi.map((muc) => <TruongCauHoi key={muc.id} cauHoi={muc} loaiForm={loaiForm} />)}
        </div>
      </div>
      <div className="flex justify-end border-t border-[#e1eae4] px-5 py-4 sm:px-6"><button type="button" onClick={dongXemTruoc} className="rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-700">Đóng</button></div>
    </HopThoai>
  )
}
