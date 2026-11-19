import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import Button from '../../components/shared/Button'
import HopThoai from '../../components/shared/HopThoai'
import MenuThaoTac from '../../components/shared/MenuThaoTac'
import TruongNoiDungTinDang from '../../components/tin-dang/TruongNoiDungTinDang'
import { layNgayVietNam } from '../admin/tong-quan/hooks/xuLyThongKe.js'
import useThaoTacTinDang from './hooks/useThaoTacTinDang'

const mucToCao = { id: 'to_cao', nhan: 'Tố cáo tin', voHieu: true, lyDo: 'Chưa có chức năng tố cáo tin' }
const noiDungXacNhan = {
  luu: { tieuDe: 'Xác nhận lưu thay đổi', moTa: 'Bạn có muốn lưu nội dung vừa chỉnh sửa cho tin này?' },
  huy: { tieuDe: 'Bỏ thay đổi?', moTa: 'Nội dung vừa chỉnh sửa sẽ không được lưu.' },
}

export default function ThaoTacTinDang({ tin, taiLai, hienNutTrucTiep = false, quayLaiKhiXoa }) {
  const { laChuTin, thaoTac, choXacNhan, banSua, loi, lyDoXoa, datLyDoXoa, dangGui, moThaoTac, dongThaoTac, doiTruong, yeuCauLuu, xacNhanThaoTac } = useThaoTacTinDang(tin, taiLai, quayLaiKhiXoa)
  const [ngayToiDa] = useState(() => layNgayVietNam(new Date()))
  const nutQuayLai = useRef(null)
  const nutHuy = useRef(null)
  const nutLuu = useRef(null)
  const xacNhanTruoc = useRef('')
  const xacNhan = noiDungXacNhan[choXacNhan]
  const laBoThayDoi = choXacNhan === 'huy'
  const cacThaoTac = laChuTin ? [
    ...(!tin.daHoanTat ? [{ id: 'sua', nhan: 'Sửa tin', khiChon: () => moThaoTac('sua') }] : []),
    { id: 'xoa', nhan: 'Xóa tin', khiChon: () => moThaoTac('xoa'), nguyHiem: true },
  ] : [mucToCao]
  const lopNutHuy = 'rounded-xl border border-[#ceded3] px-4 py-2.5 text-sm font-semibold text-[#315a43] hover:bg-emerald-50 disabled:opacity-50'
  const lopNutNguyHiem = 'rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-50'

  useEffect(function doiFocusXacNhan() {
    if (choXacNhan) {
      nutQuayLai.current?.focus()
    } else if (xacNhanTruoc.current) {
      const nut = xacNhanTruoc.current === 'huy' ? nutHuy : nutLuu
      nut.current?.focus()
    }
    xacNhanTruoc.current = choXacNhan
  }, [choXacNhan])

  return (
    <>
      {hienNutTrucTiep ? laChuTin && (
        <>
          {tin.daHoanTat ? <p role="status" className="w-full text-sm font-semibold text-emerald-900">Tin đăng đã hoàn thành.</p> : <Button className="inline-flex items-center gap-2" aria-haspopup="dialog" onClick={() => moThaoTac('sua')}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Chỉnh sửa
          </Button>}
          <button type="button" aria-haspopup="dialog" onClick={() => moThaoTac('xoa')} className="inline-flex min-h-[46px] items-center gap-2 rounded-[14px] border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Xóa tin
          </button>
        </>
      ) : <MenuThaoTac nhan={`Thao tác với tin ${tin.title}`} cacThaoTac={cacThaoTac} />}
      {laChuTin && !tin.daHoanTat && thaoTac === 'sua' && (
        <HopThoai rong={!xacNhan} tieuDe={xacNhan?.tieuDe ?? 'Sửa tin'} moTa={xacNhan?.moTa} khiDong={dongThaoTac}>
          {xacNhan ? <div className="space-y-4 p-5 sm:p-6" aria-busy={dangGui}>
            {loi && !laBoThayDoi && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
            <div className="flex flex-wrap justify-end gap-3">
              <button ref={nutQuayLai} type="button" className={lopNutHuy} onClick={dongThaoTac} disabled={dangGui}>Tiếp tục chỉnh sửa</button>
              {laBoThayDoi ? <button type="button" className={lopNutNguyHiem} onClick={xacNhanThaoTac}>Bỏ thay đổi</button> : <Button onClick={xacNhanThaoTac} disabled={dangGui}>{dangGui ? 'Đang lưu…' : 'Xác nhận lưu'}</Button>}
            </div>
          </div> : <form onSubmit={yeuCauLuu} className="space-y-4 p-5 sm:p-6">
            {banSua ? (
              <fieldset disabled={dangGui} className="min-w-0 space-y-4">
                <TruongNoiDungTinDang {...banSua} ngayToiDa={ngayToiDa} doiTruong={doiTruong} />
              </fieldset>
            ) : !loi && <p role="status" className="text-sm text-[#607568]">Đang tải nội dung tin…</p>}
            {loi && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
            <div className="flex flex-wrap justify-end gap-3">
              <button ref={nutHuy} type="button" className={lopNutHuy} onClick={dongThaoTac}>Hủy</button>
              <Button ref={nutLuu} type="submit" disabled={!banSua}>Lưu thay đổi</Button>
            </div>
          </form>}
        </HopThoai>
      )}
      {laChuTin && thaoTac === 'xoa' && (
        <HopThoai tieuDe="Xóa tin này?" moTa={`Tin “${tin.title}” sẽ được gỡ khỏi danh sách công khai.`} khiDong={dongThaoTac}>
          <form onSubmit={(suKien) => { suKien.preventDefault(); xacNhanThaoTac() }} className="space-y-4 p-5 sm:p-6">
            <label className="block text-sm font-semibold text-[#315a43]">
              Lý do xóa tin <span className="text-rose-700">*</span>
              <textarea value={lyDoXoa} onChange={(suKien) => datLyDoXoa(suKien.target.value)} required maxLength={1000} rows={3} disabled={dangGui} placeholder="Nhập lý do bạn muốn xóa tin này" className="mt-2 w-full rounded-xl border border-[#ceded3] p-3 font-normal focus:outline-2 focus:outline-emerald-700" />
            </label>
            {loi && <p role="alert" className="text-sm text-rose-700">{loi}</p>}
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className={lopNutHuy} onClick={dongThaoTac} disabled={dangGui}>Hủy</button>
              <button type="submit" className={lopNutNguyHiem} disabled={dangGui || !lyDoXoa.trim()}>{dangGui ? 'Đang xóa…' : 'Xóa tin'}</button>
            </div>
          </form>
        </HopThoai>
      )}
    </>
  )
}
