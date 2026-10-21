import { PackageSearch } from 'lucide-react'
import DanhSachDoThatLac from '../../components/danh-sach-do/DanhSachDoThatLac'
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
      <DanhSachDoThatLac
        danhSachDo={danhSach.cacDoVat}
        tongTin={danhSach.tongTin}
        trangHienTai={danhSach.trangHienTai}
        loiNgay={danhSach.loiNgay}
        coBoLoc={danhSach.coBoLoc}
        xoaBoLoc={danhSach.xoaBoLoc}
        khiXemChiTiet={danhSach.moChiTiet}
        tieuDe="Các tin đăng"
        tuyChon={<div className="flex shrink-0 items-center gap-2"><label htmlFor="sap-xep-do-vat" className="text-xs text-[#687d70]">Sắp xếp</label><select id="sap-xep-do-vat" name="sapXep" value={danhSach.boLoc.sapXep} onChange={danhSach.doiTruongLoc} className="rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-sm text-[#243c30] outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"><option value="moi_nhat">Mới nhất</option><option value="cu_nhat">Cũ nhất</option></select></div>}
      />
      {danhSach.tongTin > 0 && <PhanTrang {...danhSach} />}
      {danhSach.doVatChon && <ChiTietDo {...danhSach} />}
    </div>
  )
}
