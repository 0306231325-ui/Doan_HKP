import { Eye, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import BoLocDanhSach from '../../../components/shared/BoLocDanhSach'
import PhanTrang from '../../../components/shared/PhanTrang'
import DanhSachCauHoi from './DanhSachCauHoi'
import FormCauHoi from './FormCauHoi'
import ChiTietCauHoi from './ChiTietCauHoi'
import XacNhanCauHoi from './XacNhanCauHoi'
import XemTruocForm from './XemTruocForm'
import useQuanLyCauHoi from './hooks/useQuanLyCauHoi'

export default function QuanLyCauHoi() {
  const cauHoi = useQuanLyCauHoi()
  const coBoLoc = Boolean(cauHoi.tuKhoa.trim() || cauHoi.trangThai !== 'tat_ca')
  const lopNut = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div className="space-y-4">
      <section aria-label="Quản lý câu hỏi" className="rounded-2xl border border-[#d6e4db] bg-white">
        <div className="flex flex-wrap items-end justify-between gap-4 px-5 py-5 sm:px-6">
          <div className="w-full sm:max-w-sm"><label htmlFor="danh-muc-cau-hoi" className="mb-2 block text-xs font-semibold text-[#526c5b]">Danh mục đồ vật</label><select id="danh-muc-cau-hoi" value={cauHoi.danhMucChon?.id || ''} onChange={cauHoi.doiDanhMuc} disabled={cauHoi.dangTaiDanhMuc || !cauHoi.danhMuc.length} className="w-full rounded-xl border border-[#ceded3] bg-[#fafcfb] px-3 py-2.5 text-sm font-medium text-[#243c30] focus-visible:outline-2 focus-visible:outline-emerald-700"><option value="">{cauHoi.dangTaiDanhMuc ? 'Đang tải danh mục…' : 'Chọn danh mục đồ vật'}</option>{cauHoi.danhMuc.map((muc) => <option key={muc.id} value={muc.id}>{muc.tenDanhMuc}{muc.dangHoatDong ? '' : ' (Ngừng sử dụng)'}</option>)}</select></div>
          <button id="them-cau-hoi" type="button" aria-haspopup="dialog" onClick={cauHoi.moThem} disabled={cauHoi.dangTai || Boolean(cauHoi.loiTai) || !cauHoi.danhMucChon?.dangHoatDong} className={`${lopNut} bg-emerald-900 text-white hover:bg-emerald-800`}><Plus className="h-4 w-4" aria-hidden="true" />Thêm câu hỏi</button>
        </div>
        {cauHoi.loiTaiDanhMuc && <div role="alert" className="space-y-3 p-5 text-center text-sm text-rose-700"><p>{cauHoi.loiTaiDanhMuc}</p><button type="button" onClick={cauHoi.taiLaiDanhMuc} className="rounded-lg bg-emerald-900 px-4 py-2 text-white">Thử lại</button></div>}
        {cauHoi.dangTai ? <p role="status" className="p-8 text-center text-sm text-[#607568]">Đang tải câu hỏi từ DB…</p> : cauHoi.loiTai ? <div role="alert" className="space-y-3 p-6 text-center text-sm text-rose-700"><p>{cauHoi.loiTai}</p><button type="button" onClick={cauHoi.taiLai} className="rounded-lg bg-emerald-900 px-4 py-2 text-white">Tải lại câu hỏi</button></div> : cauHoi.dangTaiDanhMuc ? <p role="status" className="p-8 text-center text-sm text-[#607568]">Đang tải danh mục…</p> : cauHoi.loiTaiDanhMuc ? null : !cauHoi.danhMuc.length ? <div className="border-t border-[#e8efea] px-5 py-8 text-center text-sm leading-6 text-[#687d70]">Tạo danh mục trước khi thiết lập câu hỏi. <Link to="/admin/danh-muc" className="font-semibold text-emerald-900 underline">Đến quản lý danh mục</Link></div> : !cauHoi.danhMucChon ? <p className="border-t border-[#e8efea] px-5 py-10 text-center text-sm text-[#607568]">Chọn danh mục để xem và quản lý câu hỏi.</p> : <>
          {!cauHoi.danhMucChon.dangHoatDong && <p className="mx-5 mb-4 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800 sm:mx-6">Danh mục đã ngừng sử dụng. Mở lại danh mục để thêm hoặc mở lại câu hỏi.</p>}
          <BoLocDanhSach {...cauHoi} doiTrangThai={cauHoi.doiTrangThai} nhanTimKiem="Tìm câu hỏi" goiYTimKiem="Tìm nội dung câu hỏi…" nhanTrangThai="Lọc trạng thái câu hỏi" nhanHoatDong="Đang dùng" />
          <DanhSachCauHoi {...cauHoi} coBoLoc={coBoLoc} />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e1eae4] px-5 py-4 sm:px-6"><div className="flex flex-wrap items-center gap-3 text-xs"><p aria-live="polite" className="text-[#718276]">{cauHoi.tongTin} / {cauHoi.tongCauHoi} câu hỏi</p>{coBoLoc && <button type="button" onClick={cauHoi.xoaBoLoc} className="rounded-lg px-2 py-1.5 font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700">Xóa bộ lọc</button>}</div><button type="button" aria-haspopup="dialog" onClick={cauHoi.moXemTruoc} className={`${lopNut} border border-[#ceded3] text-emerald-900 hover:bg-[#f0f6f2]`}><Eye className="h-4 w-4" aria-hidden="true" />Xem thử form</button></div>
          <div className="px-5 sm:px-6"><PhanTrang {...cauHoi} donVi="câu hỏi" nhanDieuHuong="Phân trang câu hỏi theo danh mục" /></div>
        </>}
      </section>
      {cauHoi.bieuMau && !cauHoi.thaoTacChoXacNhan && <FormCauHoi {...cauHoi} />}
      {cauHoi.thaoTacChoXacNhan && <XacNhanCauHoi {...cauHoi} />}
      {cauHoi.cauHoiChon && <ChiTietCauHoi {...cauHoi} />}
      {cauHoi.xemTruoc && cauHoi.danhMucChon && <XemTruocForm {...cauHoi} />}
    </div>
  )
}
