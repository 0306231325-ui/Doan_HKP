import { ChevronDown, Eye, ImagePlus, ListChecks, Send, X } from 'lucide-react'
import FormField from '../shared/FormField'
import Button from '../shared/Button'
import TruongCauHoi from '../shared/TruongCauHoi'
import ThongBaoTrong from '../shared/ThongBaoTrong'
import useDangTin from '../../pages/tin-dang/hooks/useDangTin'
import XemTruocTin from '../../pages/tin-dang/XemTruocTin'

export default function FormDangTin({ loaiBanDau = 'lost', danhSachCauHoi = [] }) {
  const tin = useDangTin(loaiBanDau, danhSachCauHoi)
  const { duLieu, danhMuc, cauHoi, cauTraLoi, loaiForm, anh, loiAnh, loi, doiTruong, doiCauTraLoi, chonAnh, xoaAnh, xuLyGuiBieuMau } = tin
  const lopNhap = 'w-full rounded-xl border border-[#ceded3] bg-white px-3.5 py-3 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'

  function moThongTinBatBuoc(suKien) {
    suKien.currentTarget.open = true
  }

  return (
    <>
      <form onSubmit={xuLyGuiBieuMau} className="space-y-7 rounded-3xl border border-[#d6e4db] bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs text-[#718276]">Các mục có dấu <span className="font-bold text-rose-600">*</span> là bắt buộc.</p>
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-[#243c30]">Loại tin</legend>
          <div className="grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
            {[{ giaTri: 'lost', nhan: 'Báo mất đồ' }, { giaTri: 'found', nhan: 'Nhặt được đồ' }].map(({ giaTri, nhan }) => {
              const daChon = duLieu.loaiTin === giaTri
              return (
                <label key={giaTri} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold text-[#243c30] transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700 ${daChon ? 'border-emerald-700 bg-emerald-50' : 'border-[#ceded3] bg-white hover:bg-[#f8fbf9]'}`}>
                  <input type="radio" name="loaiTin" value={giaTri} checked={daChon} onChange={doiTruong} className="h-4 w-4 accent-emerald-800" />
                  <span>{nhan}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="border-t border-[#e4ece7] pt-6">
          <FormField as="select" label={<>Danh mục <span className="text-rose-600" aria-hidden="true">*</span></>} name="danhMucId" value={duLieu.danhMucId} onChange={doiTruong} required className={lopNhap}>
            <option value="" disabled>Chọn danh mục đồ vật</option>
            {danhMuc.map((muc) => <option key={muc.id} value={muc.id}>{muc.tenDanhMuc}</option>)}
          </FormField>
        </div>

        <fieldset className="space-y-5 border-t border-[#e4ece7] pt-6">
          <legend className="px-1 text-lg font-bold text-[#243c30]">Thông tin đồ vật</legend>
          {cauHoi.length > 0 ? <div className="min-h-40 space-y-4 rounded-2xl border border-dashed border-[#ceded3] bg-[#f8fcf9] p-4">
            {cauHoi.map((muc) => <TruongCauHoi key={muc.id} cauHoi={muc} loaiForm={loaiForm} giaTri={cauTraLoi[muc.id] ?? ''} khiThayDoi={doiCauTraLoi} />)}
          </div> : <ThongBaoTrong bieuTuong={ListChecks} tieuDe="Chưa có câu hỏi" moTa="Các câu hỏi sẽ hiển thị tại đây khi có dữ liệu." />}
        </fieldset>

        <fieldset className="space-y-4 border-t border-[#e4ece7] pt-6">
          <legend className="px-1 text-lg font-bold text-[#243c30]">Hình ảnh đồ vật</legend>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-[#c5dccc] bg-[#f8fcf9] px-4 py-7 text-center transition-colors hover:border-emerald-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700">
            <ImagePlus className="h-8 w-8 text-emerald-700" aria-hidden="true" />
            <span className="text-sm font-bold text-[#315a43]">Chọn ảnh từ thiết bị</span>
            <span className="text-xs leading-5 text-[#718276]">Tối đa 5 ảnh · JPG, PNG, WebP · Mỗi ảnh tối đa 5 MB</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={chonAnh} aria-label="Chọn hình ảnh đồ vật" aria-describedby={loiAnh ? 'loi-anh-dang-tin' : undefined} className="sr-only" />
          </label>
          {loiAnh && <p id="loi-anh-dang-tin" role="alert" className="text-sm text-red-700">{loiAnh}</p>}
          {anh.length > 0 && <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">{anh.map((muc) => <li key={muc.id} className="relative"><img src={muc.url} alt={muc.tep.name} className="aspect-square w-full rounded-xl border border-[#d6e4db] object-cover" /><button type="button" onClick={() => xoaAnh(muc.id)} aria-label={`Xóa ảnh ${muc.tep.name}`} className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-gray-700 shadow-sm hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-emerald-700"><X className="h-4 w-4" aria-hidden="true" /></button></li>)}</ul>}
        </fieldset>

        <details onInvalidCapture={moThongTinBatBuoc} className="group border-t border-[#e4ece7] pt-6">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg text-lg font-bold text-[#243c30] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 [&::-webkit-details-marker]:hidden">
            <span>Thông tin liên hệ <span className="text-rose-600" aria-hidden="true">*</span><span className="sr-only"> (bắt buộc)</span></span>
            <ChevronDown className="h-5 w-5 shrink-0 text-emerald-800 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="mt-5">
            <FormField label={<>Số điện thoại liên hệ <span className="text-rose-600" aria-hidden="true">*</span></>} name="soDienThoai" type="tel" autoComplete="tel" value={duLieu.soDienThoai} onChange={doiTruong} required pattern="[+]?[0-9 ]{9,20}" maxLength={20} title="Nhập từ 9 đến 20 chữ số hoặc dấu cách, có thể có dấu + ở đầu." placeholder="Số điện thoại để liên hệ về món đồ" />
          </div>
        </details>

        <div className="space-y-4 border-t border-[#e4ece7] pt-6">
          {loi && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{loi}</p>}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="submit" name="thaoTac" value="xem_truoc" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#ceded3] bg-white px-5 py-3 text-sm font-semibold text-[#315a43] transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><Eye className="h-4 w-4" aria-hidden="true" />Xem trước tin đăng</button>
            <Button type="submit" name="thaoTac" value="dang_tin" className="inline-flex items-center justify-center gap-2 px-6"><Send className="h-4 w-4" aria-hidden="true" />Đăng tin</Button>
          </div>
        </div>
      </form>
      {tin.moXemTruoc && <XemTruocTin {...tin} />}
    </>
  )
}
