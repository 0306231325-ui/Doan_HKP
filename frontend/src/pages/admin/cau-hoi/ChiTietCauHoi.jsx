import { cacKieuNhap } from '../../../components/shared/quyTacCauHoi.js'
import HopThoai from '../../../components/shared/HopThoai'
import LichSuCauHoi from './LichSuCauHoi'
import { layNhanPhamVi } from './hooks/xuLyCauHoi.js'

export default function ChiTietCauHoi({ cauHoiChon, danhMuc, dongChiTiet, moSua }) {
  const cauHoi = cauHoiChon
  const lichSu = [...(cauHoi.lichSu || [])].sort((a, b) => b.phienBan - a.phienBan)

  return (
    <HopThoai tieuDe="Chi tiết câu hỏi" moTa={layNhanPhamVi(cauHoi, danhMuc)} khiDong={dongChiTiet}>
      <div className="space-y-5 px-5 py-5 sm:px-6">
        <h3 className="break-words text-base font-semibold leading-7 text-[#243c30]">{cauHoi.nhanDangTin}</h3>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          {[['Kiểu trả lời', cacKieuNhap[cauHoi.kieuNhap] || 'Kiểu cũ'], ['Thứ tự', cauHoi.thuTu], ['Trạng thái', cauHoi.dangHoatDong ? 'Đang dùng' : 'Ngừng sử dụng']].map(([nhan, giaTri]) => <div key={nhan}><dt className="text-xs text-[#718276]">{nhan}</dt><dd className="mt-1 font-medium text-[#243c30]">{giaTri}</dd></div>)}
        </dl>
        <p className="text-sm leading-6 text-[#607568]">Dùng cho cả tin báo mất và tin nhặt được.</p>
        <LichSuCauHoi lichSu={lichSu} danhMuc={danhMuc} />
      </div>
      <div className="flex justify-end gap-3 border-t border-[#e1eae4] px-5 py-4 sm:px-6"><button type="button" onClick={dongChiTiet} className="rounded-xl border border-[#ceded3] px-4 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-emerald-50">Đóng</button><button type="button" onClick={() => moSua(cauHoi)} className="rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Chỉnh sửa</button></div>
    </HopThoai>
  )
}
