import HopThoai from '../../../components/shared/HopThoai'

export default function XacNhanTrangThai({ cauHoiDoiTrangThai, loiLuu, dongDoiTrangThai, xacNhanDoiTrangThai }) {
  const dangHoatDong = cauHoiDoiTrangThai.dangHoatDong
  return (
    <HopThoai tieuDe={dangHoatDong ? 'Ngừng sử dụng câu hỏi?' : 'Mở lại câu hỏi?'} khiDong={dongDoiTrangThai}>
      <div className="px-5 py-5 sm:px-6">
        <p className="break-words text-sm font-semibold leading-6 text-[#243c30]">{cauHoiDoiTrangThai.nhanDangTin}</p>
        <p className="mt-3 text-sm leading-6 text-[#687d70]">{dangHoatDong ? 'Câu hỏi sẽ bị loại khỏi cấu hình form hiện tại. Các phiên bản đã lưu vẫn được giữ lại và bạn có thể mở lại câu hỏi bất cứ lúc nào.' : 'Câu hỏi sẽ được dùng lại theo cấu hình đã lưu.'}</p>
        {loiLuu && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{loiLuu}</p>}
      </div>
      <div className="flex justify-end gap-3 border-t border-[#e1eae4] bg-[#f9fbfa] px-5 py-4 sm:px-6">
        <button type="button" onClick={dongDoiTrangThai} className="rounded-xl border border-[#ceded3] bg-white px-4 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-emerald-700">Hủy</button>
        <button type="button" onClick={xacNhanDoiTrangThai} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-emerald-700 ${dangHoatDong ? 'bg-amber-700 hover:bg-amber-800' : 'bg-emerald-900 hover:bg-emerald-800'}`}>{dangHoatDong ? 'Ngừng sử dụng' : 'Mở lại câu hỏi'}</button>
      </div>
    </HopThoai>
  )
}
