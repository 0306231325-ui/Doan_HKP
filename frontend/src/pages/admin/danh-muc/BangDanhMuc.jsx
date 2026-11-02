import { FolderTree, ListChecks, Pencil, Plus, Power, RotateCcw, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import PhanTrang from '../../../components/shared/PhanTrang'
import ThongBaoTrong from '../../../components/shared/ThongBaoTrong'

export default function BangDanhMuc({ cacDanhMuc, trangHienTai, tongTrang, tongKetQua, tuViTri, denViTri, chuyenTrang, moSuaDanhMuc, moDoiTrangThai, xoaBoLoc, coBoLoc, moThemDanhMuc }) {
  return (
    <>
      {cacDanhMuc.length > 0 ? <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <caption className="sr-only">Danh sách danh mục đồ vật</caption>
          <thead className="border-y border-[#e1eae4] bg-[#f8fbf9] text-xs font-semibold text-[#687d70]">
            <tr>
              <th scope="col" className="w-[22%] px-5 py-3.5 sm:px-6">Tên danh mục</th>
              <th scope="col" className="px-4 py-3.5">Mô tả</th>
              <th scope="col" className="w-20 px-4 py-3.5 text-center">Số tin</th>
              <th scope="col" className="w-36 px-4 py-3.5">Trạng thái</th>
              <th scope="col" className="w-80 px-5 py-3.5 text-right sm:px-6">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8efea]">
            {cacDanhMuc.map((danhMuc) => (
              <tr key={danhMuc.id} className="transition-colors hover:bg-[#f8fbf9]">
                <th scope="row" className="px-5 py-5 font-medium sm:px-6">
                  <span className={`break-words font-semibold leading-6 ${danhMuc.dangHoatDong ? 'text-[#243c30]' : 'text-[#738579]'}`}>{danhMuc.tenDanhMuc}</span>
                </th>
                <td className="px-4 py-5 text-xs leading-6 text-[#718276]"><p className="line-clamp-2" title={danhMuc.moTa}>{danhMuc.moTa || 'Chưa có mô tả'}</p></td>
                <td className="px-4 py-5 text-center text-[#718276]"><span title="Tổng tin chưa xóa của danh mục">{danhMuc.soTin}</span></td>
                <td className="px-4 py-5"><span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${danhMuc.dangHoatDong ? 'bg-[#eaf6ee] text-emerald-800' : 'bg-gray-100 text-gray-500'}`}><span className={`h-1.5 w-1.5 rounded-full ${danhMuc.dangHoatDong ? 'bg-emerald-600' : 'bg-gray-400'}`} aria-hidden="true" />{danhMuc.dangHoatDong ? 'Đang hoạt động' : 'Ngừng sử dụng'}</span></td>
                <td className="px-5 py-5 sm:px-6">
                  <div className="flex justify-end gap-1.5 whitespace-nowrap">
                    <button type="button" onClick={() => moSuaDanhMuc(danhMuc)} aria-label={`Sửa danh mục ${danhMuc.tenDanhMuc}`} className="inline-flex items-center gap-1.5 rounded-lg border border-[#d6e4db] px-2.5 py-2 text-xs font-semibold text-[#526c5b] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700"><Pencil className="h-3.5 w-3.5" aria-hidden="true" />Sửa</button>
                    <Link to={`/admin/cau-hoi?${new URLSearchParams({ danh_muc: danhMuc.id })}`} aria-label={`Câu hỏi của danh mục ${danhMuc.tenDanhMuc}`} className="inline-flex items-center gap-1.5 rounded-lg border border-[#d6e4db] px-2.5 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700"><ListChecks className="h-3.5 w-3.5" aria-hidden="true" />Câu hỏi</Link>
                    <button type="button" onClick={() => moDoiTrangThai(danhMuc)} aria-label={`${danhMuc.dangHoatDong ? 'Ngừng sử dụng' : 'Mở lại'} danh mục ${danhMuc.tenDanhMuc}`} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-emerald-700 ${danhMuc.dangHoatDong ? 'text-amber-800 hover:bg-amber-50' : 'text-emerald-800 hover:bg-emerald-50'}`}>{danhMuc.dangHoatDong ? <Power className="h-3.5 w-3.5" aria-hidden="true" /> : <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />}{danhMuc.dangHoatDong ? 'Ngừng' : 'Mở lại'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> : <div className="relative p-5 sm:p-6">
        <ThongBaoTrong bieuTuong={coBoLoc ? SearchX : FolderTree} tieuDe={coBoLoc ? 'Không tìm thấy danh mục phù hợp' : 'Chưa có danh mục đồ vật'} moTa={coBoLoc ? 'Thử đổi từ khóa hoặc xóa bộ lọc để xem lại danh sách.' : 'Thêm danh mục đầu tiên để phân loại đồ vật và thiết lập câu hỏi.'} />
        <div className="mt-4 flex justify-center"><button type="button" onClick={coBoLoc ? xoaBoLoc : moThemDanhMuc} className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-700">{!coBoLoc && <Plus className="h-4 w-4" aria-hidden="true" />}{coBoLoc ? 'Xóa bộ lọc' : 'Thêm danh mục'}</button></div>
      </div>}
      {tongKetQua > 0 && <div className="px-5 sm:px-6"><PhanTrang trangHienTai={trangHienTai} tongTrang={tongTrang} tongTin={tongKetQua} tuViTri={tuViTri} denViTri={denViTri} chuyenTrang={chuyenTrang} donVi="danh mục" nhanDieuHuong="Phân trang danh mục" /></div>}
    </>
  )
}
