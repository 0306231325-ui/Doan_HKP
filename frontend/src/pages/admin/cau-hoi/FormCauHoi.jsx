import { useEffect, useRef } from 'react'
import HopThoai from '../../../components/shared/HopThoai'

export default function FormCauHoi({ bieuMau, loi, loiLuu, dongBieuMau, doiBieuMau, luuCauHoi }) {
  const lopNhap = 'w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-2.5 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'
  const oNoiDung = useRef(null)

  useEffect(function tapTrungCauHoi() {
    oNoiDung.current?.focus({ preventScroll: true })
  }, [])

  return (
    <HopThoai tieuDe={bieuMau.id ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi'} khiDong={dongBieuMau}>
      <form onSubmit={luuCauHoi} noValidate>
        <div className="space-y-5 px-5 py-5 sm:px-6">
          {loi.danhMucId && <p role="alert" className="text-sm text-rose-700">{loi.danhMucId}</p>}
          <div>
            <label htmlFor="nhan-dang-tin" className="mb-2 block text-sm font-semibold text-[#243c30]">Câu hỏi khi đăng tin <span className="text-red-600">*</span></label>
            <input ref={oNoiDung} id="nhan-dang-tin" name="nhanDangTin" value={bieuMau.nhanDangTin} onChange={doiBieuMau} maxLength={250} required aria-invalid={Boolean(loi.nhanDangTin)} aria-describedby={loi.nhanDangTin ? 'loi-nhan-dang-tin' : undefined} placeholder="Nhập câu hỏi tại đây" className={lopNhap} />
            {loi.nhanDangTin && <p id="loi-nhan-dang-tin" role="alert" className="mt-1 text-xs text-red-700">{loi.nhanDangTin}</p>}
          </div>
          {loi.thuTu && <p role="alert" className="text-xs text-red-700">{loi.thuTu}</p>}
          {loiLuu && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm leading-6 text-red-700">{loiLuu}</p>}
        </div>
        <div className="flex justify-end gap-3 border-t border-[#e1eae4] bg-[#f9fbfa] px-5 py-4 sm:px-6">
          <button type="button" onClick={dongBieuMau} className="rounded-xl border border-[#ceded3] bg-white px-4 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-emerald-700">Hủy</button>
          <button type="submit" className="rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-emerald-700">{bieuMau.id ? 'Lưu thay đổi' : 'Thêm câu hỏi'}</button>
        </div>
      </form>
    </HopThoai>
  )
}
