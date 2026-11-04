import { layQuyTacCauHoi } from '../../components/shared/quyTacCauHoi.js'
import HopThoai from '../../components/shared/HopThoai'
import Button from '../../components/shared/Button'

export default function XemTruocTin({ duLieu, danhMuc, cauHoi, cauTraLoi, anh, dongXemTruoc, moXacNhan, dangGui, xacNhanDang, loi }) {
  const tenDanhMuc = danhMuc.find((muc) => muc.id === duLieu.danhMucId)?.tenDanhMuc
  const cauHoiCongKhai = cauHoi.filter((muc) => layQuyTacCauHoi(muc).congKhai && String(cauTraLoi[muc.id] ?? '').trim())

  return (
    <HopThoai tieuDe={moXacNhan ? 'Xác nhận đăng tin' : 'Xem trước tin đăng'} moTa="Nội dung công khai sẽ hiển thị như bên dưới. Câu trả lời đối chiếu được giữ kín." khiDong={dongXemTruoc}>
      <article className="space-y-5 px-5 py-6 sm:px-6">
        <h3 className="break-words text-xl font-bold text-[#243c30]">{duLieu.tieuDe}</h3>
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${duLieu.loaiTin === 'found' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'}`}>{duLieu.loaiTin === 'found' ? 'Nhặt được' : 'Báo mất'}</span>
        {anh.length > 0 && <div className="grid grid-cols-2 gap-3">{anh.map((muc) => <img key={muc.id} src={muc.url} alt={muc.tep.name} className="aspect-square w-full rounded-xl object-cover" />)}</div>}
        <dl className="grid grid-cols-1 gap-3 text-sm text-[#607568]">
          <div><dt className="font-semibold text-[#243c30]">Danh mục</dt><dd>{tenDanhMuc}</dd></div>
          <div><dt className="font-semibold text-[#243c30]">Thời gian và vị trí</dt><dd>{duLieu.ngayXayRa} · {duLieu.diaDiemChiTiet}</dd></div>
          <div><dt className="font-semibold text-[#243c30]">Liên hệ</dt><dd>{duLieu.soDienThoai.trim() && 'Số điện thoại: ****'}{duLieu.soDienThoai.trim() && duLieu.email.trim() && ' · '}{duLieu.email.trim() && 'Email: ****'}</dd></div>
        </dl>
        {duLieu.moTa && <p className="whitespace-pre-wrap break-words text-sm text-[#607568]">{duLieu.moTa}</p>}
        {cauHoiCongKhai.map((muc) => <div key={muc.id} className="text-sm"><p className="font-semibold text-[#243c30]">{muc.nhanDangTin}</p><p className="whitespace-pre-wrap break-words text-[#607568]">{cauTraLoi[muc.id]}</p></div>)}
        {loi && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={dongXemTruoc} disabled={dangGui} className="rounded-xl border border-[#ceded3] px-4 py-3 text-sm font-semibold text-[#315a43] disabled:opacity-50">{moXacNhan ? 'Hủy' : 'Tiếp tục chỉnh sửa'}</button>
          {moXacNhan && <Button onClick={xacNhanDang} disabled={dangGui}>{dangGui ? 'Đang đăng…' : 'Xác nhận đăng tin'}</Button>}
        </div>
      </article>
    </HopThoai>
  )
}
