import { Eye, LockKeyhole, SearchX, UnlockKeyhole, UsersRound } from 'lucide-react'
import PhanTrang from '../../../components/shared/PhanTrang'
import ThongBaoTrong from '../../../components/shared/ThongBaoTrong'
import NhanTaiKhoan from './NhanTaiKhoan'
import { layChuVietTat } from './hooks/xuLyNguoiDung.js'

export default function BangNguoiDung({ cacNguoiDung, thongKe, xoaBoLoc, moChiTiet, moDoiTrangThai, ...phanTrang }) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <caption className="sr-only">Danh sách tài khoản người dùng</caption>
          <thead className="border-y border-[#e1eae4] bg-[#f8fbf9] text-xs font-semibold text-[#687d70]">
            <tr>
              <th scope="col" className="px-6 py-4">Người dùng</th>
              <th scope="col" className="px-4 py-4">Mã số / Đơn vị</th>
              <th scope="col" className="px-4 py-4">Vai trò</th>
              <th scope="col" className="px-4 py-4">Trạng thái</th>
              <th scope="col" className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8efea]">
            {cacNguoiDung.map((nguoiDung) => {
              const biKhoa = nguoiDung.trang_thai === 'bi_khoa'
              const doiDuocTrangThai = ['hoat_dong', 'bi_khoa'].includes(nguoiDung.trang_thai)
              return (
                <tr key={nguoiDung.id} className="transition-colors hover:bg-[#f8fbf9]">
                  <th scope="row" className="max-w-80 px-6 py-5 font-normal">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-bold text-emerald-800" aria-hidden="true">{layChuVietTat(nguoiDung.ho_ten)}</span>
                      <div className="min-w-0">
                        <p className="break-words font-semibold text-[#243c30]">{nguoiDung.ho_ten || 'Chưa có họ tên'}</p>
                        <p className="mt-1 break-all text-xs text-[#718276]">{nguoiDung.email || 'Chưa có email'}</p>
                      </div>
                    </div>
                  </th>
                  <td className="max-w-48 px-4 py-5"><p className="font-medium text-[#344d3e]">{nguoiDung.ma_so || '—'}</p><p className="mt-1.5 break-words text-xs leading-5 text-[#718276]">{nguoiDung.khoa || nguoiDung.lop || 'Chưa có đơn vị'}</p></td>
                  <td className="px-4 py-5"><NhanTaiKhoan nguoiDung={nguoiDung} loai="vai_tro" /></td>
                  <td className="px-4 py-5"><NhanTaiKhoan nguoiDung={nguoiDung} /></td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button type="button" onClick={() => moChiTiet(nguoiDung)} aria-label={`Xem chi tiết tài khoản ${nguoiDung.ho_ten || nguoiDung.email}`} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700"><Eye className="h-4 w-4" aria-hidden="true" />Xem chi tiết</button>
                      <button type="button" disabled={!doiDuocTrangThai} onClick={() => moDoiTrangThai(nguoiDung)} aria-label={`${biKhoa ? 'Mở khóa' : 'Khóa'} tài khoản ${nguoiDung.ho_ten || nguoiDung.email}`} title={biKhoa ? 'Mở khóa tài khoản' : 'Khóa tài khoản'} className={`rounded-lg border p-2 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 ${biKhoa ? 'border-emerald-200 text-emerald-800 hover:bg-emerald-50' : 'border-rose-100 text-rose-700 hover:bg-rose-50'}`}>{biKhoa ? <UnlockKeyhole className="h-4 w-4" aria-hidden="true" /> : <LockKeyhole className="h-4 w-4" aria-hidden="true" />}</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {!cacNguoiDung.length && (
        <div className="p-5 sm:p-6">
          <ThongBaoTrong bieuTuong={thongKe.tong ? SearchX : UsersRound} tieuDe={thongKe.tong ? 'Không tìm thấy người dùng phù hợp' : 'Chưa có dữ liệu người dùng'} moTa={thongKe.tong ? 'Thử thay đổi từ khóa hoặc bộ lọc để tìm tài khoản bạn cần.' : 'Danh sách tài khoản sẽ hiển thị tại đây khi có dữ liệu.'} />
          {thongKe.tong > 0 && <div className="mt-3 text-center"><button type="button" onClick={xoaBoLoc} className="rounded-xl px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700">Xóa bộ lọc</button></div>}
        </div>
      )}
      <div className="px-5 sm:px-6"><PhanTrang {...phanTrang} donVi="tài khoản" nhanDieuHuong="Phân trang người dùng" /></div>
    </>
  )
}
