import { Eye, Send } from 'lucide-react'
import TruongNoiDungTinDang from './TruongNoiDungTinDang'
import Button from '../shared/Button'
import TruongCauHoi from '../shared/TruongCauHoi'
import ChonAnh from '../shared/ChonAnh'
import XemTruocTin from '../../pages/tin-dang/XemTruocTin'

export default function FormDangTin({ tin }) {
  const { duLieu, cauHoi, cauTraLoi, anh, loiAnh, loi, doiTruong, doiCauTraLoi, chonAnh, xoaAnh, xuLyGuiBieuMau } = tin

  return (
    <>
      <form onSubmit={xuLyGuiBieuMau} className="space-y-7 rounded-3xl border border-[#d6e4db] bg-white p-5 shadow-sm sm:p-8">
        <fieldset disabled={tin.dangGui} className="min-w-0 space-y-6 disabled:opacity-70">
          <p className="text-xs text-[#718276]">Các mục có dấu <span className="font-bold text-rose-600">*</span> là bắt buộc.</p>
          <fieldset className="space-y-4 border-t border-[#e4ece7] pt-5">
            <legend className="px-1 text-lg font-bold text-[#243c30]">Thông tin công khai</legend>
            <TruongNoiDungTinDang duLieu={duLieu} diaDiem={tin.diaDiem} ngayToiDa={tin.ngayToiDa} doiTruong={doiTruong} dangTaiDiaDiem={tin.dangTaiDanhMuc} />
          </fieldset>

          {tin.dangTaiCauHoi ? <p role="status" className="text-sm text-[#718276]">Đang tải câu hỏi…</p> : tin.loiTaiCauHoi ? <p role="alert" className="text-sm text-rose-700">{tin.loiTaiCauHoi} <button type="button" onClick={tin.taiLaiCauHoi} className="underline">Thử lại</button></p> : <fieldset className="space-y-4 rounded-2xl border border-[#d6e4db] bg-[#f8fcf9] p-4 sm:p-5">
            <legend className="px-1 text-base font-bold text-[#243c30]">Thông tin đối chiếu · Giữ kín</legend>
            <p className="text-xs leading-5 text-[#607568]">Các câu trả lời dưới đây không hiển thị trên tin đăng và sẽ dùng để xác minh yêu cầu nhận đồ.</p>
            {cauHoi.map((muc) => <TruongCauHoi key={muc.id} cauHoi={muc} giaTri={cauTraLoi[muc.id] ?? ''} khiThayDoi={doiCauTraLoi} />)}
            {!cauHoi.length && <p className="text-sm text-amber-800">Danh mục này chưa có câu hỏi nhận diện. Quản trị viên cần thiết lập câu hỏi trước khi đăng tin.</p>}
            <button type="button" onClick={tin.taiLaiCauHoi} className="text-xs font-semibold text-emerald-800 underline">Tải lại câu hỏi</button>
          </fieldset>}

          <fieldset className="space-y-4 border-t border-[#e4ece7] pt-6">
            <legend className="px-1 text-lg font-bold text-[#243c30]">Hình ảnh đồ vật</legend>
            <ChonAnh anh={anh} loiAnh={loiAnh} chonAnh={chonAnh} xoaAnh={xoaAnh} nhan="Chọn hình ảnh đồ vật" maLoi="loi-anh-dang-tin" />
          </fieldset>

          <div className="space-y-4 border-t border-[#e4ece7] pt-6">
            {loi && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{loi}</p>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="submit" name="thaoTac" value="xem_truoc" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#ceded3] bg-white px-5 py-3 text-sm font-semibold text-[#315a43] transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><Eye className="h-4 w-4" aria-hidden="true" />Xem trước tin đăng</button>
              <Button type="submit" name="thaoTac" value="dang_tin" disabled={tin.dangTaiCauHoi || Boolean(tin.loiTaiCauHoi)} className="inline-flex items-center justify-center gap-2 px-6"><Send className="h-4 w-4" aria-hidden="true" />Đăng tin</Button>
            </div>
          </div>
        </fieldset>
      </form>
      {tin.moXemTruoc && <XemTruocTin {...tin} />}
    </>
  )
}
