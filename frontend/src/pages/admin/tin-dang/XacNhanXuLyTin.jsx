import HopThoai from '../../../components/shared/HopThoai'

export default function XacNhanXuLyTin({ thaoTac, khiDong, khiXacNhan, dangLuu = false, loi = '' }) {
  const laBaoCao = thaoTac.maBaoCao != null
  const laKhoiPhuc = !laBaoCao && thaoTac.trangThai === 'hien_thi'
  if (laKhoiPhuc) return <HopThoai tieuDe="Khôi phục tin" moTa="Bạn có chắc muốn khôi phục tin? Tin sẽ hiển thị lại trên trang chủ." khiDong={khiDong}>
    <form className="space-y-5 p-5 sm:p-6" onSubmit={(e) => { e.preventDefault(); if (!dangLuu) khiXacNhan() }}>
      {loi && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{loi}</p>}
      <div className="flex justify-end gap-3"><button type="button" disabled={dangLuu} onClick={khiDong} className="rounded-xl px-4 py-2.5 text-sm text-[#687d70]">Hủy</button><button type="submit" disabled={dangLuu} className="rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">{dangLuu ? 'Đang khôi phục…' : 'Xác nhận'}</button></div>
    </form>
  </HopThoai>
  const cacLyDo = laBaoCao
    ? thaoTac.ketQua === 'chap_nhan'
      ? ['Thông tin trong báo cáo đã được xác minh', 'Tin trùng lặp hoặc spam', 'Nội dung không phù hợp', 'Có dấu hiệu lừa đảo', 'Khác']
      : ['Báo cáo không có căn cứ', 'Không đủ bằng chứng xác minh vi phạm', 'Nội dung tin không vi phạm', 'Báo cáo nhầm tin', 'Khác']
    : laKhoiPhuc
      ? ['Người đăng đã chỉnh sửa nội dung', 'Đã xác minh tin hợp lệ', 'Báo cáo không có căn cứ', 'Tin bị ẩn nhầm', 'Khác']
      : ['Thông tin không chính xác', 'Tin trùng lặp hoặc spam', 'Nội dung không phù hợp', 'Nghi ngờ lừa đảo', 'Khác']
  const goiYGhiChu = laBaoCao
    ? 'Nêu kết quả đối chiếu và căn cứ xử lý báo cáo…'
    : laKhoiPhuc
      ? 'Nêu nội dung đã được chỉnh sửa hoặc căn cứ để khôi phục tin…'
      : 'Nêu nội dung vi phạm hoặc thông tin cần kiểm tra trước khi hiển thị lại…'
  return <HopThoai tieuDe={thaoTac.nhan} moTa="Ghi rõ lý do để người quản trị có thể đối chiếu lịch sử xử lý." khiDong={khiDong}>
    <form className="space-y-5 p-5 sm:p-6" onSubmit={(e) => { e.preventDefault(); const duLieu = new FormData(e.currentTarget); const ghiChu = duLieu.get('ghiChu').trim(); if (ghiChu.length < 5) { e.currentTarget.elements.ghiChu.setCustomValidity('Nhập ít nhất 5 ký tự có nội dung.'); e.currentTarget.reportValidity(); return } khiXacNhan(`${duLieu.get('lyDo')} — ${ghiChu}`) }}>
      {loi && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{loi}</p>}
      <label className="block text-sm font-semibold">Lý do *<select name="lyDo" required disabled={dangLuu} defaultValue="" className="mt-2 w-full rounded-xl border border-[#ceded3] px-3 py-3 font-normal"><option value="" disabled>Chọn lý do</option>{cacLyDo.map((ten) => <option key={ten}>{ten}</option>)}</select></label>
      <label className="block text-sm font-semibold">Ghi chú *<textarea name="ghiChu" required disabled={dangLuu} minLength={5} maxLength={1000} rows={3} onChange={(e) => e.target.setCustomValidity('')} className="mt-2 w-full rounded-xl border border-[#ceded3] p-3 font-normal" placeholder={goiYGhiChu} /></label>
      <div className="flex justify-end gap-3"><button type="button" disabled={dangLuu} onClick={khiDong} className="rounded-xl px-4 py-2.5 text-sm text-[#687d70]">Hủy</button><button type="submit" disabled={dangLuu} className="rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">{dangLuu ? 'Đang lưu…' : 'Xác nhận'}</button></div>
    </form>
  </HopThoai>
}
