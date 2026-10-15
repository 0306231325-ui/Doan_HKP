import { ChevronLeft, ChevronRight, FolderTree, Pencil, Power, RotateCcw, SearchX } from 'lucide-react'

export default function BangDanhMuc({ cacDanhMuc, trangHienTai, tongTrang, tongKetQua, tuViTri, denViTri, chuyenTrang, moSuaDanhMuc, moDoiTrangThai, xoaBoLoc }) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">Danh sách danh mục đồ vật</caption>
          <thead className="border-y border-[#e1eae4] bg-[#f8fbf9] text-xs font-semibold text-[#687d70]">
            <tr>
              <th scope="col" className="w-[32%] px-5 py-3.5 sm:px-6">Tên danh mục</th>
              <th scope="col" className="px-4 py-3.5">Mô tả</th>
              <th scope="col" className="w-36 px-4 py-3.5">Trạng thái</th>
              <th scope="col" className="w-28 px-5 py-3.5 text-right sm:px-6">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8efea]">
            {cacDanhMuc.map((danhMuc) => (
              <tr key={danhMuc.id} className="transition-colors hover:bg-[#f8fbf9]">
                <th scope="row" className="px-5 py-5 font-medium sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${danhMuc.dangHoatDong ? 'bg-[#edf7f0] text-emerald-800' : 'bg-gray-100 text-gray-400'}`}><FolderTree className="h-4 w-4" aria-hidden="true" /></span>
                    <span className={`break-words leading-6 ${danhMuc.dangHoatDong ? 'text-[#243c30]' : 'text-[#738579]'}`}>{danhMuc.tenDanhMuc}</span>
                  </div>
                </th>
                <td className="px-4 py-5 text-xs leading-6 text-[#718276]"><p className="line-clamp-2" title={danhMuc.moTa}>{danhMuc.moTa || 'Chưa có mô tả'}</p></td>
                <td className="px-4 py-5"><span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${danhMuc.dangHoatDong ? 'bg-[#eaf6ee] text-emerald-800' : 'bg-gray-100 text-gray-500'}`}><span className={`h-1.5 w-1.5 rounded-full ${danhMuc.dangHoatDong ? 'bg-emerald-600' : 'bg-gray-400'}`} aria-hidden="true" />{danhMuc.dangHoatDong ? 'Đang hoạt động' : 'Ngừng sử dụng'}</span></td>
                <td className="px-5 py-5 sm:px-6">
                  <div className="flex justify-end gap-1">
                    <button type="button" onClick={() => moSuaDanhMuc(danhMuc)} aria-label={`Sửa danh mục ${danhMuc.tenDanhMuc}`} title="Chỉnh sửa" className="rounded-lg p-2 text-[#687d70] hover:bg-emerald-50 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-emerald-700"><Pencil className="h-4 w-4" aria-hidden="true" /></button>
                    <button type="button" onClick={() => moDoiTrangThai(danhMuc)} aria-label={`${danhMuc.dangHoatDong ? 'Ngừng sử dụng' : 'Mở lại'} danh mục ${danhMuc.tenDanhMuc}`} title={danhMuc.dangHoatDong ? 'Ngừng sử dụng' : 'Mở lại danh mục'} className={`rounded-lg p-2 focus-visible:outline-2 focus-visible:outline-emerald-700 ${danhMuc.dangHoatDong ? 'text-[#687d70] hover:bg-amber-50 hover:text-amber-700' : 'text-emerald-800 hover:bg-emerald-50'}`}>{danhMuc.dangHoatDong ? <Power className="h-4 w-4" aria-hidden="true" /> : <RotateCcw className="h-4 w-4" aria-hidden="true" />}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {cacDanhMuc.length === 0 && (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <SearchX className="mb-3 h-8 w-8 text-[#9aafa1]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[#243c30]">Không tìm thấy danh mục phù hợp</h3>
          <p className="mt-2 text-sm text-[#718276]">Thử tìm bằng từ khóa khác hoặc thay đổi bộ lọc.</p>
          <button type="button" onClick={xoaBoLoc} className="mt-4 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700">Xóa bộ lọc</button>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e1eae4] px-5 py-4 sm:px-6">
        <p aria-live="polite" className="text-xs text-[#718276]">{tongKetQua ? `Hiển thị ${tuViTri}–${denViTri} trong ${tongKetQua} danh mục` : 'Không có kết quả'}</p>
        <nav aria-label="Phân trang danh mục" className="flex items-center gap-2">
          <button type="button" onClick={() => chuyenTrang(trangHienTai - 1)} disabled={trangHienTai === 1} aria-label="Trang trước" className="rounded-lg border border-[#d6e4db] p-1.5 text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-35"><ChevronLeft className="h-4 w-4" aria-hidden="true" /></button>
          <span className="min-w-12 text-center text-xs font-medium text-[#526c5b]">{trangHienTai} / {tongTrang}</span>
          <button type="button" onClick={() => chuyenTrang(trangHienTai + 1)} disabled={trangHienTai === tongTrang} aria-label="Trang sau" className="rounded-lg border border-[#d6e4db] p-1.5 text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-35"><ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
        </nav>
      </div>
    </>
  )
}
