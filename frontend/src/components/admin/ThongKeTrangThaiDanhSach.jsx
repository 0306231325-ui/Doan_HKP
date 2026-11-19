export default function ThongKeTrangThaiDanhSach({ nhanTong, tong, soHoatDong, soNgungSuDung, nhanNgungSuDung = 'Ngừng sử dụng' }) {
  return (
    <dl aria-live="polite" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#718276]">
      <div className="flex items-center gap-1.5"><dt>{nhanTong}</dt><dd className="font-semibold text-[#243c30]">{tong}</dd></div>
      <div className="flex items-center gap-1.5"><dt>Đang hoạt động</dt><dd className="font-semibold text-emerald-800">{soHoatDong}</dd></div>
      <div className="flex items-center gap-1.5"><dt>{nhanNgungSuDung}</dt><dd className="font-semibold text-[#526c5b]">{soNgungSuDung}</dd></div>
    </dl>
  )
}
