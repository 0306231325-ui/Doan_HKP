import HopThoai from '../../../components/shared/HopThoai'

export default function FormDiaDiem({ bieuMau, loiBieuMau, loiLuu, dongBieuMau, thayDoiBieuMau, luuDiaDiem }) {
  return (
    <HopThoai tieuDe={bieuMau.id ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm'} moTa="Đặt tên rõ ràng để sinh viên dễ chọn đúng khu vực trong trường." khiDong={dongBieuMau}>
      <form onSubmit={luuDiaDiem} noValidate>
        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div>
            <label htmlFor="ten-dia-diem" className="mb-2 block text-sm font-semibold text-[#243c30]">Tên địa điểm <span className="text-red-600">*</span></label>
            <input id="ten-dia-diem" name="tenDiaDiem" value={bieuMau.tenDiaDiem} onChange={thayDoiBieuMau} maxLength={150} required aria-invalid={Boolean(loiBieuMau.tenDiaDiem)} aria-describedby={loiBieuMau.tenDiaDiem ? 'loi-ten-dia-diem' : undefined} placeholder="Ví dụ: Thư viện trung tâm" className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-[#243c30] outline-none placeholder:text-[#9aaa9f] focus-visible:ring-2 focus-visible:ring-emerald-700 ${loiBieuMau.tenDiaDiem ? 'border-red-500' : 'border-[#ceded3]'}`} />
            {loiBieuMau.tenDiaDiem && <p id="loi-ten-dia-diem" role="alert" className="mt-2 text-xs leading-5 text-red-700">{loiBieuMau.tenDiaDiem}</p>}
          </div>
          <div>
            <label htmlFor="mo-ta-dia-diem" className="mb-2 block text-sm font-semibold text-[#243c30]">Mô tả <span className="font-normal text-[#7b8e80]">(không bắt buộc)</span></label>
            <textarea id="mo-ta-dia-diem" name="moTa" value={bieuMau.moTa} onChange={thayDoiBieuMau} maxLength={500} rows={3} aria-invalid={Boolean(loiBieuMau.moTa)} aria-describedby={loiBieuMau.moTa ? 'loi-mo-ta-dia-diem' : 'goi-y-mo-ta-dia-diem'} placeholder="Ghi rõ tòa nhà, tầng hoặc khu vực để dễ nhận biết…" className="w-full resize-y rounded-xl border border-[#ceded3] bg-white px-3.5 py-3 text-sm leading-6 text-[#243c30] outline-none placeholder:text-[#9aaa9f] focus-visible:ring-2 focus-visible:ring-emerald-700" />
            {loiBieuMau.moTa ? <p id="loi-mo-ta-dia-diem" role="alert" className="mt-1 text-xs text-red-700">{loiBieuMau.moTa}</p> : <p id="goi-y-mo-ta-dia-diem" className="mt-1 text-right text-xs text-[#7b8e80]">{bieuMau.moTa.length}/500 ký tự</p>}
          </div>
          <div>
            <label htmlFor="trang-thai-dia-diem" className="mb-2 block text-sm font-semibold text-[#243c30]">Trạng thái</label>
            <select id="trang-thai-dia-diem" name="dangHoatDong" value={bieuMau.dangHoatDong ? '1' : '0'} onChange={thayDoiBieuMau} className="w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-3 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
              <option value="1">Đang hoạt động</option>
              <option value="0">Ngừng sử dụng</option>
            </select>
          </div>
          {loiLuu && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm leading-6 text-red-700">{loiLuu}</p>}
        </div>
        <div className="flex justify-end gap-3 border-t border-[#e1eae4] bg-[#f9fbfa] px-5 py-4 sm:px-6">
          <button type="button" onClick={dongBieuMau} className="rounded-xl border border-[#ceded3] bg-white px-5 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Hủy</button>
          <button type="submit" className="rounded-xl bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">{bieuMau.id ? 'Lưu thay đổi' : 'Thêm địa điểm'}</button>
        </div>
      </form>
    </HopThoai>
  )
}
