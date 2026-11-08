import { ImagePlus, X } from 'lucide-react'
import { SO_ANH_TOI_DA } from '../../pages/tin-dang/hooks/xuLyDangTin.js'

export default function ChonAnh({ anh, loiAnh, chonAnh, xoaAnh, nhan, maLoi, disabled = false }) {
  return (
    <>
      <label className={`flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#c5dccc] bg-[#f8fcf9] px-4 py-7 text-center transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700 ${disabled ? 'opacity-70' : 'cursor-pointer hover:border-emerald-600'}`}>
        <ImagePlus className="h-8 w-8 text-emerald-700" aria-hidden="true" />
        <span className="text-sm font-bold text-[#315a43]">{disabled ? 'Đã chọn đủ ảnh' : 'Chọn ảnh từ thiết bị'}</span>
        <span role="status" className="text-xs leading-5 text-[#607568]">Đã chọn {anh.length}/{SO_ANH_TOI_DA} ảnh · JPG, PNG, WebP · Tối đa 5 MB/ảnh</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={chonAnh} disabled={disabled} aria-label={nhan} aria-describedby={loiAnh ? maLoi : undefined} className="sr-only" />
      </label>
      {loiAnh && <p id={maLoi} role="alert" className="text-sm text-red-700">{loiAnh}</p>}
      {anh.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {anh.map(({ id, tep, url }) => (
            <li key={id} className="relative">
              <img src={url} alt={tep.name} className="aspect-square w-full rounded-xl border border-[#d6e4db] object-cover" />
              <button type="button" onClick={() => xoaAnh(id)} aria-label={`Xóa ảnh ${tep.name}`} className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-gray-700 shadow-sm hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-emerald-700">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
