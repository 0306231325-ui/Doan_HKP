import { History, LockKeyhole, Pencil, Power, RotateCcw, SearchX } from 'lucide-react'
import { cacKieuNhap } from './hooks/xuLyCauHoi.js'

export default function DanhSachCauHoi({ cacCauHoi, danhMucChon, moSua, moDoiTrangThai, moLichSu }) {
  if (!cacCauHoi.length) return (
    <div className="flex flex-col items-center px-5 py-14 text-center">
      <SearchX className="mb-3 h-8 w-8 text-[#9aafa1]" aria-hidden="true" />
      <h3 className="text-sm font-semibold text-[#243c30]">Chưa có câu hỏi phù hợp</h3>
      <p className="mt-2 text-sm leading-6 text-[#718276]">Thêm câu hỏi cho danh mục này hoặc điều chỉnh bộ lọc.</p>
    </div>
  )
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-left text-sm">
        <caption className="sr-only">Câu hỏi của danh mục {danhMucChon.tenDanhMuc}</caption>
        <thead className="border-y border-[#e1eae4] bg-[#f8fbf9] text-xs text-[#687d70]"><tr><th scope="col" className="w-14 px-5 py-3.5">STT</th><th scope="col" className="px-3 py-3.5">Câu hỏi</th><th scope="col" className="w-48 px-3 py-3.5">Áp dụng</th><th scope="col" className="w-32 px-3 py-3.5">Trạng thái</th><th scope="col" className="w-28 px-5 py-3.5 text-right">Thao tác</th></tr></thead>
        <tbody className="divide-y divide-[#e8efea]">
          {cacCauHoi.map((cauHoi) => <tr key={cauHoi.id} className="hover:bg-[#fafcfb]">
            <td className="px-5 py-5 align-top text-xs text-[#718276]">{cauHoi.thuTu}</td>
            <th scope="row" className="px-3 py-5 align-top font-normal">
              <p className="break-words font-semibold leading-6 text-[#243c30]">{cauHoi.nhanDangTin}</p>
              <p className="mt-1.5 text-xs text-[#718276]">{cacKieuNhap[cauHoi.kieuNhap]} · Bản {cauHoi.phienBan}</p>
              {cauHoi.apDung.nhat.dungXacMinh && <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-800"><LockKeyhole className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />Giữ kín đáp án nhặt được để xác minh</p>}
            </th>
            <td className="space-y-2 px-3 py-5 align-top text-xs leading-5 text-[#687d70]">{Object.entries({ mat: 'Báo mất', nhat: 'Nhặt được' }).filter(([loai]) => cauHoi.apDung[loai].suDung).map(([loai, nhan]) => <p key={loai}><span className="font-medium text-[#243c30]">{nhan}</span><br />{cauHoi.apDung[loai].batBuoc ? 'Bắt buộc' : 'Không bắt buộc'} · {cauHoi.apDung[loai].congKhai ? 'Công khai' : 'Giữ kín'}</p>)}</td>
            <td className="px-3 py-5 align-top"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${cauHoi.dangHoatDong ? 'bg-[#eaf6ee] text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>{cauHoi.dangHoatDong ? 'Đang dùng' : 'Ngừng sử dụng'}</span></td>
            <td className="px-5 py-4 align-top"><div className="flex justify-end gap-0.5">
              <button type="button" onClick={() => moSua(cauHoi)} title="Chỉnh sửa" aria-label={`Sửa câu hỏi ${cauHoi.nhanDangTin}`} className="rounded-lg p-2 text-[#687d70] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700"><Pencil className="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" onClick={() => moLichSu(cauHoi)} title="Lịch sử phiên bản" aria-label={`Lịch sử câu hỏi ${cauHoi.nhanDangTin}`} className="rounded-lg p-2 text-[#687d70] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700"><History className="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" onClick={() => moDoiTrangThai(cauHoi)} disabled={!cauHoi.dangHoatDong && !danhMucChon.dangHoatDong} title={cauHoi.dangHoatDong ? 'Ngừng sử dụng' : 'Mở lại'} aria-label={`${cauHoi.dangHoatDong ? 'Ngừng sử dụng' : 'Mở lại'} câu hỏi ${cauHoi.nhanDangTin}`} className="rounded-lg p-2 text-[#687d70] hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-35">{cauHoi.dangHoatDong ? <Power className="h-4 w-4" aria-hidden="true" /> : <RotateCcw className="h-4 w-4" aria-hidden="true" />}</button>
            </div></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}
