export default function PhanTrang({
  trangHienTai = 1,
  tongSoTrang = 5,
  tongSoTin = 48,
  soTinHienThi = 6,
  onChuyenTrang,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-xs text-gray-500">
      <div>
        <span>Đang hiển thị </span>
        <strong className="text-gray-800 font-semibold">{soTinHienThi}</strong>
        <span> trong tổng số </span>
        <strong className="text-gray-800 font-semibold">{tongSoTin}</strong>
        <span> tin thất lạc trong tháng</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChuyenTrang && onChuyenTrang(Math.max(1, trangHienTai - 1))}
          disabled={trangHienTai === 1}
          className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Trang trước
        </button>

        <button
          type="button"
          onClick={() => onChuyenTrang && onChuyenTrang(1)}
          className={`w-8 h-8 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center ${
            trangHienTai === 1
              ? 'bg-[#13382c] text-white shadow-sm'
              : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
          }`}
        >
          1
        </button>

        <button
          type="button"
          onClick={() => onChuyenTrang && onChuyenTrang(2)}
          className={`w-8 h-8 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center ${
            trangHienTai === 2
              ? 'bg-[#13382c] text-white shadow-sm'
              : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
          }`}
        >
          2
        </button>

        <span className="px-1 text-gray-400">...</span>

        <button
          type="button"
          onClick={() => onChuyenTrang && onChuyenTrang(5)}
          className={`w-8 h-8 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center ${
            trangHienTai === 5
              ? 'bg-[#13382c] text-white shadow-sm'
              : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
          }`}
        >
          5
        </button>

        <button
          type="button"
          onClick={() => onChuyenTrang && onChuyenTrang(Math.min(tongSoTrang, trangHienTai + 1))}
          disabled={trangHienTai === tongSoTrang}
          className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Trang sau
        </button>
      </div>
    </div>
  )
}
