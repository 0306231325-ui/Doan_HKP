import { cacKieuNhap } from '../../../components/shared/quyTacCauHoi.js'
import { useEffect, useRef } from 'react'
import HopThoai from '../../../components/shared/HopThoai'
import { layNhanPhamVi } from './hooks/xuLyCauHoi.js'

export default function XacNhanCauHoi({ thaoTacChoXacNhan, danhMuc, dangLuu, loiLuu, dongXacNhanThaoTac, xacNhanThaoTac }) {
  const { loai, cauHoi } = thaoTacChoXacNhan
  const laLuu = loai === 'luu'
  const nhan = laLuu ? cauHoi.id ? 'Lưu thay đổi' : 'Thêm câu hỏi' : loai === 'xoa' ? 'Xóa câu hỏi' : cauHoi.dangHoatDong ? 'Ẩn câu hỏi' : 'Mở lại câu hỏi'
  const nutHuy = useRef(null)

  useEffect(function tapTrungNutHuy() {
    nutHuy.current?.focus()
  }, [])

  return (
    <HopThoai tieuDe={`Xác nhận ${nhan.toLowerCase()}`} khiDong={dongXacNhanThaoTac}>
      <div className="space-y-3 px-5 py-5 sm:px-6">
        <p className="break-words text-sm font-semibold leading-6 text-[#243c30]">{cauHoi.nhanDangTin.trim()}</p>
        <p className="text-sm text-[#607568]">{layNhanPhamVi(cauHoi, danhMuc)}</p>
        {laLuu && <p className="text-sm text-[#607568]">Kiểu trả lời: {cacKieuNhap[cauHoi.kieuNhap]}</p>}
        <p className="text-sm leading-6 text-[#607568]">{laLuu ? 'Bạn có muốn lưu câu hỏi này?' : loai === 'xoa' ? 'Câu hỏi sẽ bị xóa. Chỉ xóa được câu hỏi chưa có lịch sử hoặc câu trả lời.' : cauHoi.dangHoatDong ? 'Câu hỏi sẽ không xuất hiện trong form mới. Các phiên bản đã lưu vẫn được giữ lại.' : 'Câu hỏi sẽ được dùng lại.'}</p>
        {loiLuu && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm leading-6 text-rose-700">{loiLuu}</p>}
      </div>
      <div className="flex justify-end gap-3 border-t border-[#e1eae4] px-5 py-4 sm:px-6"><button ref={nutHuy} disabled={dangLuu} type="button" onClick={dongXacNhanThaoTac} className="rounded-xl border border-[#ceded3] px-4 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-700">Hủy</button><button type="button" disabled={dangLuu} onClick={xacNhanThaoTac} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-emerald-700 ${loai === 'xoa' ? 'bg-rose-700 hover:bg-rose-800' : 'bg-emerald-900 hover:bg-emerald-800'}`}>{dangLuu ? 'Đang lưu…' : laLuu ? 'Xác nhận lưu' : nhan}</button></div>
    </HopThoai>
  )
}
