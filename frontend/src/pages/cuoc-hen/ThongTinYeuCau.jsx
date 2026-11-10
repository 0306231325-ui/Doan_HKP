import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import HopThoai from '../../components/shared/HopThoai'

const ngay = (value) => value ? new Date(value).toLocaleDateString('vi-VN') : 'Chưa cung cấp'

export default function ThongTinYeuCau({ yc }) {
  const [viTri, datViTri] = useState(0)
  const [moAnh, datMoAnh] = useState(false)
  const ct = yc.chi_tiet
  if (!ct) return null
  const anh = ct.anh || []
  const hienTai = anh[Math.min(viTri, Math.max(0, anh.length - 1))]
  const laTinMat = ct.loaiTin === 'bao_mat'
  const thongTin = [
    ['Loại đồ vật', ct.danhMuc],
    [laTinMat ? 'Thời gian mất' : 'Thời gian nhặt được', ct.thoiGianXayRa ? [ngay(ct.thoiGianXayRa), ct.gioXayRa].filter(Boolean).join(' · ') : null],
    ['Địa điểm', [ct.diaDiem, ct.viTriChiTiet].filter(Boolean).join(' · ')],
  ].filter(([, value]) => value)

  function chuyenAnh(buoc) { datViTri((cu) => (cu + buoc + anh.length) % anh.length) }
  function boSuuTap(phongTo = false) {
    return <div className="relative overflow-hidden rounded-xl bg-[#f5f8f6]">
      <img src={hienTai.url} alt={hienTai.moTa || yc.tin_dang?.tieu_de || 'Ảnh đồ vật'} onError={(e) => { if (!e.currentTarget.src.endsWith('/do-vat-trong.svg')) e.currentTarget.src = '/do-vat-trong.svg' }} className={phongTo ? 'h-[60vh] w-full object-contain' : 'h-52 w-full object-contain sm:h-64'} />
      {anh.length > 1 && <><button type="button" aria-label="Ảnh trước" onClick={() => chuyenAnh(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2 text-emerald-900 shadow"><ChevronLeft size={20} /></button><button type="button" aria-label="Ảnh sau" onClick={() => chuyenAnh(1)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2 text-emerald-900 shadow"><ChevronRight size={20} /></button><span aria-live="polite" className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-2 py-1 text-xs text-[#607568]">{viTri + 1}/{anh.length}</span></>}
      {!phongTo && <button type="button" aria-label="Phóng to ảnh đồ vật" aria-haspopup="dialog" onClick={() => datMoAnh(true)} className="absolute bottom-3 right-3 rounded-full bg-white/95 p-2 text-emerald-900 shadow"><ZoomIn size={18} /></button>}
    </div>
  }
  return <>
    <section aria-label="Thông tin đồ vật" className="border-t border-[#edf2ee] p-5 sm:p-6">
      <div className={`grid items-center gap-6 sm:gap-8 ${hienTai ? 'sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]' : ''}`}>
        {hienTai && boSuuTap()}
        <div className="min-w-0 space-y-5">
          <h2 className="font-bold text-[#315a43]">Thông tin đồ vật</h2>
          <dl className="grid gap-4 text-sm">{thongTin.map(([nhan, value]) => <div key={nhan}><dt className="text-xs text-[#718276]">{nhan}</dt><dd className="mt-1 break-words font-medium text-[#315a43]">{value}</dd></div>)}</dl>
          {yc.tin_dang_id && <Link to={`/chi-tiet-tin-dang?id=${yc.tin_dang_id}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg text-sm font-semibold text-emerald-800 hover:underline focus-visible:outline-2 focus-visible:outline-emerald-700">Xem tin gốc<ArrowUpRight size={16} aria-hidden="true" /></Link>}
        </div>
      </div>
    </section>
    {moAnh && hienTai && <HopThoai rong tieuDe="Ảnh đồ vật" khiDong={() => datMoAnh(false)}><div className="p-3">{boSuuTap(true)}</div></HopThoai>}
  </>
}
