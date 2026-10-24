import HopThoai from '../../../components/shared/HopThoai'

export default function XacNhanXuLyTin({ thaoTac, khiDong, khiXacNhan }) {
  return <HopThoai tieuDe={thaoTac.nhan} moTa="Ghi rõ lý do để người quản trị có thể đối chiếu lịch sử xử lý." khiDong={khiDong}>
    <form className="space-y-5 p-5 sm:p-6" onSubmit={(e) => { e.preventDefault(); const duLieu = new FormData(e.currentTarget); const ghiChu = duLieu.get('ghiChu').trim(); if (ghiChu.length < 5) { e.currentTarget.elements.ghiChu.setCustomValidity('Nhập ít nhất 5 ký tự có nội dung.'); e.currentTarget.reportValidity(); return } khiXacNhan(`${duLieu.get('lyDo')} — ${ghiChu}`) }}>
      <label className="block text-sm font-semibold">Lý do *<select name="lyDo" required defaultValue="" className="mt-2 w-full rounded-xl border border-[#ceded3] px-3 py-3 font-normal"><option value="" disabled>Chọn lý do</option>{['Thông tin đã được xác minh', 'Thông tin không chính xác', 'Tin trùng lặp hoặc spam', 'Nội dung không phù hợp', 'Không đủ căn cứ vi phạm', 'Khác'].map((ten) => <option key={ten}>{ten}</option>)}</select></label>
      <label className="block text-sm font-semibold">Ghi chú *<textarea name="ghiChu" required minLength={5} maxLength={1000} rows={3} onChange={(e) => e.target.setCustomValidity('')} className="mt-2 w-full rounded-xl border border-[#ceded3] p-3 font-normal" placeholder="Kết quả kiểm tra và lý do xử lý…" /></label>
      <div className="flex justify-end gap-3"><button type="button" onClick={khiDong} className="rounded-xl px-4 py-2.5 text-sm text-[#687d70]">Hủy</button><button type="submit" className="rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Xác nhận</button></div>
    </form>
  </HopThoai>
}
