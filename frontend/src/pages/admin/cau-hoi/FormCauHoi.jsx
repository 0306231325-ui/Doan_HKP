import { cacKieuNhap } from '../../../components/shared/quyTacCauHoi.js'
import { useEffect, useRef } from 'react'
import HopThoai from '../../../components/shared/HopThoai'

export default function FormCauHoi({ bieuMau, danhMuc, loi, loiLuu, dongBieuMau, doiBieuMau, luuCauHoi }) {
  const laChung = bieuMau.danhMucId === null
  const lopNhap = 'w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-2.5 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'
  const oNoiDung = useRef(null)

  useEffect(function tapTrungCauHoi() {
    oNoiDung.current?.focus({ preventScroll: true })
  }, [])

  return (
    <HopThoai tieuDe={bieuMau.id ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi'} moTa={laChung ? 'Dùng chung cho mọi danh mục và cả hai loại tin. Không bắt buộc trả lời.' : `Câu hỏi riêng cho danh mục ${danhMuc.find((muc) => muc.id === bieuMau.danhMucId)?.tenDanhMuc || 'đang chọn'}. Câu trả lời được giữ kín và bắt buộc khi đăng tin, xin nhận lại.`} khiDong={dongBieuMau}>
      <form onSubmit={luuCauHoi} noValidate>
        <div className="space-y-5 px-5 py-5 sm:px-6">
          {loi.danhMucId && <p role="alert" className="text-sm text-rose-700">{loi.danhMucId}</p>}
          <div>
            <label htmlFor="nhan-dang-tin" className="mb-2 block text-sm font-semibold text-[#243c30]">Câu hỏi khi đăng tin <span className="text-red-600">*</span></label>
            <input ref={oNoiDung} id="nhan-dang-tin" name="nhanDangTin" value={bieuMau.nhanDangTin} onChange={doiBieuMau} maxLength={250} required aria-invalid={Boolean(loi.nhanDangTin)} aria-describedby={loi.nhanDangTin ? 'loi-nhan-dang-tin' : undefined} placeholder="Ví dụ: Thiết bị thuộc hãng nào?" className={lopNhap} />
            {loi.nhanDangTin && <p id="loi-nhan-dang-tin" role="alert" className="mt-1 text-xs text-red-700">{loi.nhanDangTin}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_96px]">
            <div><label htmlFor="kieu-nhap-cau-hoi" className="mb-2 block text-sm font-semibold text-[#243c30]">Kiểu trả lời</label><select id="kieu-nhap-cau-hoi" name="kieuNhap" value={bieuMau.kieuNhap} onChange={doiBieuMau} aria-invalid={Boolean(loi.kieuNhap)} aria-describedby={loi.kieuNhap ? 'loi-kieu-nhap' : undefined} className={lopNhap}>{Object.entries(cacKieuNhap).map(([giaTri, nhan]) => <option key={giaTri} value={giaTri}>{nhan}</option>)}</select></div>
            <div><label htmlFor="thu-tu-cau-hoi" className="mb-2 block text-sm font-semibold text-[#243c30]">Thứ tự</label><input id="thu-tu-cau-hoi" type="number" min={1} max={999} step={1} name="thuTu" value={bieuMau.thuTu} onChange={doiBieuMau} aria-invalid={Boolean(loi.thuTu)} aria-describedby={loi.thuTu ? 'loi-thu-tu' : undefined} className={lopNhap} /></div>
          </div>
          {loi.kieuNhap && <p id="loi-kieu-nhap" role="alert" className="text-xs text-red-700">{loi.kieuNhap}</p>}
          {loi.thuTu && <p id="loi-thu-tu" role="alert" className="text-xs text-red-700">{loi.thuTu}</p>}
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
