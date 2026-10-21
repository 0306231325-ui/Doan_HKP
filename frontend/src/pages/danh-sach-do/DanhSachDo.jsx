import { PackageSearch } from 'lucide-react'
import TheDoThatLac from '../../components/danh-sach-do/TheDoThatLac'
import TrangThaiDanhSachRong from '../../components/shared/TrangThaiDanhSachRong'
import ThanhTimKiem from '../../components/danh-sach-do/ThanhTimKiem'
import PhanTrang from '../../components/shared/PhanTrang'
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
          : <TrangThaiDanhSachRong loi={danhSach.loiNgay} coBoLoc={danhSach.coBoLoc} xoaBoLoc={danhSach.xoaBoLoc} />}
        {danhSach.tongTin > 0 && <PhanTrang {...danhSach} />}
      </section>
      {danhSach.doVatChon && <ChiTietDo {...danhSach} />}
    </div>
  )
}
