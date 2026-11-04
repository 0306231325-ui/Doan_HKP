export default function BangDanhMuc({ cacDanhMuc, coBoLoc, danhMucDangDoi, moXacNhanThaoTac }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] table-fixed text-left text-sm">
        <caption className="sr-only">Danh sách danh mục đồ vật</caption>
        <colgroup><col className="w-1/4" /><col className="w-1/4" /><col className="w-1/4" /><col className="w-1/4" /></colgroup>
        <thead className="border-b border-[#e1eae4] bg-[#f8fbf9] text-xs text-[#687d70]">
          <tr><th scope="col" className="px-6 py-3.5">Tên danh mục</th><th scope="col" className="px-6 py-3.5">Mô tả</th><th scope="col" className="px-6 py-3.5 text-center">Trạng thái</th><th scope="col" className="px-6 py-3.5 text-center">Thao tác</th></tr>
        </thead>
        <tbody className="divide-y divide-[#e8efea]">
          {cacDanhMuc.length ? cacDanhMuc.map((muc) => (
            <tr key={muc.id}>
              <th scope="row" className="break-words px-6 py-4 font-semibold text-[#243c30]">{muc.tenDanhMuc}</th>
              <td className="whitespace-pre-wrap break-words px-6 py-4 text-[#607568]">{muc.moTa || '—'}</td>
              <td className="px-6 py-4 text-center"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${muc.dangHoatDong ? 'bg-[#eaf6ee] text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>{muc.dangHoatDong ? 'Đang hoạt động' : 'Ngừng sử dụng'}</span></td>
              <td className="px-6 py-4 text-center"><div className="flex justify-center gap-2"><button type="button" disabled={Boolean(danhMucDangDoi)} aria-label={`${muc.dangHoatDong ? 'Ẩn' : 'Mở'} danh mục ${muc.tenDanhMuc}`} onClick={() => moXacNhanThaoTac(muc, muc.dangHoatDong ? 'an' : 'mo')} className={`min-w-16 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-50 ${muc.dangHoatDong ? 'border-amber-200 text-amber-800 hover:bg-amber-50' : 'border-emerald-200 text-emerald-800 hover:bg-emerald-50'}`}>{danhMucDangDoi === muc.id ? 'Đang lưu…' : muc.dangHoatDong ? 'Ẩn' : 'Mở'}</button><button type="button" disabled={Boolean(danhMucDangDoi)} aria-label={`Xóa danh mục ${muc.tenDanhMuc}`} onClick={() => moXacNhanThaoTac(muc, 'xoa')} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:cursor-wait disabled:opacity-50">Xóa</button></div></td>
            </tr>
          )) : <tr><td colSpan={4} className="px-6 py-10 text-center leading-6 text-[#607568]">{coBoLoc ? 'Không tìm thấy danh mục phù hợp. Thử thay đổi từ khóa hoặc xóa bộ lọc.' : 'Chưa có danh mục. Bấm Thêm danh mục để tạo mới.'}</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
