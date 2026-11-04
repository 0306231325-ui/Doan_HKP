import FormField from '../shared/FormField'
import Button from '../shared/Button'
import TruongCauHoi from '../shared/TruongCauHoi'
import HopThoai from '../shared/HopThoai'

export default function FormYeuCauNhanDo({ cauHoi, cauTraLoi, doiCauTraLoi, loiNhan, datLoiNhan, xacNhan, datXacNhan, yeuCauGui, moXacNhan, dongXacNhan, guiYeuCau, dangGui, loi }) {
  return <>
    <form onSubmit={yeuCauGui} className="rounded-2xl border border-[#d6e4db] bg-white p-5 sm:p-6">
      <fieldset disabled={dangGui} className="space-y-5">
        <div><h2 className="text-lg font-bold text-[#243c30]">Thông tin xác minh</h2><p className="mt-2 text-sm leading-6 text-[#607568]">Trả lời các câu hỏi đã được gắn với tin đăng. Câu trả lời chỉ dùng để quản trị viên đối chiếu, không công khai.</p></div>
        {cauHoi.map((cau) => <TruongCauHoi key={cau.id} cauHoi={cau} loaiForm="nhan_lai" giaTri={cauTraLoi[cau.id] ?? ''} khiThayDoi={doiCauTraLoi} />)}
        <FormField as="textarea" label="Lời nhắn thêm" name="loiNhan" rows={3} maxLength={2000} value={loiNhan} onChange={(suKien) => datLoiNhan(suKien.target.value)} />
        <label className="flex items-start gap-3 text-sm leading-6 text-[#315a43]"><input type="checkbox" checked={xacNhan} onChange={(suKien) => datXacNhan(suKien.target.checked)} required className="mt-1 h-4 w-4 shrink-0 accent-emerald-800" /><span>Tôi xác nhận thông tin cung cấp là đúng và đây là đồ vật của tôi.</span></label>
        {loi && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
        <Button type="submit" className="w-full">Gửi yêu cầu nhận lại đồ</Button>
      </fieldset>
    </form>
    {moXacNhan && <HopThoai tieuDe="Xác nhận gửi yêu cầu" moTa="Yêu cầu sẽ được gửi tới quản trị viên để xác minh. Sau khi gửi, bạn có thể xem liên hệ của người đăng." khiDong={dongXacNhan}>
      <div className="space-y-5 p-6">
        {loi && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
        <div className="flex justify-end gap-3"><button type="button" onClick={dongXacNhan} disabled={dangGui} className="rounded-xl border border-[#ceded3] px-4 py-3 text-sm font-semibold">Hủy</button><Button onClick={guiYeuCau} disabled={dangGui}>{dangGui ? 'Đang gửi…' : 'Xác nhận gửi'}</Button></div>
      </div>
    </HopThoai>}
  </>
}
