import MenuThaoTac from '../../../components/shared/MenuThaoTac'

export default function DanhSachCauHoi({ cacCauHoi, danhMucChon, nhomCauHoi, coBoLoc, moChiTiet, moSua, moDoiTrangThai, moXoa }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[580px] table-fixed text-left text-sm">
        <caption className="sr-only">{nhomCauHoi === 'chung' ? 'Câu hỏi cơ bản dùng chung' : `Câu hỏi của danh mục ${danhMucChon.tenDanhMuc}`}</caption>
        <colgroup><col className="w-[62%]" /><col className="w-[24%]" /><col className="w-[14%]" /></colgroup>
        <thead className="border-y border-[#e1eae4] bg-[#f8fbf9] text-xs text-[#687d70]"><tr><th scope="col" className="px-5 py-3.5 sm:px-6">Câu hỏi</th><th scope="col" className="px-3 py-3.5">Trạng thái</th><th scope="col" className="px-3 py-3.5 text-center"><span className="sr-only">Thao tác</span></th></tr></thead>
        <tbody className="divide-y divide-[#e8efea]">
          {cacCauHoi.length ? cacCauHoi.map((cauHoi) => {
            const coLichSu = cauHoi.coCauTraLoi || cauHoi.phienBan > 1
            return <tr key={cauHoi.id} className="hover:bg-[#fafcfb]">
              <th scope="row" className="px-5 py-3 sm:px-6"><button type="button" onClick={() => moChiTiet(cauHoi)} className="rounded-lg text-left font-semibold leading-6 break-words text-[#243c30] hover:text-emerald-800 hover:underline focus-visible:outline-2 focus-visible:outline-emerald-700">{cauHoi.nhanDangTin}</button></th>
              <td className="px-3 py-3"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${cauHoi.dangHoatDong ? 'bg-[#eaf6ee] text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>{cauHoi.dangHoatDong ? 'Đang dùng' : 'Ngừng sử dụng'}</span></td>
              <td className="px-3 py-3 text-center"><MenuThaoTac nhan={`Thao tác câu hỏi ${cauHoi.nhanDangTin}`} cacThaoTac={[
                { id: 'sua', nhan: 'Sửa', khiChon: () => moSua(cauHoi) },
                { id: 'trang_thai', nhan: cauHoi.dangHoatDong ? 'Ẩn' : 'Mở lại', voHieu: !cauHoi.dangHoatDong && cauHoi.danhMucId !== null && !danhMucChon?.dangHoatDong, khiChon: () => moDoiTrangThai(cauHoi) },
                { id: 'xoa', nhan: 'Xóa', voHieu: coLichSu, lyDo: coLichSu ? 'Câu hỏi có lịch sử hoặc câu trả lời. Dùng Ẩn để giữ dữ liệu.' : undefined, nguyHiem: true, khiChon: () => moXoa(cauHoi) },
              ]} /></td>
            </tr>
          }) : <tr><td colSpan={3} className="px-5 py-10 text-center text-sm leading-6 text-[#718276]">{coBoLoc ? 'Không có câu hỏi phù hợp. Thử thay đổi hoặc xóa bộ lọc.' : nhomCauHoi === 'chung' ? 'Chưa có câu hỏi cơ bản dùng chung.' : 'Chưa có câu hỏi cho danh mục này.'}</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
