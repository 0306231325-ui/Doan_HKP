import { useEffect, useRef } from 'react'
import HopThoai from '../../../components/shared/HopThoai'

export default function FormDanhMuc({ dangLuu, bieuMau, loiBieuMau, dongBieuMau, thayDoiBieuMau, yeuCauThemDanhMuc }) {
  const tenDanhMucRef = useRef(null)

  useEffect(function tapTrungTenDanhMuc() {
    tenDanhMucRef.current?.focus()
  }, [])

  return (
    <HopThoai tieuDe="Thêm danh mục" moTa="Nhập tên danh mục rồi bấm Lưu danh mục." khiDong={dongBieuMau}>
      <form aria-busy={dangLuu} onSubmit={yeuCauThemDanhMuc} noValidate>
        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div>
            <label htmlFor="ten-danh-muc" className="mb-2 block text-sm font-semibold text-[#243c30]">Tên danh mục <span className="text-red-600">*</span></label>
            <input ref={tenDanhMucRef} disabled={dangLuu} id="ten-danh-muc" name="tenDanhMuc" value={bieuMau.tenDanhMuc} onChange={thayDoiBieuMau} maxLength={100} required aria-invalid={Boolean(loiBieuMau.tenDanhMuc)} aria-describedby={loiBieuMau.tenDanhMuc ? 'loi-ten-danh-muc' : undefined} placeholder="Nhập tên danh mục" className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-[#243c30] outline-none placeholder:text-[#9aaa9f] focus-visible:ring-2 focus-visible:ring-emerald-700 ${loiBieuMau.tenDanhMuc ? 'border-red-500' : 'border-[#ceded3]'}`} />
            {loiBieuMau.tenDanhMuc && <p id="loi-ten-danh-muc" role="alert" className="mt-2 text-xs leading-5 text-red-700">{loiBieuMau.tenDanhMuc}</p>}
          </div>
          <div>
            <label htmlFor="mo-ta-danh-muc" className="mb-2 block text-sm font-semibold text-[#243c30]">Mô tả <span className="font-normal text-[#7b8e80]">(không bắt buộc)</span></label>
            <textarea disabled={dangLuu} id="mo-ta-danh-muc" name="moTa" value={bieuMau.moTa} onChange={thayDoiBieuMau} maxLength={500} rows={3} aria-invalid={Boolean(loiBieuMau.moTa)} aria-describedby={loiBieuMau.moTa ? 'loi-mo-ta-danh-muc' : 'goi-y-mo-ta-danh-muc'} placeholder="Ví dụ các loại đồ vật thuộc danh mục này…" className="w-full resize-y rounded-xl border border-[#ceded3] bg-white px-3.5 py-3 text-sm leading-6 text-[#243c30] outline-none placeholder:text-[#9aaa9f] focus-visible:ring-2 focus-visible:ring-emerald-700" />
            {loiBieuMau.moTa ? <p id="loi-mo-ta-danh-muc" role="alert" className="mt-1 text-xs text-red-700">{loiBieuMau.moTa}</p> : <p id="goi-y-mo-ta-danh-muc" className="mt-1 text-right text-xs text-[#7b8e80]">{bieuMau.moTa.length}/500 ký tự</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-[#e1eae4] bg-[#f9fbfa] px-5 py-4 sm:px-6">
          <button type="button" disabled={dangLuu} onClick={dongBieuMau} className="rounded-xl border border-[#ceded3] bg-white px-5 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Hủy</button>
          <button type="submit" disabled={dangLuu} className="rounded-xl bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-wait disabled:opacity-60">{dangLuu ? 'Đang lưu…' : 'Lưu danh mục'}</button>
        </div>
      </form>
    </HopThoai>
  )
}
