import { PackageSearch, SearchX } from 'lucide-react'
import TheDoThatLac from '../../components/TheDoThatLac'
import ThanhTimKiem from '../../components/ThanhTimKiem'
import PhanTrang from '../../components/PhanTrang'
import ChiTietDo from './ChiTietDo'
import useDanhSachDo from './hooks/useDanhSachDo'

export default function DanhSachDo() {
  const danhSach = useDanhSachDo()
  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex items-start gap-4 py-2 sm:py-4"><span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d6ebde] text-emerald-900 sm:flex"><PackageSearch className="h-6 w-6" aria-hidden="true" /></span><div><h1 className="text-2xl font-extrabold tracking-tight text-emerald-900 sm:text-3xl">Danh sách đồ thất lạc</h1><p className="mt-2 text-sm leading-6 text-[#687d70]">Tìm món đồ bạn đánh mất hoặc giúp đồ nhặt được trở về với chủ nhân.</p></div></header>
      <ThanhTimKiem {...danhSach} />
      <section aria-labelledby="tieu-de-ket-qua" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 id="tieu-de-ket-qua" className="text-lg font-bold text-[#243c30]">Các tin đăng</h2><p role="status" className="mt-1 text-xs text-[#718276]">{danhSach.tongTin} tin phù hợp{danhSach.tongTin > 0 ? ` · Hiển thị ${danhSach.tuViTri}–${danhSach.denViTri}` : ''}</p></div><div className="flex items-center gap-2"><label htmlFor="sap-xep-do-vat" className="text-xs text-[#687d70]">Sắp xếp</label><select id="sap-xep-do-vat" name="sapXep" value={danhSach.boLoc.sapXep} onChange={danhSach.doiTruongLoc} className="rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"><option value="moi_nhat">Mới nhất</option><option value="cu_nhat">Cũ nhất</option></select></div></div>
        {danhSach.cacDoVat.length > 0 ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{danhSach.cacDoVat.map((doVat) => <TheDoThatLac key={doVat.id} doVat={doVat} khiXemChiTiet={danhSach.moChiTiet} />)}</div>
          : <div className="flex flex-col items-center rounded-2xl border border-[#d6e4db] bg-white px-5 py-16 text-center"><SearchX className="mb-4 h-10 w-10 text-[#9aafa1]" aria-hidden="true" /><h3 className="font-semibold text-[#243c30]">{danhSach.loiNgay ? 'Kiểm tra lại khoảng ngày' : 'Chưa tìm thấy đồ phù hợp'}</h3><p className="mt-2 text-sm leading-6 text-[#718276]">{danhSach.loiNgay || 'Thử từ khóa khác hoặc mở rộng danh mục, địa điểm và thời gian.'}</p><button type="button" onClick={danhSach.xoaBoLoc} className="mt-5 rounded-xl bg-[#edf7f0] px-4 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-[#deede3] focus-visible:outline-2 focus-visible:outline-emerald-700">Xóa bộ lọc</button></div>}
        <PhanTrang {...danhSach} />
      </section>
      <p className="text-xs leading-5 text-[#718276]">Dữ liệu mẫu để xem thử giao diện.</p>
      {danhSach.doVatChon && <ChiTietDo {...danhSach} />}
    </div>
  )
}
