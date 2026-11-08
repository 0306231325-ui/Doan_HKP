import { ImagePlus } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import FormField from '../shared/FormField'
import Button from '../shared/Button'
import HopThoai from '../shared/HopThoai'
import ChonAnh from '../shared/ChonAnh'
import { SO_ANH_TOI_DA } from '../../pages/tin-dang/hooks/xuLyDangTin.js'

export default function FormYeuCauNhanDo() {
  const { anhBieuMau, loiNhan, datLoiNhan, xacNhan, datXacNhan, moXacNhan, dongXacNhan, guiYeuCau, dangGui, loi, tieuDeTrang } = useOutletContext()

  return (
    <>
      <h1 ref={tieuDeTrang} tabIndex={-1} className="text-3xl font-extrabold text-emerald-950 sm:text-4xl">Thêm ảnh và lời nhắn</h1>
      <fieldset disabled={dangGui} className="min-w-0 space-y-6 disabled:opacity-70">
        <section className="space-y-5 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="flex flex-wrap items-center gap-3 text-xl font-bold text-emerald-950">
            <ImagePlus className="h-5 w-5 text-emerald-700" aria-hidden="true" />Ảnh xác minh
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">Không bắt buộc</span>
          </h2>
          <p className="text-base leading-7 text-[#607568]">Chọn ảnh giúp nhận diện đồ vật, chẳng hạn ảnh chụp trước khi bị mất. Hiện ảnh chỉ được xem trước trên trang này.</p>
          <ChonAnh {...anhBieuMau} nhan="Chọn ảnh xác minh" maLoi="loi-anh-xac-minh" disabled={anhBieuMau.anh.length >= SO_ANH_TOI_DA} />
        </section>

        <section className="space-y-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-8 [&_.form-field]:gap-3 [&_.form-field_label]:text-lg!">
          <FormField as="textarea" label="Lời nhắn thêm" name="loiNhan" rows={4} maxLength={2000} value={loiNhan} onChange={(suKien) => datLoiNhan(suKien.target.value)} placeholder="Bổ sung chi tiết giúp xác minh đồ vật (không bắt buộc)" className="w-full rounded-xl border border-[#ceded3] bg-white px-4 py-3 text-lg leading-7 text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700" />
          <label className="flex items-start gap-3 text-base leading-7 text-[#315a43]">
            <input type="checkbox" checked={xacNhan} onChange={(suKien) => datXacNhan(suKien.target.checked)} required className="mt-1 h-4 w-4 shrink-0 accent-emerald-800" />
            <span>Tôi xác nhận thông tin cung cấp là đúng và đây là đồ vật của tôi.</span>
          </label>
        </section>
      </fieldset>

      {moXacNhan && (
        <HopThoai tieuDe="Xác nhận gửi yêu cầu" moTa="Quản trị viên sẽ nhận câu trả lời và lời nhắn. Ảnh xác minh và thông tin liên hệ chưa được gửi." khiDong={dongXacNhan}>
          <div className="space-y-5 p-6">
            {loi && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={dongXacNhan} disabled={dangGui} className="rounded-xl border border-[#ceded3] px-4 py-3 text-sm font-semibold">Hủy</button>
              <Button onClick={guiYeuCau} disabled={dangGui}>{dangGui ? 'Đang gửi…' : 'Xác nhận gửi'}</Button>
            </div>
          </div>
        </HopThoai>
      )}
    </>
  )
}
