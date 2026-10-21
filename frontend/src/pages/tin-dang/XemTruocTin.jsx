import HopThoai from '../../components/shared/HopThoai'
import Button from '../../components/shared/Button'

export default function XemTruocTin({ duLieu, danhMuc, cauHoi, cauTraLoi, loaiForm, anh, dongXemTruoc }) {
  const tenDanhMuc = danhMuc.find((muc) => muc.id === duLieu.danhMucId)?.tenDanhMuc
  const cauHoiCongKhai = cauHoi.filter((muc) => muc.apDung[loaiForm].congKhai && String(cauTraLoi[muc.id] ?? '').trim())

  return (
    <HopThoai tieuDe="Xem trước tin đăng" moTa="Đây là nội dung hiển thị công khai. Tin chưa được gửi hoặc đăng lên hệ thống." khiDong={dongXemTruoc}>
      <article className="space-y-5 px-5 py-6 sm:px-6">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${duLieu.loaiTin === 'found' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'}`}>{duLieu.loaiTin === 'found' ? 'Nhặt được' : 'Báo mất'}</span>
        {anh.length > 0 && <div className="grid grid-cols-2 gap-3">{anh.map((muc) => <img key={muc.id} src={muc.url} alt={muc.tep.name} className="aspect-square w-full rounded-xl object-cover" />)}</div>}
        <dl className="grid grid-cols-1 gap-3 text-sm text-[#607568]">
          <div><dt className="font-semibold text-[#243c30]">Danh mục</dt><dd>{tenDanhMuc}</dd></div>
          <div><dt className="font-semibold text-[#243c30]">Liên hệ</dt><dd>{duLieu.soDienThoai.trim()}</dd></div>
        </dl>
        {cauHoiCongKhai.map((muc) => <div key={muc.id} className="text-sm"><p className="font-semibold text-[#243c30]">{muc.nhanDangTin}</p><p className="whitespace-pre-wrap break-words text-[#607568]">{muc.kieuNhap === 'chon_mot' ? muc.luaChon.find((luaChon) => luaChon.id === cauTraLoi[muc.id])?.nhan : cauTraLoi[muc.id]}</p></div>)}
        <Button onClick={dongXemTruoc} className="w-full">Tiếp tục chỉnh sửa</Button>
      </article>
    </HopThoai>
  )
}
