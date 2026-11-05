import { useState } from 'react'
import Button from '../../components/shared/Button'
import HopThoai from '../../components/shared/HopThoai'
import MenuThaoTac from '../../components/shared/MenuThaoTac'
import TruongNoiDungTinDang from '../../components/tin-dang/TruongNoiDungTinDang'
import { layNgayVietNam } from '../admin/tong-quan/hooks/xuLyThongKe.js'
import useThaoTacTinDang from './hooks/useThaoTacTinDang'

const cacMucSapCo = [
  { id: 'chia_se', nhan: 'Chia sẻ tin', voHieu: true, lyDo: 'Chưa có chức năng chia sẻ tin' },
  { id: 'to_cao', nhan: 'Tố cáo tin', voHieu: true, lyDo: 'Chưa có chức năng tố cáo tin' },
]

export default function ThaoTacTinDang({ tin, taiLai }) {
  const { laChuTin, thaoTac, banSua, loi, dangGui, moThaoTac, dongThaoTac, doiTruong, guiThaoTac } = useThaoTacTinDang(tin, taiLai)
  const [ngayToiDa] = useState(() => layNgayVietNam(new Date()))
  const cacThaoTac = laChuTin ? [
    { id: 'sua', nhan: 'Sửa tin', khiChon: () => moThaoTac('sua') },
    ...cacMucSapCo,
    { id: 'xoa', nhan: 'Xóa tin', khiChon: () => moThaoTac('xoa'), nguyHiem: true },
  ] : cacMucSapCo
  const lopNutHuy = 'rounded-xl border border-[#ceded3] px-4 py-2.5 text-sm font-semibold text-[#315a43] hover:bg-emerald-50 disabled:opacity-50'

  return (
    <>
      <MenuThaoTac nhan={`Thao tác với tin ${tin.title}`} cacThaoTac={cacThaoTac} />
      {laChuTin && thaoTac === 'sua' && (
        <HopThoai rong tieuDe="Sửa tin" khiDong={dongThaoTac}>
          <form onSubmit={guiThaoTac} className="space-y-4 p-5 sm:p-6">
            {banSua ? (
              <fieldset disabled={dangGui} className="min-w-0 space-y-4">
                <TruongNoiDungTinDang {...banSua} ngayToiDa={ngayToiDa} doiTruong={doiTruong} />
              </fieldset>
            ) : !loi && <p role="status" className="text-sm text-[#607568]">Đang tải nội dung tin…</p>}
            {loi && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className={lopNutHuy} onClick={dongThaoTac} disabled={dangGui}>Hủy</button>
              <Button type="submit" disabled={dangGui || !banSua}>{dangGui ? 'Đang lưu…' : 'Lưu thay đổi'}</Button>
            </div>
          </form>
        </HopThoai>
      )}
      {laChuTin && thaoTac === 'xoa' && (
        <HopThoai tieuDe="Xóa tin này?" moTa={`Tin “${tin.title}” sẽ được gỡ khỏi danh sách công khai.`} khiDong={dongThaoTac}>
          <div className="space-y-4 p-5 sm:p-6">
            {loi && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className={lopNutHuy} onClick={dongThaoTac} disabled={dangGui}>Hủy</button>
              <button type="button" className="rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-50" onClick={guiThaoTac} disabled={dangGui}>{dangGui ? 'Đang xóa…' : 'Xóa tin'}</button>
            </div>
          </div>
        </HopThoai>
      )}
    </>
  )
}
