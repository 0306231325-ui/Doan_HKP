import { CalendarDays } from 'lucide-react'
import { chuyenNgaySangISO, dinhDangNgay } from './hooks/xuLyThongKe'

function TruongNhapNgay({ id, nhan, giaTri, homNay, loiKhoangNgay, doiNgay }) {
  function chonNgay(suKien) {
    doiNgay(dinhDangNgay(suKien.target.value))
  }

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-[#607568]">{nhan}</label>
      <div className="flex rounded-xl border border-[#ceded3] bg-white focus-within:ring-2 focus-within:ring-emerald-700">
        <input
          id={id}
          type="text"
          value={giaTri}
          onChange={(suKien) => doiNgay(suKien.target.value)}
          placeholder="dd/mm/yyyy"
          maxLength={10}
          autoComplete="off"
          aria-invalid={Boolean(loiKhoangNgay)}
          aria-describedby={loiKhoangNgay ? 'goi-y-khoang-ngay loi-khoang-ngay' : 'goi-y-khoang-ngay'}
          className="min-w-0 flex-1 rounded-l-xl bg-transparent px-3 py-2.5 text-sm text-emerald-950 outline-none"
        />
        <div className="relative grid w-11 shrink-0 place-items-center rounded-r-xl border-l border-[#ceded3] text-emerald-800 hover:bg-emerald-50 focus-within:bg-emerald-50">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          <input
            type="date"
            aria-label={`Chọn ${nhan.toLowerCase()} từ lịch`}
            value={chuyenNgaySangISO(giaTri)}
            max={homNay}
            onChange={chonNgay}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

export default function BoLocThoiGian({ tuNgay, denNgay, homNay, loiKhoangNgay, doiTuNgay, doiDenNgay, apDungKhoangNgay, xoaKhoangNgay }) {
  return (
    <section aria-label="Bộ lọc thời gian" className="rounded-2xl border border-[#d6e4db] bg-white p-4 sm:px-6 sm:py-5">
      <div className="flex items-center gap-3">
        <CalendarDays className="h-5 w-5 shrink-0 text-emerald-800" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-semibold text-[#243c30]">Khoảng thời gian</h2>
          <p id="goi-y-khoang-ngay" className="mt-0.5 text-xs text-[#6b7e72]">Thống kê theo ngày đăng tin. Nhập theo dd/mm/yyyy hoặc chọn từ lịch.</p>
        </div>
      </div>
      <form onSubmit={apDungKhoangNgay} noValidate className="mt-4 border-t border-[#e5ede8] pt-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end">
          <TruongNhapNgay id="tu-ngay" nhan="Từ ngày" giaTri={tuNgay} homNay={homNay} loiKhoangNgay={loiKhoangNgay} doiNgay={doiTuNgay} />
          <TruongNhapNgay id="den-ngay" nhan="Đến ngày" giaTri={denNgay} homNay={homNay} loiKhoangNgay={loiKhoangNgay} doiNgay={doiDenNgay} />
          <div className="flex flex-wrap gap-2 sm:col-span-2 xl:col-span-1">
            <button type="submit" className="rounded-xl bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Áp dụng</button>
            <button type="button" onClick={xoaKhoangNgay} className="rounded-xl border border-[#ceded3] px-4 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Xóa bộ lọc</button>
          </div>
        </div>
        {loiKhoangNgay && <p id="loi-khoang-ngay" role="alert" className="mt-3 text-sm text-red-700">{loiKhoangNgay}</p>}
      </form>
    </section>
  )
}
