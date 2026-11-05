import { useEffect, useRef, useState } from 'react'
import FormField from '../../../components/shared/FormField'
import HopThoai from '../../../components/shared/HopThoai'

export default function XacNhanThaoTac({ thaoTacChoXacNhan, danhSach, dangLuu, danhMucDangDoi, loiThaoTac, dongXacNhanThaoTac, xacNhanThaoTac }) {
  const { danhMuc, loai } = thaoTacChoXacNhan
  const dangXuLy = dangLuu || Boolean(danhMucDangDoi)
  const nutHuy = useRef(null)
  const doiThuTu = loai === 'doi-thu-tu'
  const [viTri, datViTri] = useState(danhMuc.stt)
  const nhan = { them: 'Thêm', xoa: 'Xóa', mo: 'Mở', an: 'Ẩn', 'doi-thu-tu': 'Đổi thứ tự' }[loai]

  useEffect(function tapTrungNutHuy() {
    nutHuy.current?.focus()
  }, [])

  return (
    <HopThoai tieuDe={loai === 'them' ? 'Xác nhận thêm danh mục' : `${nhan} danh mục?`} khiDong={dongXacNhanThaoTac}>
      <div aria-busy={dangXuLy} className="space-y-3 px-5 py-5 sm:px-6">
        <p className="break-words text-sm font-semibold text-[#243c30]">{danhMuc.tenDanhMuc}</p>
        {loai === 'them' && <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#607568]">{danhMuc.moTa || 'Không có mô tả.'}</p>}
        {doiThuTu ? (
          <>
            <p className="text-sm text-[#607568]">Vị trí hiện tại là {danhMuc.stt}.</p>
            <FormField as="select" name="viTri" label="Vị trí mới" value={viTri} onChange={(suKien) => datViTri(Number(suKien.target.value))} disabled={dangXuLy} className="w-full rounded-xl border border-[#ceded3] bg-white px-3 py-2.5 text-sm text-[#243c30]">
              {danhSach.map((muc, index) => <option key={muc.id} value={index + 1}>{index + 1}</option>)}
            </FormField>
          </>
        ) : <p className="text-sm leading-6 text-[#607568]">{loai === 'them' ? 'Bạn có muốn thêm danh mục này?' : loai === 'xoa' ? 'Danh mục sẽ bị xóa vĩnh viễn. Chỉ xóa được danh mục chưa có tin đăng hoặc câu hỏi.' : loai === 'mo' ? 'Danh mục sẽ được chọn lại khi đăng tin và tra cứu.' : 'Danh mục sẽ không còn được chọn khi đăng tin và tra cứu. Các tin cũ được giữ nguyên.'}</p>}
        {loiThaoTac && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm leading-6 text-rose-700">{loiThaoTac}</p>}
      </div>
      <div className="flex justify-end gap-3 border-t border-[#e1eae4] bg-[#f9fbfa] px-5 py-4 sm:px-6">
        <button ref={nutHuy} type="button" disabled={dangXuLy} onClick={dongXacNhanThaoTac} className="rounded-xl border border-[#ceded3] bg-white px-5 py-2.5 text-sm font-semibold text-[#526c5b] hover:bg-[#f0f6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-50">Hủy</button>
        <button type="button" disabled={dangXuLy || (doiThuTu && viTri === danhMuc.stt)} onClick={() => xacNhanThaoTac(viTri)} className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-50 ${loai === 'xoa' ? 'bg-rose-700 hover:bg-rose-800' : 'bg-emerald-900 hover:bg-emerald-800'}`}>{dangXuLy ? 'Đang xử lý…' : doiThuTu ? 'Lưu thứ tự' : loai === 'them' ? 'Xác nhận thêm' : `${nhan} danh mục`}</button>
      </div>
    </HopThoai>
  )
}
