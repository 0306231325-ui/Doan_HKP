import HopThoai from '../../../components/HopThoai'
import { cacKieuNhap } from './hooks/xuLyCauHoi.js'

export default function LichSuCauHoi({ lichSu, dongLichSu }) {
  return (
    <HopThoai tieuDe="Lịch sử câu hỏi" moTa="Mỗi bản giữ nguyên nội dung, lựa chọn và cấu hình tại thời điểm lưu." khiDong={dongLichSu}>
      <ol className="space-y-4 px-5 py-5 sm:px-6">
        {lichSu.map((muc, viTri) => <li key={muc.id} className="rounded-xl border border-[#d6e4db] p-4">
          <p className="text-xs font-semibold text-emerald-800">Bản {muc.phienBan}{viTri === 0 ? ' · Mới nhất' : ''}</p>
          <h3 className="mt-2 break-words text-sm font-semibold leading-6 text-[#243c30]">{muc.nhanDangTin}</h3>
          <p className="mt-1 text-xs leading-6 text-[#718276]">{cacKieuNhap[muc.kieuNhap]} · Thứ tự {muc.thuTu}</p>
          {muc.luaChon.length > 0 && <ul className="mt-2 list-inside list-disc text-xs leading-6 text-[#526c5b]">{muc.luaChon.map((luaChon) => <li key={luaChon.id}>{luaChon.nhan}</li>)}</ul>}
          <dl className="mt-3 space-y-2 text-xs leading-5 text-[#687d70]">
            {Object.entries({ mat: 'Tin mất', nhat: 'Tin nhặt được' }).map(([loai, nhan]) => <div key={loai}><dt className="font-semibold text-[#243c30]">{nhan}</dt><dd>{!muc.apDung[loai].suDung ? 'Không áp dụng' : `${muc.apDung[loai].batBuoc ? 'Bắt buộc' : 'Không bắt buộc'} · ${muc.apDung[loai].congKhai ? 'Công khai' : 'Giữ kín'}`}</dd></div>)}
            {muc.apDung.nhat.dungXacMinh && <div><dt className="font-semibold text-[#243c30]">Xác minh nhận lại{muc.apDung.nhat.batBuocNhanLai ? ' · Bắt buộc' : ' · Không bắt buộc'}</dt><dd className="mt-1 break-words">{muc.nhanNhanLai}</dd></div>}
          </dl>
        </li>)}
      </ol>
    </HopThoai>
  )
}
